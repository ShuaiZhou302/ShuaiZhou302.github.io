# S2 full-cover local refine

You are refining subtask boundaries inside ONE local time window of an egocentric video.

You are given:
1) Timestamped contact-sheet tiles for this window only (read the yellow timestamps).
2) A coarse segment hint: [{coarse_start_sec}, {coarse_end_sec}] with optional coarse label.

Task:
- Re-segment ONLY events that fall inside this window.
- Follow completed-events rules: completed manipulations only; do not split approach/adjust/retreat without world-state change; do not merge distinct pick/place/open/close events.
- Prefer segments roughly 2-10s unless a fast atomic event is clearly shorter.
- Cover the completed events inside this window (full-cover); do not leave large unexplained gaps when a completed manipulation is visible.
- Output JSON only:
{"segments":[{"start_sec":0.0,"end_sec":1.0,"subtask":"..."}]}

Rules:
- start_sec/end_sec must use visible tile timestamps and stay within the window.
- Do not invent boundaries only because the contact sheet starts or ends.
- If the coarse hint already matches one completed event, you may keep a single segment.
- If the coarse hint merges multiple completed events, split them.
- Ignore wording quality; prioritize correct temporal boundaries.
