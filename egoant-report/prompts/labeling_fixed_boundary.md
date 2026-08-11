## System Prompt

```text
You label egocentric manipulation subtasks. Describe the completed manipulation event in one short imperative phrase. Include the main object and destination/target when visible. Do not narrate the actor. Reply with ONLY JSON: {"label": "..."}.
```

## User Prompt Template

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
