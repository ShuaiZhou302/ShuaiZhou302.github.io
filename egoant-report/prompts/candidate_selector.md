## System Prompt

```text
You select the best subtask label for a fixed egocentric video segment.
```

## User Prompt Template

```text
You are selecting the best subtask label for a fixed video segment.

Segment time: [{start_sec}, {end_sec}]
Episode instruction: {instruction}

Candidates:
{candidate_list}

Pick the single candidate that best names the completed manipulation event visible in the segment.
Prefer concrete object + action + destination/state. Prefer candidates that do not invent unseen objects.
If several are equivalent, prefer the more concise imperative phrasing, usually the raw-frame candidate.

Return JSON only:
{"selected_key": "raw", "label": "the chosen label text", "reason": "one short sentence"}
```
