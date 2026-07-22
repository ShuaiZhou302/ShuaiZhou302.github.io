#!/usr/bin/env python3
"""Remeasure WGO HomER raw-only / selector labeling token usage on locked S2 boundaries."""
from __future__ import annotations

import argparse
import base64
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import cv2
import numpy as np
import requests

# api_usage from EgoVid Annotate (EgoVid_annotate) repo on LFT
sys.path.insert(0, "/data/LFT-W02_data/shuaizhou/human_video_data/EgoVid_annotate/scripts")
from api_usage import append_usage, summarize_usage, usage_event  # noqa: E402

SYSTEM = "You label egocentric hand-object subtasks. Reply with a short imperative English label."
PROMPT_RAW = (
    "You are given several frames from ONE subtask segment of an egocentric video. "
    "Write one short imperative subtask label for the completed action in this segment."
)
PROMPT_SEL = (
    "Pick the best short imperative subtask label for the CURRENT segment among candidates. "
    "Reply with JSON: {\"choice\": \"A|B|C|D\", \"label\": \"...\"}."
)


def encode_bgr(frame: np.ndarray, max_side: int = 1120, quality: int = 85) -> bytes:
    h, w = frame.shape[:2]
    scale = min(1.0, max_side / max(h, w))
    if scale < 1.0:
        frame = cv2.resize(frame, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    ok, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ok:
        raise RuntimeError("jpeg encode failed")
    return buf.tobytes()


def sample_indices(nframes: int, start_f: int, end_f: int, n: int) -> list[int]:
    start_f = max(0, min(nframes - 1, start_f))
    end_f = max(start_f, min(nframes - 1, end_f))
    if n <= 1:
        return [start_f]
    return [int(round(start_f + i * (end_f - start_f) / (n - 1))) for i in range(n)]


def load_frames(video: Path, start_sec: float, end_sec: float, n: int, max_side: int) -> list[bytes]:
    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"cannot open {video}")
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 30.0)
    nframes = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    start_f = int(round(start_sec * fps))
    end_f = int(round(end_sec * fps))
    idxs = sample_indices(nframes, start_f, end_f, n)
    out = []
    for idx in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, fr = cap.read()
        if ok and fr is not None:
            out.append(encode_bgr(fr, max_side=max_side))
    cap.release()
    if not out:
        raise RuntimeError(f"no frames {video} {start_sec}-{end_sec}")
    return out


def post_chat(base_url: str, model: str, api_key: str, payload: dict, timeout: float) -> dict:
    r = requests.post(
        f"{base_url.rstrip('/')}/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json=payload,
        timeout=timeout,
    )
    r.raise_for_status()
    return r.json()


def call_with_usage(
    *,
    base_url: str,
    model: str,
    api_key: str,
    payload: dict,
    stage: str,
    usage_path: Path,
    timeout: float,
    retries: int = 3,
) -> dict:
    last_err = None
    for attempt in range(1, retries + 1):
        t0 = time.time()
        try:
            data = post_chat(base_url, model, api_key, payload, timeout)
            evt = usage_event(data, stage=stage, model=model, latency_sec=time.time() - t0, success=True, attempt=attempt)
            append_usage(usage_path, evt)
            return data
        except Exception as e:
            last_err = e
            evt = usage_event(
                None,
                stage=stage,
                model=model,
                latency_sec=time.time() - t0,
                success=False,
                attempt=attempt,
                error=f"{type(e).__name__}: {e}",
            )
            append_usage(usage_path, evt)
            time.sleep(min(2 * attempt, 8))
    raise RuntimeError(last_err)


def make_label_payload(model: str, frames: list[bytes], instruction: str) -> dict:
    content = [{"type": "text", "text": f"{PROMPT_RAW}\nEpisode task (context only): {instruction}\nLabel CURRENT segment only."}]
    for b in frames:
        content.append({"type": "image_url", "image_url": {"url": "data:image/jpeg;base64," + base64.b64encode(b).decode("ascii")}})
    return {
        "model": model,
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": content}],
        "max_tokens": 128,
        "temperature": 0.0,
        "chat_template_kwargs": {"enable_thinking": False},
    }


def make_selector_payload(model: str, instruction: str, cands: dict[str, str]) -> dict:
    lines = [f"{k}: {v}" for k, v in cands.items()]
    text = f"{PROMPT_SEL}\nEpisode task: {instruction}\nCandidates:\n" + "\n".join(lines)
    return {
        "model": model,
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": text}],
        "max_tokens": 128,
        "temperature": 0.0,
        "chat_template_kwargs": {"enable_thinking": False},
    }


def make_judge_payload(model: str, pred: str, gold: str) -> dict:
    text = (
        "Do these two short subtask labels describe the same completed hand-object event? "
        f'Reply JSON {{"match": true|false}}.\nPred: {pred}\nGold: {gold}'
    )
    return {
        "model": model,
        "messages": [{"role": "user", "content": text}],
        "max_tokens": 64,
        "temperature": 0.0,
        "chat_template_kwargs": {"enable_thinking": False},
    }


def process_episode(
    label_path: Path,
    video: Path,
    out_dir: Path,
    recipe: str,
    urls: list[str],
    model: str,
    api_key: str,
    frames_per: int,
    max_side: int,
    timeout: float,
    workers: int,
) -> dict:
    d = json.loads(label_path.read_text())
    ep = d["id"]
    instruction = d.get("instruction") or ""
    segs = d.get("segments") or []
    usage_path = out_dir / ep / "api_usage.jsonl"
    usage_path.parent.mkdir(parents=True, exist_ok=True)
    if usage_path.exists():
        usage_path.unlink()

    jobs = []
    for i, seg in enumerate(segs):
        jobs.append((i, seg))

    def one(job):
        i, seg = job
        url = urls[i % len(urls)]
        frames = load_frames(video, float(seg["start_sec"]), float(seg["end_sec"]), frames_per, max_side)
        if recipe == "raw_only":
            call_with_usage(
                base_url=url,
                model=model,
                api_key=api_key,
                payload=make_label_payload(model, frames, instruction),
                stage="labeling_raw",
                usage_path=usage_path,
                timeout=timeout,
            )
        else:
            # Approximate 4 visual candidates with 4 raw-like calls (same frame pack);
            # then 1 text selector. Matches fan-out cost structure of selector recipe.
            cands = {}
            for name in ("raw", "rawprior", "seed", "ffmpeg"):
                data = call_with_usage(
                    base_url=url,
                    model=model,
                    api_key=api_key,
                    payload=make_label_payload(model, frames, instruction),
                    stage=f"labeling_{name}",
                    usage_path=usage_path,
                    timeout=timeout,
                )
                msg = data["choices"][0]["message"]
                text = msg.get("content") or ""
                if isinstance(text, list):
                    text = " ".join(str(x.get("text", x)) for x in text if isinstance(x, dict))
                cands[name] = (text or "").strip().splitlines()[0][:120] or name
            call_with_usage(
                base_url=url,
                model=model,
                api_key=api_key,
                payload=make_selector_payload(model, instruction, cands),
                stage="candidate_selector",
                usage_path=usage_path,
                timeout=timeout,
            )
        return i

    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(one, j) for j in jobs]
        for f in as_completed(futs):
            f.result()

    summary = summarize_usage(usage_path, out_dir / ep / "token_usage.json")
    return {"episode": ep, "n_segments": len(segs), "summary": summary}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--labels-dir", type=Path, required=True)
    ap.add_argument("--video-dir", type=Path, required=True)
    ap.add_argument("--out-dir", type=Path, required=True)
    ap.add_argument("--recipe", choices=("raw_only", "selector"), required=True)
    ap.add_argument("--ids", nargs="*", default=None, help="subset episode ids e.g. homer_52")
    ap.add_argument("--base-urls", nargs="+", required=True)
    ap.add_argument("--model", default="Qwen/Qwen3.5-397B-A17B-FP8")
    ap.add_argument("--api-key", default="local-vllm")
    ap.add_argument("--frames-per-segment", type=int, default=5)
    ap.add_argument("--image-max-side", type=int, default=1120)
    ap.add_argument("--timeout", type=float, default=180)
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(args.labels_dir.glob("homer_*.json"))
    if args.ids:
        want = set(args.ids)
        files = [f for f in files if f.stem in want]
    results = []
    for fp in files:
        video = args.video_dir / f"{fp.stem}.mp4"
        if not video.exists():
            # alternate layout
            alt = args.video_dir / "homer" / f"{fp.stem}.mp4"
            video = alt if alt.exists() else video
        print(f"[start] {fp.stem} recipe={args.recipe} video={video}", flush=True)
        r = process_episode(
            fp,
            video,
            args.out_dir,
            args.recipe,
            args.base_urls,
            args.model,
            args.api_key,
            args.frames_per_segment,
            args.image_max_side,
            args.timeout,
            args.workers,
        )
        print(f"[done] {fp.stem} tokens={r['summary'].get('total_tokens')} req={r['summary'].get('requests')}", flush=True)
        results.append(r)

    # suite summary
    tot = {"requests": 0, "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0, "usage_reported_requests": 0}
    for r in results:
        s = r["summary"]
        for k in tot:
            tot[k] += int(s.get(k) or 0)
    out = {"recipe": args.recipe, "n_episodes": len(results), "totals": tot, "episodes": results}
    (args.out_dir / "suite_token_usage.json").write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(json.dumps({"suite": tot, "n_episodes": len(results)}, indent=2), flush=True)


if __name__ == "__main__":
    main()
