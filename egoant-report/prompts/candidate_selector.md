# WGO Candidate Selector Prompt

Source of truth: `SYSTEM_PROMPT` and `USER_PROMPT_TEMPLATE` in
`scripts/wgo_bench/run_wgo_candidate_selector.py`.

## Image Inputs

The selector is given the current segment visual evidence used for candidate
generation, typically current-segment contact sheets or raw-frame evidence.
Candidate labels are provided as text. Gold labels are never provided.

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
