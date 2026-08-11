# TODO: clarify adjacent-segment rule merges

Local follow-up for the video-segmentation section (§4.1, method 7).

## Current wording (already on main)
- Method list now says: scripts on existing predictions → attached after
  S2「窗口不外扩 + 覆盖完整动作提示词」→ then the three merge rules.
- Score-table / chart labels are prefixed with `S2 + 相邻片段规则合并`.

## Still needed
- Explain how the three merge strategies work in plain language:
  - merge adjacent segments with identical labels
  - merge by shared verb/object
  - bridge short temporal gaps, then merge
- Decide whether to link scripts, pseudocode, or appendix examples.

## Where
- `index.html` / `js/i18n.js`: `story.seg.7`
- score-table labels in `js/report.js`: `merge_exact`, `merge_verb`, `merge_bridge`
