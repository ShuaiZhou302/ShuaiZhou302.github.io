# WGO Fixed-Boundary Labeling Prompt

Source of truth: `SYSTEM`, `PROMPT_BY_INPUT`, and `call_label` in
`scripts/wgo_bench/label_gold_segments.py`.

## System Prompt

```text
You label egocentric manipulation subtasks. Describe the completed manipulation event in one short imperative phrase. Include the main object and destination/target when visible. Do not narrate the actor. Reply with ONLY JSON: {"label": "..."}.
```

## Image Inputs

The script supports four input modes:

- `raw`: ordered raw frames sampled uniformly from the current gold or predicted
  segment.
- `overlay`: ordered frames from the current segment with a 2D motion/hand
  trajectory overlay. If hand reconstruction is unavailable, an optical-flow
  proxy trail is used.
- `raw-hand-crop`: ordered raw frames plus one hand-focused crop grid from the
  same segment. The default WGO ablation crop is a center proxy; the
  `label_gold_segments_true_handcrop.py` wrapper replaces it with crops around
  estimated hand points when `hand_recon.json` is available.
- `temporal-collage`: three grids: PAST context, CURRENT target, and FUTURE
  context. Each grid has 6 raw frames in row-major order. The model labels only
  the CURRENT grid.

## User Text Template

The mode-specific intro is followed by:

```text
Episode task (context only): {instruction}
Label the CURRENT segment only.
```

The mode-specific intros are:

```text
raw:
I will send ordered raw frames sampled uniformly from one gold segment. Label the CURRENT segment only.

overlay:
I will send ordered frames from one gold segment. A 2D motion/hand trajectory is overlaid; color shows temporal progress. Label the CURRENT segment only.

raw-hand-crop:
I will send ordered raw frames plus one hand-focused crop grid from the same gold segment. Label the CURRENT segment only.

temporal-collage:
I will send three ordered frame grids: PAST context, CURRENT target, and FUTURE context. Each grid has 6 raw frames in row-major order. Label ONLY the visible completed action in the CURRENT grid. Use PAST/FUTURE only to disambiguate.
```
