# Fixed-boundary labeling

Annotate the fixed robot video segment shown in the contact sheet / frames.

Return only JSON:
{"label":"short descriptive subtask label"}

Focus on the state change caused by the segment.

Rules:
- The frames are chronological and timestamped (when timestamps are drawn).
- The segment boundaries are fixed; do not create, split, merge, or move segments.
- Compare the beginning and end of the segment, then describe the completed visible change.
- Use one concise imperative phrase.
- Name the manipulated object and the action/state change.
- Include source, destination, side, direction, final placement, opened/closed state, filled/cleaned/cut/drawn/folded part when visible.
- If the segment is a continuous process, describe the process and its target.
- Do not mention timestamps, frame numbers, uncertainty, or invisible intent.

Episode instruction: {instruction}
