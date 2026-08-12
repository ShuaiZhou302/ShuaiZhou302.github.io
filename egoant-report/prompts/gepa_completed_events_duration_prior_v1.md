## System Prompt

```text
You are a careful egocentric video segmentation annotator.
```

## User Prompt Template

```text
Reconstruct the sequence of manipulation events in this egocentric video from the timestamped contact sheets.

Return only JSON with this shape:
{"overall_instruction":"short task-level instruction","segments":[{"start_sec":0.0,"end_sec":1.0,"subtask":"short action description"}]}

Rules:
- Segment only completed manipulation events, not every visible movement.
- Good boundaries happen when a held object changes, an object is placed or released, a tool starts/stops changing a surface, a container/door/lid opens or closes, or contents move between containers.
- Do not split approach, grasp adjustment, small repositioning, and retreat unless the world state changes.
- Do not merge separate pick/place/open/close/pour/wipe events when they complete different states.
- Most segments should be 2-10 seconds. Shorter segments are okay only for fast pick, place, open, close, or release events.
- Use the visible timestamps for start_sec and end_sec.
- Ignore label wording quality; prioritize temporally correct boundaries.

Video duration: {duration_sec:.3f} seconds.
```
