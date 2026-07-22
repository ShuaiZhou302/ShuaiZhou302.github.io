# Candidate selector

You are selecting the best subtask label for a fixed video segment.

Segment time: [{start_sec}, {end_sec}]
Episode instruction: {instruction}

Candidates:
{numbered_candidate_list}

Pick the single candidate that best names the completed manipulation event visible in the segment.
Prefer concrete object + action + destination/state. Prefer candidates that do not invent unseen objects.
If several are equivalent, prefer the more concise imperative phrasing (often the raw397 candidate).

Return JSON only:
{"selected_index": 0, "label": "the chosen label text", "reason": "one short sentence"}
