## System Prompt

```text
You label egocentric manipulation subtasks. Describe the completed manipulation event in one short imperative phrase. Include the main object and destination/target when visible. Do not narrate the actor. Reply with ONLY JSON: {"label": "..."}.
```

## User Prompt Template

Image input: the images attached after this text depend on `mode_intro`.
For `raw`, they are uniformly sampled raw frames from the current segment.
For `overlay`, they are sampled frames with a heuristic motion/hand overlay.
For `raw-hand-crop`, they include raw frames plus a hand-focused crop grid.
For `temporal-collage`, they include past/current/future frame grids.

```text
{mode_intro}

Episode task (context only): {instruction}
Label the CURRENT segment only.
```

### mode_intro

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
