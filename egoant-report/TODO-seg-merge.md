# TODO: clarify adjacent-segment rule merges

Local follow-up for the video-segmentation section (§4.1, method 7).

## Needed
- Explain how the three merge strategies work in plain language:
  - merge adjacent segments with identical labels
  - merge by shared verb/object
  - bridge short temporal gaps, then merge
- Say clearly that these runs start from the best S2 prediction
  (`窗口不外扩并盖住完整动作`), not from every earlier method.
- Decide whether to link scripts, pseudocode, or appendix examples.
  Current report text intentionally omits “appendix download” wording.

## Where
- `index.html` / `js/i18n.js`: `story.seg.7`
- score-table labels in `js/report.js`: `merge_exact`, `merge_verb`, `merge_bridge`
