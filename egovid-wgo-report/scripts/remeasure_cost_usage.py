#!/usr/bin/env python3
"""Recount HomER-25 cost from artifacts; optionally remasure tokens via OpenAI-compatible API.

Usage (artifact counts only — always safe):
  python3 scripts/remeasure_cost_usage.py --labels-dir /path/to/e2e_0.1517_homer25_labels/labels \\
    --score-json /path/to/.../expS2_..._e2e_judge397.json \\
    --out data/cost.json

Usage (token remasure when vLLM/tunnel is up):
  export OPENAI_BASE_URL=http://127.0.0.1:PORT/v1
  export OPENAI_API_KEY=local-vllm
  python3 scripts/remeasure_cost_usage.py ... --probe-tokens --model Qwen/Qwen3.5-397B-A17B-FP8

This does NOT change Seg/E2E scores; it only refreshes cost accounting.
"""
from __future__ import annotations

import argparse
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def count_artifacts(labels_dir: Path, score_json: Path | None):
    files = sorted(labels_dir.glob("*.json"))
    n_seg = n_sheets = n_win = 0
    for f in files:
        d = load_json(f)
        n_seg += len(d.get("segments") or [])
        n_sheets += int(d.get("n_sheets") or 0)
        n_win += int(d.get("n_windows_refined") or 0)
    n_iou = 79
    if score_json and score_json.exists():
        micro = load_json(score_json).get("micro") or {}
        n_iou = int(micro.get("n_iou_match") or n_iou)
    n_ep = len(files)
    raw_total = n_ep + n_win + n_seg + n_iou
    sel_total = n_ep + n_win + n_seg * 4 + n_seg + n_iou
    return {
        "n_episodes": n_ep,
        "n_pred_segments": n_seg,
        "n_sheets_total": n_sheets,
        "n_s2_windows_total": n_win,
        "n_iou_match_judge": n_iou,
        "raw_api_total": raw_total,
        "selector_api_total": sel_total,
    }


def project_tokens(counts, img_lo=900, img_hi=1600, text=600, judge_text=400, frames=5):
    n_ep = counts["n_episodes"]
    n_win = counts["n_s2_windows_total"]
    n_sheet = counts["n_sheets_total"]
    n_seg = counts["n_pred_segments"]
    n_iou = counts["n_iou_match_judge"]

    def seg_tok(img):
        return (n_sheet + n_win) * img + (n_ep + n_win) * text

    def label_raw(img):
        return (n_seg * frames) * img + n_seg * text

    def label_sel(img):
        return (n_seg * 4 * frames) * img + (n_seg * 4 + n_seg) * text

    judge = n_iou * judge_text

    def pack(lab_fn):
        lo = seg_tok(img_lo) + lab_fn(img_lo) + judge
        hi = seg_tok(img_hi) + lab_fn(img_hi) + judge
        return lo, hi

    raw_lo, raw_hi = pack(label_raw)
    sel_lo, sel_hi = pack(label_sel)
    return {
        "raw": {"total_low": raw_lo, "total_high": raw_hi},
        "selector": {"total_low": sel_lo, "total_high": sel_hi},
    }


def probe_one_image_tokens(base_url: str, api_key: str, model: str, image_url: str | None):
    """Minimal chat completion to see if provider returns usage (text-only probe if no image)."""
    url = base_url.rstrip("/") + "/chat/completions"
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Reply with the single word: ok"}],
        "max_tokens": 8,
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        return {"ok": False, "error": str(e), "latency_sec": time.time() - t0}
    usage = body.get("usage") or {}
    return {
        "ok": True,
        "latency_sec": round(time.time() - t0, 3),
        "usage": usage,
        "usage_reported": bool(usage),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--labels-dir", type=Path, required=True)
    ap.add_argument("--score-json", type=Path, default=None)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--video-min", type=float, default=40.04)
    ap.add_argument("--probe-tokens", action="store_true")
    ap.add_argument("--model", default=os.environ.get("CAPTION_MODEL", "Qwen/Qwen3.5-397B-A17B-FP8"))
    args = ap.parse_args()

    counts = count_artifacts(args.labels_dir, args.score_json)
    toks = project_tokens(counts)
    vmin = args.video_min

    probe = None
    if args.probe_tokens:
        base = os.environ.get("OPENAI_BASE_URL") or os.environ.get("LOCAL_MODEL_BASE_URL")
        key = os.environ.get("OPENAI_API_KEY") or os.environ.get("LOCAL_MODEL_API_KEY") or "local-vllm"
        if not base:
            probe = {"ok": False, "error": "OPENAI_BASE_URL / LOCAL_MODEL_BASE_URL not set"}
        else:
            probe = probe_one_image_tokens(base, key, args.model, None)

    prev = {}
    if args.out.exists():
        try:
            prev = load_json(args.out)
        except Exception:
            prev = {}

    video = prev.get("video") or {
        "n_episodes": counts["n_episodes"],
        "total_min": vmin,
        "mean_sec": round(vmin * 60 / max(counts["n_episodes"], 1), 1),
        "total_sec": round(vmin * 60, 1),
    }

    kind = "hybrid"
    token_kind = "projection"
    if probe and probe.get("ok") and probe.get("usage_reported"):
        kind = "hybrid_api_reachable"
        token_kind = "projection_api_reachable_awaiting_full_replay"

    out = {
        "kind": kind,
        "note": (
            "API calls: artifact-counted from label JSON + E2E IoU matches. "
            "Tokens: projection until full usage-logged replay on locked S2 boundaries."
        ),
        "eval_subset": "HomER 25 episodes",
        "sources": {
            "labels_dir": str(args.labels_dir),
            "score_file": str(args.score_json) if args.score_json else None,
            "remeasure_script": "scripts/remeasure_cost_usage.py",
            "probe": probe,
        },
        "video": video,
        "recipe_counts": {
            "kind": "artifact_counted",
            "n_pred_segments": counts["n_pred_segments"],
            "n_sheets_total": counts["n_sheets_total"],
            "n_s2_windows_total": counts["n_s2_windows_total"],
            "n_iou_match_judge": counts["n_iou_match_judge"],
            "mean_sheets_per_ep": round(counts["n_sheets_total"] / max(counts["n_episodes"], 1), 2),
            "mean_pred_per_ep": round(counts["n_pred_segments"] / max(counts["n_episodes"], 1), 2),
            "mean_s2_windows_per_ep": round(counts["n_s2_windows_total"] / max(counts["n_episodes"], 1), 2),
        },
        "assumptions_tokens": prev.get("assumptions_tokens")
        or {
            "label_frames_per_segment": 5,
            "image_max_side": 1120,
            "candidate_paths": 4,
            "img_tokens_per_image": [900, 1600],
            "text_tokens_per_call": 600,
            "judge_text_tokens": 400,
            "status": "projection_pending_remeasure",
        },
        "recipes": {
            "raw_only": {
                "label": "S2 边界 + 单路 raw 标注",
                "e2e_f1": 0.1388,
                "api_calls": {
                    "kind": "artifact_counted",
                    "segmentation_whole_episode": counts["n_episodes"],
                    "segmentation_s2_refine": counts["n_s2_windows_total"],
                    "labeling": counts["n_pred_segments"],
                    "candidate_selector": 0,
                    "e2e_judge_text_only": counts["n_iou_match_judge"],
                    "total": counts["raw_api_total"],
                },
                "tokens": {
                    "kind": token_kind,
                    "total_low": toks["raw"]["total_low"],
                    "total_high": toks["raw"]["total_high"],
                    "per_video_minute_low": int(toks["raw"]["total_low"] / vmin),
                    "per_video_minute_high": int(toks["raw"]["total_high"] / vmin),
                },
            },
            "selector": {
                "label": "S2 边界 + 4 路候选 + selector",
                "e2e_f1": 0.1517,
                "api_calls": {
                    "kind": "artifact_counted",
                    "segmentation_whole_episode": counts["n_episodes"],
                    "segmentation_s2_refine": counts["n_s2_windows_total"],
                    "labeling": counts["n_pred_segments"] * 4,
                    "candidate_selector": counts["n_pred_segments"],
                    "e2e_judge_text_only": counts["n_iou_match_judge"],
                    "total": counts["selector_api_total"],
                },
                "tokens": {
                    "kind": token_kind,
                    "total_low": toks["selector"]["total_low"],
                    "total_high": toks["selector"]["total_high"],
                    "per_video_minute_low": int(toks["selector"]["total_low"] / vmin),
                    "per_video_minute_high": int(toks["selector"]["total_high"] / vmin),
                },
            },
        },
        "default_display": "both",
    }

    # Back-compat aliases for older report.js
    for key, recipe in out["recipes"].items():
        recipe["api_calls_estimate"] = recipe["api_calls"]
        recipe["tokens_estimate"] = recipe["tokens"]

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"wrote": str(args.out), "counts": counts, "probe": probe}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
