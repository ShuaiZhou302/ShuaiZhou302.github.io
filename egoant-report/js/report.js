/* EgoANT HomER blog report renderer */
(function () {
  // Keep chart and table on the same ordered path, including pad-out and merges.
  const MAIN_SEG_ORDER = [
    "egovid_baseline","cs_max3_397b","cs_max3_27b","whole_legacy_27b",
    "aligned_gepa_27b","s1_full25_397b","s2_full25_397b",
    "s2_pad0_plain_27b","s2_pad05_27b","s2_pad1_27b","s2_pad2_27b",
    "s2_midpoint_post","s2_fullcover_qwen36",
    "merge_exact","merge_verb","merge_bridge"
  ];
  const MAIN_SEG_IDS = new Set(MAIN_SEG_ORDER);
  // Group same visual input across models for side-by-side reading.
  const MAIN_LABEL_ORDER = [
    "raw_27b", "raw_397b",
    "temporal_collage_27b", "temporal_collage",
    "overlay_27b", "overlay_proxy",
    "l2_hawor_27b", "l2_hawor",
    "l1_neighbor_27b", "l1_neighbor",
    "l1_ts_rerun",
    "l2_proxy_27b", "l2_yolo_proxy",
  ];
  const PAD_SEG_IDS = new Set([
    "s2_pad0_plain_27b","s2_pad05_27b","s2_pad1_27b","s2_pad2_27b"
  ]);

  const ABLATION_I18N = {
    "egovid_baseline": {
      "zh": {
        "name": "腕速规则切段并合并",
        "note": "预测片段明显多于人工参考",
        "model": "规则方法（腕速低谷 + 合并）"
      },
      "en": {
        "name": "Wrist-speed rule cuts + merge",
        "note": "Far more predictions than human reference",
        "model": "rule-based (wrist minima + merge)"
      }
    },
    "cs_max3_397b": {
      "zh": {
        "name": "拼贴图分片（每次最多 3 张）· 397B",
        "note": "请求接缝处易出现伪边界",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Chunked contact sheets (max 3) · 397B",
        "note": "Fake boundaries at chunk seams",
        "model": "Qwen3.5-397B"
      }
    },
    "cs_max3_27b": {
      "zh": {
        "name": "拼贴图分片（每次最多 3 张）· 27B",
        "note": "同设置下小模型略优于大模型分片版",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Chunked contact sheets (max 3) · 27B",
        "note": "Smaller model beats large on same chunking",
        "model": "Qwen3.6-27B"
      }
    },
    "whole_legacy_27b": {
      "zh": {
        "name": "整集一次提交（无切段规则清单）· 27B",
        "note": "预测片段偏少",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Whole-episode (no rule list) · 27B",
        "note": "Too few predicted segments",
        "model": "Qwen3.6-27B"
      }
    },
    "aligned_gepa_27b": {
      "zh": {
        "name": "整集一次提交 + 切段规则清单 · 27B",
        "note": "比无规则清单更好，仍偏保守",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Whole-episode + rule list · 27B",
        "note": "Better than no-rule prompt; still conservative",
        "model": "Qwen3.6-27B"
      }
    },
    "s1_full25_397b": {
      "zh": {
        "name": "S1 加密切分 · 397B",
        "note": "召回上升，切分也更细",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "S1 denser cuts · 397B",
        "note": "Recall up; cuts also finer",
        "model": "Qwen3.5-397B"
      }
    },
    "s2_full25_397b": {
      "zh": {
        "name": "S2 局部精修·窗外扩约 1 秒 · 397B",
        "note": "窗外扩约 1 秒，无覆盖完整动作提示词",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "S2 local refine · ≈1s pad-out · 397B",
        "note": "About 1s pad-out; no cover-full-actions prompt",
        "model": "Qwen3.5-397B"
      }
    },
    "s2_pad0_plain_27b": {
      "zh": {
        "name": "S2 局部精修·窗口不外扩（无覆盖完整动作提示词）· 27B",
        "note": "窗口不外扩较好，但仍偏碎",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · no pad-out (no cover-full-actions prompt) · 27B",
        "note": "No pad-out helps; still shreddy",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad05_27b": {
      "zh": {
        "name": "S2 局部精修·窗外扩 0.5 秒 · 27B",
        "note": "向外多看 0.5 秒，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · pad-out 0.5s · 27B",
        "note": "Expanding 0.5s loses to no pad-out",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad1_27b": {
      "zh": {
        "name": "S2 局部精修·窗外扩 1.0 秒 · 27B",
        "note": "外扩 1 秒，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · pad-out 1.0s · 27B",
        "note": "1s pad-out worse than none",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad2_27b": {
      "zh": {
        "name": "S2 局部精修·窗外扩 2.0 秒 · 27B",
        "note": "外扩 2 秒，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · pad-out 2.0s · 27B",
        "note": "2s pad-out worse than none",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_midpoint_post": {
      "zh": {
        "name": "S2 局部精修·窗口不外扩 + 算法补覆盖 · 27B",
        "note": "算法补覆盖不及覆盖完整动作提示词",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · no pad-out + algorithmic cover · 27B",
        "note": "Algorithmic cover underperforms the cover-full-actions prompt",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_fullcover_qwen36": {
      "zh": {
        "name": "S2 局部精修·窗口不外扩 + 覆盖完整动作提示词 · 27B",
        "note": "已评测分段配置最高值",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 local refine · no pad-out + cover-full-actions prompt · 27B",
        "note": "Best segmentation so far",
        "model": "Qwen3.6-27B"
      }
    },
    "merge_exact": {
      "zh": {
        "name": "S2 + 相邻片段规则合并：合并相邻完全相同标签段",
        "note": "合并后视频分段得分下降",
        "model": "基于规则的后处理"
      },
      "en": {
        "name": "S2 + adjacent rule merge: identical labels",
        "note": "Segment F1 drops after merge",
        "model": "Rule-based post-processing"
      }
    },
    "merge_verb": {
      "zh": {
        "name": "S2 + 相邻片段规则合并：按动词/物体合并相邻段",
        "note": "更激进合并，视频分段得分再降",
        "model": "基于规则的后处理"
      },
      "en": {
        "name": "S2 + adjacent rule merge: verb/object",
        "note": "More aggressive merge; Segment F1 falls further",
        "model": "Rule-based post-processing"
      }
    },
    "merge_bridge": {
      "zh": {
        "name": "S2 + 相邻片段规则合并：跨短间隙桥接合并",
        "note": "跨短间隙合并，视频分段得分降低最多",
        "model": "基于规则的后处理"
      },
      "en": {
        "name": "S2 + adjacent rule merge: bridge short gaps",
        "note": "Largest drop among merges",
        "model": "Rule-based post-processing"
      }
    },
    "raw_397b": {
      "zh": {
        "name": "原始帧 · 397B",
        "note": "397B 原始帧基线",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Raw frames · 397B",
        "note": "Gemini-judge baseline",
        "model": "Qwen3.5-397B"
      }
    },
    "overlay_proxy": {
      "zh": {
        "name": "视觉提示叠加 · 397B",
        "note": "低于原始帧 · 397B",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Visual-hint overlay · 397B",
        "note": "Heuristic overlay; below raw",
        "model": "Qwen3.5-397B"
      }
    },
    "overlay_27b": {
      "zh": {
        "name": "视觉提示叠加 · 27B",
        "note": "低于原始帧 · 27B",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Visual-hint overlay · 27B",
        "note": "Approximate overlay; below raw 27B",
        "model": "Qwen3.6-27B"
      }
    },
    "temporal_collage": {
      "zh": {
        "name": "时序拼贴 · 397B",
        "note": "低于原始帧 · 397B",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Temporal collage · 397B",
        "note": "Context pollutes current label",
        "model": "Qwen3.5-397B"
      }
    },
    "temporal_collage_27b": {
      "zh": {
        "name": "时序拼贴 · 27B",
        "note": "低于原始帧 · 27B",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Temporal collage · 27B",
        "note": "Below raw 27B",
        "model": "Qwen3.6-27B"
      }
    },
    "raw_27b": {
      "zh": {
        "name": "原始帧 · 27B",
        "note": "本组最高",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Raw frames · 27B",
        "note": "Best fixed-boundary labels",
        "model": "Qwen3.6-27B"
      }
    },
    "predictions_labeling": {
      "zh": {
        "name": "原始帧重复审计 · 397B",
        "note": "与原始帧 · 397B 一致",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Raw-frame duplicate audit · Qwen3.5-397B",
        "note": "Matches raw 397B",
        "model": "Qwen3.5-397B"
      }
    },
    "l1_neighbor": {
      "zh": {
        "name": "邻段拼贴 · 397B",
        "note": "容易写到邻段动作",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Neighbor contact sheets (prev/cur/next)",
        "note": "Often labels neighboring actions",
        "model": "Qwen3.5-397B"
      }
    },
    "l1_ts_rerun": {
      "zh": {
        "name": "邻段拼贴 + 秒级时间戳 · 397B",
        "note": "修时间戳仍低",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Neighbor sheets + second-level timestamps",
        "note": "Fixing timestamps still lowers accuracy",
        "model": "Qwen3.5-397B"
      }
    },
    "l1_neighbor_27b": {
      "zh": {
        "name": "邻段拼贴 · 27B",
        "note": "略高于 397B 邻段，低于原始帧 · 27B",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Neighbor sheet · 27B",
        "note": "Slightly above 397B neighbor, below raw 27B",
        "model": "Qwen3.6-27B"
      }
    },
    "l2_yolo_proxy": {
      "zh": {
        "name": "近似手部拼贴 · 397B",
        "note": "启发式裁剪，低于原始帧",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Approximate hand collage · 397B",
        "note": "Heuristic crop, below raw frames",
        "model": "Qwen3.5-397B"
      }
    },
    "l2_hawor": {
      "zh": {
        "name": "HaWoR 腕轨迹裁剪 · 397B",
        "note": "略高于原始帧 · 397B，低于原始帧 · 27B",
        "model": "397B"
      },
      "en": {
        "name": "HaWoR wrist-guided crop · 397B",
        "note": "Slightly above raw 397B, below raw 27B",
        "model": "397B"
      }
    },
    "l2_hawor_27b": {
      "zh": {
        "name": "HaWoR 腕轨迹裁剪 · 27B",
        "note": "高于 397B 腕轨迹裁剪，低于原始帧 · 27B",
        "model": "27B"
      },
      "en": {
        "name": "HaWoR wrist-guided crop · 27B",
        "note": "Above 397B wrist-guided crop, below raw 27B",
        "model": "27B"
      }
    },
    "l4_strict_judge": {
      "zh": {
        "name": "更严评判重判原始帧",
        "note": "尺子变了",
        "model": "Qwen3.5-397B judge"
      },
      "en": {
        "name": "Stricter judge re-score of raw",
        "note": "Different yardstick",
        "model": "Qwen3.5-397B judge"
      }
    },
    "l2_proxy_27b": {
      "zh": {
        "name": "近似手部拼贴 · 27B",
        "note": "启发式裁剪，低于原始帧 · 27B",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Proxy hand-collage · 27B",
        "note": "Heuristic crop, below raw 27B",
        "model": "Qwen3.6-27B"
      }
    },
    "egovid_e2e": {
      "zh": {
        "name": "腕速一体产出",
        "note": "一体基线较弱",
        "model": null
      },
      "en": {
        "name": "Wrist-speed one-pass",
        "note": "Joint cut+label is weak",
        "model": null
      }
    },
    "s2_self": {
      "zh": {
        "name": "S2 边界 + 分段模型自标",
        "note": "沿用分段描述",
        "model": null
      },
      "en": {
        "name": "S2 bounds + segmenter self-label",
        "note": "Bounds locked",
        "model": null
      }
    },
    "raw397": {
      "zh": {
        "name": "S2 边界 + 原始帧重标 · 397B",
        "note": "端到端整流程得分 0.1414",
        "model": null
      },
      "en": {
        "name": "S2 bounds + raw relabel · 397B",
        "note": "Same 0.2031 predicted boundaries; Gemini E2E 0.1414; fewer calls than selector",
        "model": null
      }
    },
    "raw27b_e2e": {
      "zh": {
        "name": "S2 边界 + 原始帧重标 · 27B",
        "note": "固定边界最高，端到端非最高",
        "model": null
      },
      "en": {
        "name": "S2 bounds + raw relabel · 27B",
        "note": "Best fixed-boundary Label Acc, but not best E2E",
        "model": null
      }
    },
    "raw27b_inner05_e2e": {
      "zh": {
        "name": "S2 边界 + 原始帧重标 · 27B（inner-0.5）",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 + 27B raw relabel (inner-0.5)",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "raw27b_ffmpeg_e2e": {
      "zh": {
        "name": "S2 边界 + ffmpeg 抽帧重标 · 27B",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 + 27B ffmpeg-raw relabel",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "seeded_neighbor27_e2e": {
      "zh": {
        "name": "S2 边界 + seeded-neighbor · 27B",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 + 27B seeded-neighbor",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "raw27_prior_neighbor27_e2e": {
      "zh": {
        "name": "S2 边界 + raw-prior neighbor · 27B",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 + 27B raw-prior neighbor",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "selector27_e2e": {
      "zh": {
        "name": "S2 边界 + 多候选判别 · 27B",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "S2 + 27B multi-candidate selector",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "ffmpeg397": {
      "zh": {
        "name": "S2 边界 + ffmpeg 抽帧重标 · 397B",
        "note": "抽帧路径变体",
        "model": null
      },
      "en": {
        "name": "S2 bounds + ffmpeg relabel · 397B",
        "note": "Decode/sample path variant",
        "model": null
      }
    },
    "nb28": {
      "zh": {
        "name": "S2 边界 + 邻段重标 · 27B 先验",
        "note": "得分下降",
        "model": null
      },
      "en": {
        "name": "S2 bounds + neighbor relabel · 27B prior",
        "note": "Hurts score",
        "model": null
      }
    },
    "nb397": {
      "zh": {
        "name": "S2 边界 + 邻段重标 · 397B 先验",
        "note": "",
        "model": null
      },
      "en": {
        "name": "S2 bounds + neighbor relabel · 397B prior",
        "note": "",
        "model": null
      }
    },
    "selector397": {
      "zh": {
        "name": "S2 边界 + 多候选判别 · 397B",
        "note": "端到端整流程得分 0.1542",
        "model": null
      },
      "en": {
        "name": "S2 bounds + multi-candidate selector · 397B",
        "note": "Same predicted boundaries; Gemini E2E 0.1542; more calls",
        "model": null
      }
    }
  };

  const METHOD_I18N = {
    egovid_baseline: { en: { goal: "Evaluate the wrist-speed production baseline.", how: "Use HaWoR-estimated hand motion, wrist-speed valleys, and adjacent-segment merging.", input: "video plus HaWoR hand-motion reconstruction", result: "Segment F1 0.0953; 810 predictions vs 470 references", verdict: "This baseline produces substantially more segments than the reference annotation." } },
    cs_max3_397b: { en: { goal: "Evaluate chunked contact-sheet requests.", how: "Use the legacy prompt with at most three sheets per request.", input: "chunked contact sheets", result: "Segment F1 0.0952", verdict: "Request seams are often interpreted as action boundaries." } },
    cs_max3_27b: { en: { goal: "Repeat chunked contact sheets with Qwen3.6-27B.", how: "Keep max_sheets=3 and the legacy prompt while changing the segmenter.", input: "chunked contact sheets", result: "Segment F1 0.1278", verdict: "Changing the model does not remove pseudo-boundaries introduced by chunking." } },
    whole_legacy_27b: { en: { goal: "Remove chunk seams.", how: "Submit whole-episode sheets in one request with the legacy prompt.", input: "whole-episode contact sheets", result: "Segment F1 0.1230; 148 predictions", verdict: "Pseudo-boundaries decrease, but the model predicts fewer segments than the reference." } },
    aligned_gepa_27b: { en: { goal: "Use completed-event segmentation rules.", how: "Submit whole-episode sheets with the GEPA-derived segmentation prompt.", input: "whole-episode contact sheets plus GEPA-derived segmentation prompt", result: "Segment F1 0.1369", verdict: "The prompt improves over the legacy prompt, but recall remains low." } },
    s1_full25_397b: { en: { goal: "Increase predicted segment density.", how: "Adjust the duration prior and denser-cut instruction over all 25 HomER videos.", input: "whole-episode sheets plus denser-cut prompt", result: "Segment F1 0.1556; 558 predictions", verdict: "Recall increases together with the number of predicted segments." } },
    s2_full25_397b: { en: { goal: "Add local refinement after coarse segmentation.", how: "Open local contact-sheet windows near coarse bounds; this early setup used about one second of pad-out.", input: "local sheets plus coarse-bound hints", result: "Segment F1 0.1674", verdict: "This is an early local-refinement configuration, not the final full-cover setup." } },
    s2_pad0_plain_27b: { en: { goal: "Compare local-window padding widths.", how: "Run local refine with pad_sec=0 before adding the full-cover instruction.", input: "local contact sheets", result: "Segment F1 0.1711; 582 predictions", verdict: "pad=0 is above the tested pad-out settings, but still predicts many segments." } },
    s2_pad05_27b: { en: { goal: "Test 0.5s pad-out.", how: "Add 0.5 seconds of neighboring context on both sides during local refine.", input: "local contact sheets", result: "Segment F1 0.1444", verdict: "This setting is below pad=0." } },
    s2_pad1_27b: { en: { goal: "Test 1.0s pad-out.", how: "Add 1.0 second of neighboring context on both sides during local refine.", input: "local contact sheets", result: "Segment F1 0.1485", verdict: "This setting is below pad=0." } },
    s2_pad2_27b: { en: { goal: "Test 2.0s pad-out.", how: "Add 2.0 seconds of neighboring context on both sides during local refine.", input: "local contact sheets", result: "Segment F1 0.1436", verdict: "This setting is below pad=0." } },
    s2_midpoint_post: { en: { goal: "Compare scripted coverage with a prompt constraint.", how: "Apply midpoint full-cover postprocessing after pad=0 predictions.", input: "predicted boundaries", result: "Segment F1 0.1635", verdict: "This postprocess is below putting full-cover directly in the prompt." } },
    s2_fullcover_qwen36: { en: { goal: "Refine local windows while covering completed actions.", how: "Use local timestamped contact sheets, pad=0, and a full-cover prompt after coarse segmentation.", input: "local timestamped contact sheets plus coarse-bound hints", result: "Segment F1 0.2031; 308 predictions", verdict: "Highest segmentation score among evaluated segmentation settings." } },
    merge_exact: { en: { goal: "Test whether adjacent predictions with the same label should be merged.", how: "Scan time-sorted S2 predictions and merge neighboring spans only when their normalized subtask labels are identical. This is a JSON postprocess, not another model call.", input: "S2 full-cover predictions: start_sec, end_sec, subtask", result: "Segment F1 0.1987", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    merge_verb: { en: { goal: "Test whether adjacent predictions that describe the same verb/object should be merged.", how: "Extract approximate action verbs and salient objects from neighboring subtask strings, then merge compatible neighbors. This does not inspect video frames or gold annotations.", input: "S2 full-cover predictions: start_sec, end_sec, subtask", result: "Segment F1 0.1947", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    merge_bridge: { en: { goal: "Test whether very short temporal gaps should be bridged before merging.", how: "Treat very short gaps between neighboring S2 predictions as continuous, then apply label or verb/object compatibility before merging.", input: "S2 full-cover predictions: start_sec, end_sec, subtask", result: "Segment F1 0.1883", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    raw_27b: { en: { goal: "Evaluate 27B labeling under fixed reference boundaries.", how: "Sample raw frames from each reference segment, label with Qwen3.6-27B, and score with Gemini-3.5-Flash.", input: "raw frames", result: "Label Acc 55.7%", verdict: "Highest observed value in the fixed-reference-boundary diagnostic setting." } },
    temporal_collage_27b: { en: { goal: "Evaluate past/current/future context with 27B.", how: "Build temporal collages for fixed reference segments and label with Qwen3.6-27B.", input: "temporal collage", result: "Label Acc 52.8%", verdict: "Below raw 27B." } },
    overlay_27b: { en: { goal: "Evaluate heuristic overlay cues with 27B.", how: "Draw optical-flow or heuristic visual marks on raw frames before labeling.", input: "proxy overlay frames", result: "Label Acc 50.6%", verdict: "Below raw 27B." } },
    raw_397b: { en: { goal: "Evaluate 397B raw-frame labeling under fixed reference boundaries.", how: "Sample raw frames from each reference segment, label with Qwen3.5-397B, and score with Gemini-3.5-Flash.", input: "raw frames", result: "Label Acc 50.2%", verdict: "397B raw-frame baseline." } },
    predictions_labeling: { en: { goal: "Audit a duplicate prediction artifact.", how: "Score the copied prediction file with the same Gemini judge.", input: "raw label predictions", result: "Label Acc 50.2%", verdict: "Matches the raw 397B result." } },
    overlay_proxy: { en: { goal: "Evaluate heuristic overlay cues with 397B.", how: "Use optical-flow or center-proxy visual marks; this is not hand reconstruction.", input: "proxy overlay frames", result: "Label Acc 48.5%", verdict: "Below raw 397B." } },
    temporal_collage: { en: { goal: "Evaluate whole-frame past/current/future context with 397B.", how: "Build a temporal collage for each fixed reference segment.", input: "whole-frame temporal collage", result: "Label Acc 45.1%", verdict: "Below raw 397B." } },
    l1_neighbor: { en: { goal: "Evaluate previous/current/next context.", how: "Feed previous, current, and next segment sheets to the labeler.", input: "neighbor contact sheets", result: "Label Acc 39.6%", verdict: "Below raw 397B." } },
    l1_ts_rerun: { en: { goal: "Evaluate neighbor sheets with second-level timestamps.", how: "Re-run previous/current/next sheets after adding second-level timestamps.", input: "timestamped neighbor sheets", result: "Label Acc 40.0%", verdict: "Below raw 397B." } },
    l1_neighbor_27b: { en: { goal: "Test whether Qwen3.6-27B uses previous/current/next context better.", how: "Feed previous, current, and next segment sheets to Qwen3.6-27B and score with Gemini-3.5-Flash.", input: "neighbor contact sheets", result: "Label Acc 40.9%", verdict: "Slightly above 397B neighbor and far below raw 27B." } },
    l2_proxy_27b: { en: { goal: "Evaluate approximate hand-crop collages with Qwen3.6-27B.", how: "Use YOLO or center-heuristic hand-adjacent crops, then tile them for labeling.", input: "proxy hand-collage", result: "Label Acc 38.5%", verdict: "Below raw 27B and below 397B proxy hand-collage." } },
    l2_yolo_proxy: { en: { goal: "Evaluate approximate hand-crop collages.", how: "Use YOLO or center-heuristic crops, then tile them for labeling.", input: "proxy hand-collage", result: "Label Acc 39.1%", verdict: "Below raw 397B." } },
    l2_hawor: { en: { goal: "Evaluate HaWoR-reconstructed wrist-guided crops.", how: "Estimate wrist tracks with HaWoR, crop around hands, and use raw fallback when crops are incomplete.", input: "HaWoR-reconstructed wrist-guided crop plus raw fallback", result: "Label Acc 50.9%", verdict: "Above raw 397B and below raw 27B." } },
    l4_strict_judge: { en: { goal: "Measure sensitivity to judge strictness.", how: "Re-score the same raw predictions with a stricter semantic rubric.", input: "unchanged predicted captions", result: "Accuracy 43.0%", verdict: "Main reports should keep the semantic judge fixed." } },
    egovid_e2e: { en: { goal: "Evaluate the production one-pass output under WGO metrics.", how: "Generate wrist-speed boundaries and per-segment labels.", input: "production-style baseline output", result: "Semantic E2E F1 0.0641", verdict: "Below the WGO-Bench evaluation pipeline settings." } },
    s2_self: { en: { goal: "Evaluate segmenter self-labeling.", how: "Use S2 predicted boundaries and keep Qwen3.6-27B labels.", input: "S2 predicted segments", result: "Semantic E2E F1 0.1234", verdict: "Below relabel and selector settings." } },
    raw27b_e2e: { en: { goal: "Test whether fixed-boundary 27B labeling transfers to predicted-boundary E2E.", how: "Use S2 predicted boundaries and relabel each segment from raw frames with Qwen3.6-27B.", input: "raw frames within S2 predicted segments", result: "Semantic E2E F1 0.1285", verdict: "Above self-labeling and below 397B raw and selector." } },
    raw397: { en: { goal: "Evaluate 397B raw-frame relabel under predicted boundaries.", how: "Use S2 predicted boundaries and relabel from raw frames with Qwen3.5-397B.", input: "raw frames within S2 predicted segments", result: "Semantic E2E F1 0.1414", verdict: "Low-cost predicted-boundary E2E path." } },
    ffmpeg397: { en: { goal: "Evaluate an alternate decode/sampling path as a candidate source.", how: "Use S2 predicted boundaries, ffmpeg-sampled frames, and Qwen3.5-397B labels.", input: "ffmpeg-sampled raw frames", result: "Semantic E2E F1 0.1491", verdict: "Candidate source used for selector comparison." } },
    nb28: { en: { goal: "Evaluate neighbor relabel with a 27B prior.", how: "Use previous/current/next visual context plus a Qwen3.6-27B prior under S2 boundaries.", input: "neighbor frames plus 27B prior", result: "Semantic E2E F1 0.1234", verdict: "Below 397B raw." } },
    nb397: { en: { goal: "Evaluate neighbor relabel with a 397B raw prior.", how: "Use previous/current/next visual context plus a 397B raw prior under S2 boundaries.", input: "neighbor frames plus 397B prior", result: "Semantic E2E F1 0.1491", verdict: "Candidate source used for selector comparison." } },
    selector397: { en: { goal: "Evaluate multi-candidate selection.", how: "Generate raw, ffmpeg, seed, and rawprior candidates under the same S2 predicted boundaries, then let Qwen3.5-397B select the final label. The selector does not read gold labels.", input: "candidate labels for S2 predicted segments", result: "Semantic E2E F1 0.1542", verdict: "Highest observed E2E value among evaluated configurations." } }
  };

  function lang() {
    return (window.__LANG__ === "en") ? "en" : "zh";
  }
  function locRow(r) {
    const pack = (ABLATION_I18N[r.id] || {})[lang()] || {};
    return {
      ...r,
      name: pack.name != null ? pack.name : r.name,
      note: pack.note != null ? pack.note : r.note,
      model: pack.model != null ? pack.model : r.model,
    };
  }
  function locMethod(row) {
    const pack = (METHOD_I18N[row.id] || {})[lang()];
    return pack || row.method || {};
  }

  function fmtF1(n) {
    if (n === null || n === undefined) return "—";
    return Number(n).toFixed(4);
  }
  function pct(n) {
    if (n === null || n === undefined) return "—";
    return (Number(n) * 100).toFixed(1) + "%";
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    })[c]);
  }
  function fmtInt(n) {
    return Math.round(Number(n)).toLocaleString("en-US");
  }

  function renderBars(el, rows, valueKey, maxVal, alt, bestId) {
    if (!el) return;
    el.innerHTML = rows.map((row) => {
      const r = locRow(row);
      const v = r[valueKey];
      const w = Math.max(2, Math.round((v / maxVal) * 100));
      const isBest = bestId && row.id === bestId;
      const label = isBest ? `<strong>${esc(r.name)}</strong>` : esc(r.name);
      return `<div class="bar-row${isBest ? " best" : ""}">
        <div class="bar-label">${label}</div>
        <div class="bar-track"><div class="bar-fill${alt ? " alt" : ""}" style="width:${w}%"></div></div>
        <div class="bar-val">${valueKey === "acc" ? pct(v) : fmtF1(v)}</div>
      </div>`;
    }).join("");
  }

  function orderedSegRows(data) {
    const byId = new Map((data.segmentation || []).map((r) => [r.id, r]));
    return MAIN_SEG_ORDER.map((id) => byId.get(id)).filter(Boolean);
  }

  function renderTimeline(el, toy) {
    if (!el || !toy) return;
    const tmax = Math.max(...toy.gold.map((s) => s.end), ...toy.after_snap.map((s) => s.end));
    const lane = (title, segs, cls) => {
      const bits = segs.map((s) => {
        const left = (s.start / tmax) * 100;
        const width = ((s.end - s.start) / tmax) * 100;
        return `<div class="seg ${cls}" style="left:${left}%;width:${width}%">${esc(s.id)}</div>`;
      }).join("");
      return `<div class="lane"><div class="lane-title">${esc(title)}</div><div class="lane-track">${bits}</div></div>`;
    };
    el.innerHTML = lane(i18n("toy.lane.gold"), toy.gold, "gold") +
      lane(i18n("toy.lane.pred"), toy.after_snap, "pred") +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0.6rem 0 0">${i18n("toy.lane.sum", { n: toy.n_match, f1: Number(toy.F1).toFixed(3) })}</p>`;
  }

  function isFailMethod(row, kind) {
    if (kind === "seg") {
      return ["cs_max3_397b","merge_exact","merge_verb","merge_bridge","s2_midpoint_post"].includes(row.id)
        || (row.f1 != null && row.f1 < 0.15 && row.id !== "aligned_gepa_27b");
    }
    if (kind === "label") return row.delta_vs_raw != null ? row.delta_vs_raw < 0 : (row.acc != null && row.acc < 0.5);
    if (kind === "e2e") return row.id === "nb28" || row.id === "egovid_e2e";
    return false;
  }
  function isWinMethod(row, kind) {
    if (kind === "seg") return row.id === "s2_fullcover_qwen36";
    if (kind === "label") return row.id === "l2_hawor" || row.id === "raw_397b";
    if (kind === "e2e") return row.id === "selector397" || row.id === "raw397";
    return false;
  }

  function renderMethods(el, rows, kind) {
    if (!el) return;
    el.innerHTML = rows.map((row) => {
      const r = locRow(row);
      const m = locMethod(row);
      const score = kind === "label" ? pct(r.acc) : kind === "e2e" ? fmtF1(r.e2e_f1) : fmtF1(r.f1);
      const cls = isWinMethod(row, kind) ? "win" : (isFailMethod(row, kind) ? "fail" : "");
      const fig = row.figure || "";
      const img = fig ? `<img src="${esc(fig)}" alt="${esc(r.name)}" loading="lazy" />` : "";
      const L = lang();
      const labGoal = L === "en" ? "Goal" : "目的";
      const labHow = L === "en" ? "How" : "做法";
      const labScore = L === "en" ? "Score" : "得分";
      const labVerdict = L === "en" ? "Takeaway" : "结论";
      const labIn = L === "en" ? "Input" : "输入";
      return `<article class="method-card ${cls}">
        <div class="mc-head">
          <div class="mc-name">${esc(r.name)}</div>
          <div class="mc-score">${score} · ${esc(r.model || "")}</div>
        </div>
        <div class="mc-grid">
          <div><div class="lab">${labGoal}</div>${esc(m.goal || "—")}</div>
          <div><div class="lab">${labHow}</div>${esc(m.how || "—")}${m.input ? `<div style="margin-top:0.25rem;color:var(--muted);font-size:0.85rem">${labIn}: ${esc(m.input)}</div>` : ""}</div>
          <div><div class="lab">${labScore}</div>${esc(m.result || score)}</div>
          <div><div class="lab">${labVerdict}</div>${esc(m.verdict || r.note || "—")}</div>
        </div>
        ${img}
      </article>`;
    }).join("");
  }

  function segPrecisionRecall(row) {
    let p = row.p;
    let r = row.r;
    if ((p == null || r == null) && row.match != null && row.pred != null && row.gold != null) {
      p = row.pred ? row.match / row.pred : null;
      r = row.gold ? row.match / row.gold : null;
    }
    return { p, r };
  }

  function segRowHTML(row, best) {
    const loc = locRow(row);
    const isBest = loc.f1 === best || row.id === "s2_fullcover_qwen36";
    const bestCls = isBest ? "best" : "";
    const name = isBest ? `<strong>${esc(loc.name)}</strong>` : esc(loc.name);
    const { p, r } = segPrecisionRecall({ ...row, ...loc });
    const pr = (p != null && r != null) ? `${Number(p).toFixed(3)} / ${Number(r).toFixed(3)}` : "—";
    const mpg = (loc.match != null) ? `${loc.match}/${loc.pred}/${loc.gold}` : `—/—/${loc.gold}`;
    return `<tr class="${bestCls}"><td>${name}</td><td class="num">${fmtF1(loc.f1)}</td><td class="num">${pr}</td><td class="num">${mpg}</td><td>${esc(loc.model)}</td></tr>`;
  }

  function fillSegTable(data) {
    const tbody = document.querySelector("#seg-tbody");
    if (!tbody) return;
    const best = data.meta.best.seg_f1;
    tbody.innerHTML = orderedSegRows(data).map((r) => segRowHTML(r, best)).join("");
  }

  function fillSegPadTable(data) {
    const tbody = document.querySelector("#seg-pad-tbody");
    if (!tbody) return;
    const best = data.meta.best.seg_f1;
    const rows = data.segmentation.filter((r) => PAD_SEG_IDS.has(r.id));
    tbody.innerHTML = rows.length
      ? rows.map((r) => segRowHTML(r, best)).join("")
      : `<tr><td colspan="5">${lang()==="en" ? "No extra pad-out ablation rows." : "无额外窗口外扩消融行。"}</td></tr>`;
  }

  function orderedLabelRows(data) {
    const rows = (data.labeling || []).filter((row) => row.id !== "predictions_labeling" && row.id !== "l4_strict_judge");
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered = MAIN_LABEL_ORDER.map((id) => byId.get(id)).filter(Boolean);
    const seen = new Set(ordered.map((r) => r.id));
    const rest = rows.filter((r) => !seen.has(r.id));
    return ordered.concat(rest);
  }

  function fillLabelTable(data) {
    const tbody = document.querySelector("#label-tbody");
    if (!tbody) return;
    const best = data.meta.best.label_acc;
    const rows = orderedLabelRows(data);
    tbody.innerHTML = rows.map((row) => {
      const r = locRow(row);
      const bestCls = r.acc === best ? "best" : "";
      // Condition names already include · 27B / · 397B; no separate model column.
      return `<tr class="${bestCls}"><td>${esc(r.name)}</td><td class="num">${pct(r.acc)}</td><td class="num">${r.n_match}/${r.n}</td></tr>`;
    }).join("");
  }

  function fillE2ETable(data) {
    const tbody = document.querySelector("#e2e-tbody");
    if (!tbody) return;
    const best = data.meta.best.e2e_f1;
    tbody.innerHTML = data.e2e.map((row) => {
      const r = locRow(row);
      const bestCls = r.e2e_f1 === best ? "best" : "";
      return `<tr class="${bestCls}"><td>${esc(r.name)}</td><td class="num">${fmtF1(r.seg_f1)}</td><td class="num">${fmtF1(r.e2e_f1)}</td><td class="num">${esc(r.pred_gold)}</td><td>${esc(r.note || "")}</td></tr>`;
    }).join("");
  }

  function tokRange(t) {
    return `${fmtInt(t.total_low)} – ${fmtInt(t.total_high)}`;
  }
  function perMin(t) {
    return `${fmtInt(t.per_video_minute_low)} – ${fmtInt(t.per_video_minute_high)}`;
  }
  function usdRange(u, perHour) {
    if (!u) return "—";
    const low = perHour ? u.per_video_hour_low : u.total_low;
    const high = perHour ? u.per_video_hour_high : u.total_high;
    if (low == null || high == null) return "—";
    return `$${Number(low).toFixed(2)} – $${Number(high).toFixed(2)}`;
  }

  function costCalls(recipe) {
    return recipe.api_calls || recipe.api_calls_estimate || {};
  }
  function costTokens(recipe) {
    return recipe.tokens || recipe.tokens_estimate || {};
  }

  function i18n(key, vars) {
    const lang = window.__LANG__ || "zh";
    let s = (window.EgoANT_I18N && window.EgoANT_I18N.t)
      ? window.EgoANT_I18N.t(key, lang)
      : key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      });
    }
    return s;
  }

  function renderCost(cost) {
    if (!cost) return;
    window.__COST_DATA__ = cost;
    const v = cost.video || {};
    const recipes = cost.recipes || {};
    const raw = recipes.raw_only;
    const sel = recipes.selector;
    const sum = document.querySelector("#cost-summary");
    const prod = cost.production_measured;
    if (sum) {
      let extra = "";
      if (prod && prod.kind === "measured") {
        extra = " " + i18n("cost.dyn.extra", {
          api: fmtInt(prod.api_calls_total),
          tok: fmtInt(prod.total_tokens),
          perMin: fmtInt(prod.per_video_minute_tokens),
        });
      }
      sum.textContent = i18n("cost.dyn.summary", {
        n: v.n_episodes,
        min: v.total_min,
        mean: v.mean_sec,
        extra: extra,
      });
    }
    const body = document.querySelector("#cost-tbody");
    if (!body || !raw || !sel) return;
    const rc = costCalls(raw);
    const sc = costCalls(sel);
    const rt = costTokens(raw);
    const st = costTokens(sel);
    const rows = [
      [i18n("cost.row.dur"), `${v.total_min} min`, `${v.total_min} min`],
      [i18n("cost.row.pred"), String((cost.recipe_counts||{}).n_pred_segments), String((cost.recipe_counts||{}).n_pred_segments)],
      [i18n("cost.row.s2"), String((cost.recipe_counts||{}).n_s2_windows_total), String((cost.recipe_counts||{}).n_s2_windows_total)],
      [i18n("cost.row.label_api"), fmtInt(rc.labeling || 0), fmtInt((sc.labeling || 0) + (sc.candidate_selector || 0))],
      [i18n("cost.row.api_tot"), fmtInt(rc.total || 0), fmtInt(sc.total || 0)],
      [i18n("cost.row.tok"), tokRange(rt), tokRange(st)],
      [i18n("cost.row.tok_min"), perMin(rt), perMin(st)],
      [i18n("cost.row.usd"), usdRange(raw.usd_estimate, false), usdRange(sel.usd_estimate, false)],
      [i18n("cost.row.usd_hour"), usdRange(raw.usd_estimate, true), usdRange(sel.usd_estimate, true)],
      [i18n("cost.row.e2e"), fmtF1(raw.e2e_f1), fmtF1(sel.e2e_f1)],
    ];
    body.innerHTML = rows.map((r) => `<tr><td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td class="num">${esc(r[2])}</td></tr>`).join("");

    const prodBox = document.querySelector("#cost-production");
    if (prodBox && prod && prod.kind === "measured") {
      const stg = prod.stages || {};
      const stageRows = Object.keys(stg).map((k) => {
        const s = stg[k];
        return `<tr><td>${esc(k)}</td><td class="num">${fmtInt(s.requests)}</td><td class="num">${fmtInt(s.total_tokens)}</td></tr>`;
      }).join("");
      const thItem = i18n("cost.th.item");
      const thVal = i18n("cost.dyn.measured");
      prodBox.innerHTML = `
        <h3>${esc(i18n("cost.dyn.prod_h3"))}</h3>
        <p class="plain">${esc(i18n("cost.dyn.prod_p"))}</p>
        <table>
          <thead><tr><th>${esc(thItem)}</th><th>${esc(thVal)}</th></tr></thead>
          <tbody>
            <tr><td>${esc(i18n("cost.dyn.api"))}</td><td class="num">${fmtInt(prod.api_calls_total)}</td></tr>
            <tr><td>${esc(i18n("cost.dyn.prompt"))}</td><td class="num">${fmtInt(prod.prompt_tokens)}</td></tr>
            <tr><td>${esc(i18n("cost.dyn.completion"))}</td><td class="num">${fmtInt(prod.completion_tokens)}</td></tr>
            <tr><td>${esc(i18n("cost.dyn.total"))}</td><td class="num">${fmtInt(prod.total_tokens)}</td></tr>
            <tr><td>${esc(i18n("cost.dyn.per_min"))}</td><td class="num">${fmtInt(prod.per_video_minute_tokens)}</td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>${esc(i18n("cost.dyn.stage"))}</th><th>${esc(i18n("cost.dyn.reqs"))}</th><th>${esc(i18n("cost.dyn.total"))}</th></tr></thead>
          <tbody>${stageRows}</tbody>
        </table>`;
    }
  }
  window.__rerenderCostI18n = function () {
    if (window.__COST_DATA__) renderCost(window.__COST_DATA__);
  };

  function renderHeroGrid(data) {
    const box = document.querySelector("#hero-grid");
    if (!box) return;
    window.__HERO_GRID__ = data;
    const cells = (data && data.cells) || [];
    const lang = window.__LANG__ || "zh";
    box.innerHTML = cells.map((c) => {
      const cap = lang === "en" ? (c.caption_en || c.caption_zh || "") : (c.caption_zh || c.caption_en || "");
      return `<div class="hero-cell" data-ep="${esc(c.episode || "")}">
        <video muted loop playsinline autoplay preload="metadata" src="${esc(c.src)}"></video>
        <div class="cap">${esc(cap)}</div>
      </div>`;
    }).join("");
    box.querySelectorAll("video").forEach((v) => {
      v.addEventListener("mouseenter", () => { try { v.pause(); } catch (e) {} });
      v.addEventListener("mouseleave", () => { try { v.play(); } catch (e) {} });
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });
  }
  window.__rerenderHeroI18n = function () {
    if (window.__HERO_GRID__) renderHeroGrid(window.__HERO_GRID__);
  };

  function initTocSpy() {
    const links = Array.from(document.querySelectorAll(".side-toc a[data-toc]"));
    if (!links.length) return;
    const ids = links.map((a) => a.getAttribute("data-toc")).filter(Boolean);
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    function setActive(id) {
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("data-toc") === id));
    }
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.7] });
    sections.forEach((s) => obs.observe(s));
    if (sections[0]) setActive(sections[0].id);
  }

  function renderWalk(walk) {
    if (!walk) return;
    const t = (k) => (window.EgoANT_I18N && window.EgoANT_I18N.t) ? window.EgoANT_I18N.t(k, lang()) : k;
    const instr = document.querySelector("#walk-instruction");
    if (instr) {
      instr.innerHTML = `<strong>${t("walk.task")}</strong> ${esc(walk.instruction)} · ≈${Number(walk.duration_sec).toFixed(1)}s · pred ${walk.scores_episode.n_pred} / gold ${walk.scores_episode.n_gold}`;
    }
    const pills = document.querySelector("#walk-params");
    if (pills) {
      const p = (walk.pipeline_meta && walk.pipeline_meta.contact_params) || "sample_sec=0.5, tile=224x144, 20 tiles/sheet, yellow timestamps";
      pills.innerHTML = p.split(",").map((x) => `<span>${esc(x.trim())}</span>`).join("");
    }
    const demo = walk.candidate_demo_segment || {};
    const cands = demo.candidate_labels || {};
    const tb = document.querySelector("#walk-cands");
    if (tb) {
      const srcMap = { A: "raw", B: "rawprior", C: "seed", D: "ffmpeg" };
      const pickedKey = srcMap[demo.candidate_select_source] || null;
      const order = ["raw", "rawprior", "seed", "ffmpeg"];
      tb.innerHTML = order.filter((k) => cands[k] != null).map((k) => {
        const isFinal = (pickedKey && k === pickedKey) || cands[k] === demo.subtask;
        return `<tr${isFinal ? ' style="background:#eaf5ee"' : ""}><td>${esc(k)}</td><td>${esc(cands[k])}</td></tr>`;
      }).join("");
    }
    const fin = document.querySelector("#walk-cand-final");
    if (fin) {
      fin.innerHTML = `<strong>Selector:</strong> source=<code>${esc(demo.candidate_select_source)}</code> → “${esc(demo.subtask)}”
        <span style="color:var(--muted)">(${Number(demo.start_sec).toFixed(1)}–${Number(demo.end_sec).toFixed(1)}s)</span>`;
    }

    const overview = document.querySelector("#walk-video");
    const clip = document.querySelector("#walk-clip");
    const clipMeta = document.querySelector("#walk-clip-meta");
    // Prefer seek-optimized asset when present (dense keyframes + faststart).
    const walkSrc = (walk.assets && walk.assets.video_seek) || walk.video;
    function ensureSrc(el, src) {
      if (!el || !src) return;
      try {
        const abs = new URL(src, window.location.href).href;
        // Ignore media-fragment differences; never reload if same file.
        const cur = (el.currentSrc || el.src || "").split("#")[0];
        if (cur === abs.split("#")[0]) return;
      } catch (e) {}
      el.src = src;
      try { el.load(); } catch (e2) {}
    }
    ensureSrc(overview, walkSrc);
    ensureSrc(clip, walkSrc);
    if (clip) clip.preload = "auto";
    if (overview) overview.preload = "metadata";

    const tmax = walk.duration_sec;
    const tl = document.querySelector("#walk-timeline");
    const detail = document.querySelector("#walk-seg-detail");
    let clipBound = null;
    let clipLoopHandler = null;
    let seekGen = 0;

    function stopClipLoop() {
      if (clip && clipLoopHandler) {
        clip.removeEventListener("timeupdate", clipLoopHandler);
        clipLoopHandler = null;
      }
      clipBound = null;
    }

    function seekTo(video, tSec) {
      return new Promise((resolve) => {
        if (!video) return resolve(false);
        const target = Math.max(0, Number(tSec) || 0);
        let settled = false;
        const finish = (ok) => {
          if (settled) return;
          settled = true;
          video.removeEventListener("seeked", onSeeked);
          clearTimeout(timer);
          resolve(!!ok);
        };
        const onSeeked = () => {
          const ct = video.currentTime || 0;
          finish(Math.abs(ct - target) < 0.75 || (target > 1 && ct >= target - 1.0));
        };
        video.addEventListener("seeked", onSeeked);
        const timer = setTimeout(() => {
          const ct = video.currentTime || 0;
          finish(Math.abs(ct - target) < 0.75 || (target > 1 && ct >= target - 1.0));
        }, 2500);
        const kick = () => {
          try {
            // Do not pause here — play() may already be in flight from the click gesture.
            if (target > 0.5 && (video.currentTime || 0) < 0.25) {
              video.currentTime = Math.min(target, 0.5);
            }
            video.currentTime = target;
          } catch (e) {
            finish(false);
          }
        };
        if (video.readyState >= 1) kick();
        else {
          video.addEventListener("loadedmetadata", kick, { once: true });
          try { video.load(); } catch (e) {}
        }
      });
    }

    async function playSegment(kind, idx, seg, { autoplay = true } = {}) {
      if (!seg) return;
      const start = Math.max(0, Number(seg.start_sec) || 0);
      const end = Math.max(start + 0.05, Number(seg.end_sec) || start + 1);
      const label = kind === "gold" ? "Gold" : "Pred";
      const myGen = ++seekGen;

      if (detail) {
        const extra = kind === "pred" && seg.candidate_labels
          ? `<div class="muted" style="margin-top:0.45rem"><strong>${t("walk.s6.cands")}</strong><br/>${Object.entries(seg.candidate_labels).map(([k,v]) => `<code>${esc(k)}</code> ${esc(v)}`).join("<br/>")}</div>`
          : "";
        const srcLine = kind === "pred" && seg.candidate_select_source
          ? `<div class="muted" style="margin-top:0.35rem">Selector: <code>${esc(seg.candidate_select_source)}</code></div>`
          : "";
        detail.innerHTML = `<div class="muted">${t("walk.s6.selected")}</div>
          <strong>${label} #${idx}</strong>
          <span class="muted">${start.toFixed(2)}–${end.toFixed(2)}s</span>
          <div style="margin-top:0.35rem;font-size:1.02rem">${esc(seg.subtask)}</div>${srcLine}${extra}`;
      }
      if (clipMeta) {
        clipMeta.textContent = `${label} #${idx} · ${start.toFixed(1)}–${end.toFixed(1)}s · ${autoplay ? t("walk.s6.looping") : t("walk.s6.clickplay")}`;
      }
      if (tl) {
        tl.querySelectorAll(".seg").forEach((x) => {
          x.classList.toggle("active", x.getAttribute("data-kind") === kind && Number(x.getAttribute("data-idx")) === idx);
        });
      }
      document.querySelectorAll("#walk-seg-tbody tr").forEach((tr) => {
        tr.classList.toggle("active", tr.getAttribute("data-kind") === kind && Number(tr.getAttribute("data-idx")) === idx);
      });

      stopClipLoop();
      clipBound = { start, end };
      // Keep a stable src (do NOT rewrite with #t= fragments — that reloads and resets to 0).
      ensureSrc(clip, walkSrc);
      ensureSrc(overview, walkSrc);

      // Important: call play() BEFORE any await so the click user-gesture is preserved.
      if (clip) {
        try { clip.pause(); } catch (e) {}
        try { clip.currentTime = start; } catch (e) {}
        if (overview) {
          try { overview.currentTime = start; } catch (e) {}
        }
        clipLoopHandler = () => {
          if (!clipBound || myGen !== seekGen) return;
          const ct = clip.currentTime || 0;
          if (ct < clipBound.start - 0.2) {
            try { clip.currentTime = clipBound.start; } catch (e) {}
            return;
          }
          if (ct >= clipBound.end - 0.04) {
            try { clip.currentTime = clipBound.start; } catch (e) {}
          }
        };
        clip.addEventListener("timeupdate", clipLoopHandler);
        if (autoplay) {
          const p = clip.play();
          if (p && typeof p.catch === "function") {
            p.catch(() => {
              try { clip.pause(); } catch (e) {}
              if (clipMeta && myGen === seekGen) {
                clipMeta.textContent = `${label} #${idx} · ${start.toFixed(1)}–${end.toFixed(1)}s · ${t("walk.s6.clickplay")}`;
              }
            });
          }
        }
      }

      // Refine seek after metadata/range is ready (may await; play already started).
      await seekTo(overview, start);
      if (myGen !== seekGen) return;
      let ok = await seekTo(clip, start);
      if (myGen !== seekGen) return;
      if (!ok) {
        await new Promise((r) => setTimeout(r, 200));
        if (myGen !== seekGen) return;
        await seekTo(clip, start);
      }
      if (myGen !== seekGen) return;
      if (clip && autoplay && clip.paused) {
        const p = clip.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    }

    function makeLane(title, segs, cls) {
      const bits = segs.map((s, i) => {
        const left = (s.start_sec / tmax) * 100;
        const width = Math.max(0.4, ((s.end_sec - s.start_sec) / tmax) * 100);
        return `<div class="seg ${cls}" data-kind="${cls}" data-idx="${i}" style="left:${left}%;width:${width}%" title="${esc(s.subtask)}">${i}</div>`;
      }).join("");
      return `<div class="lane"><div class="lane-title">${esc(title)} (${segs.length})</div><div class="lane-track tall">${bits}</div></div>`;
    }
    if (tl) {
      tl.innerHTML = makeLane("Pred", walk.pred_segments, "pred");
      tl.querySelectorAll(".seg").forEach((node) => {
        node.addEventListener("click", () => {
          const kind = node.getAttribute("data-kind");
          const idx = Number(node.getAttribute("data-idx"));
          const seg = walk.pred_segments[idx];
          playSegment(kind, idx, seg);
        });
      });
    }
    const body = document.querySelector("#walk-seg-tbody");
    if (body) {
      const rows = [];
      walk.pred_segments.forEach((s, i) => rows.push(`<tr data-kind="pred" data-idx="${i}"><td>${i}</td><td class="num">${Number(s.start_sec).toFixed(2)}–${Number(s.end_sec).toFixed(2)}</td><td>${esc(s.subtask)}</td><td>${esc(s.candidate_select_source || "—")}</td></tr>`));
      body.innerHTML = rows.join("");
      body.querySelectorAll("tr").forEach((tr) => {
        tr.addEventListener("click", () => {
          const kind = tr.getAttribute("data-kind");
          const idx = Number(tr.getAttribute("data-idx"));
          const seg = walk.pred_segments[idx];
          playSegment(kind, idx, seg);
        });
      });
    }

    // Default: demo pred segment, else first pred
    const prefer = (walk.candidate_demo_segment && walk.candidate_demo_segment.index != null
      && walk.pred_segments[walk.candidate_demo_segment.index])
      ? { kind: "pred", idx: walk.candidate_demo_segment.index, seg: walk.pred_segments[walk.candidate_demo_segment.index] }
      : (walk.pred_segments[0] ? { kind: "pred", idx: 0, seg: walk.pred_segments[0] } : null);
    if (prefer && prefer.seg) {
      playSegment(prefer.kind, prefer.idx, prefer.seg, { autoplay: false });
    }
  }

  function renderBoundaryCompare(bc) {
    if (!bc) return;
    const video = document.querySelector("#bc-video");
    const lanesEl = document.querySelector("#bc-lanes");
    const axisEl = document.querySelector("#bc-axis");
    const playhead = document.querySelector("#bc-playhead");
    const nowEl = document.querySelector("#bc-now");
    const instrEl = document.querySelector("#bc-instr");
    const epEl = document.querySelector("#bc-ep");
    const captionEl = document.querySelector("#bc-caption");
    const tipEl = document.querySelector("#bc-tip");
    const board = document.querySelector("#bc-board");
    if (!video || !lanesEl || !board) return;

    const tmax = Number(bc.duration_sec) || 42;
    const L = lang();
    if (epEl) epEl.textContent = String(bc.id || "HOMER_4").toUpperCase();
    if (instrEl) {
      const prefix = L === "en" ? "Instruction:" : "任务指令：";
      instrEl.textContent = `${prefix} ${bc.instruction || ""}`;
    }
    if (captionEl) {
      captionEl.textContent = L === "en" ? (bc.caption_en || bc.caption_zh || "") : (bc.caption_zh || bc.caption_en || "");
    }
    if (bc.video) {
      const abs = new URL(bc.video, window.location.href).href;
      if ((video.currentSrc || "").split("#")[0] !== abs.split("#")[0]) {
        video.src = bc.video;
        video.preload = "auto";
      }
    }

    function setPlayhead(t) {
      const tt = Math.max(0, Math.min(tmax, t || 0));
      const track = board.querySelector(".bc-lane-track");
      if (!track || !playhead) return;
      const boardRect = board.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const x = (trackRect.left - boardRect.left) + (tt / tmax) * trackRect.width;
      playhead.style.left = `${Math.max(0, x)}px`;
      if (nowEl) nowEl.textContent = `now ${tt.toFixed(1)}s / ${tmax.toFixed(0)}s`;
    }

    function showTip(node, trackLabel) {
      if (!tipEl || !node) return;
      const full = node.getAttribute("data-full") || "";
      const start = Number(node.getAttribute("data-start")) || 0;
      const end = Number(node.getAttribute("data-end")) || 0;
      const idx = node.getAttribute("data-idx") || "";
      tipEl.hidden = false;
      tipEl.innerHTML = `<div class="bc-tip-meta"><strong>${esc(trackLabel)}</strong> · #${esc(idx)} · ${start.toFixed(2)}–${end.toFixed(2)}s</div>
        <div class="bc-tip-full">${esc(full)}</div>`;
    }
    function hideTip() {
      if (tipEl) tipEl.hidden = true;
    }

    function renderLanes() {
      const tracks = bc.tracks || [];
      lanesEl.innerHTML = tracks.map((tr) => {
        const label = L === "en" ? (tr.label_en || tr.label_zh || tr.id) : (tr.label_zh || tr.label_en || tr.id);
        const segs = (tr.segments || []).map((s, i) => {
          const left = (s.start_sec / tmax) * 100;
          const width = Math.max(0.35, ((s.end_sec - s.start_sec) / tmax) * 100);
          const txt = esc(s.subtask || "");
          return `<div class="bc-seg color-${esc(tr.color || "frame")}" data-track-label="${esc(label)}" data-idx="${i}" data-start="${s.start_sec}" data-end="${s.end_sec}" data-full="${txt}" style="left:${left}%;width:${width}%">
            <span class="bc-idx">${i}</span><span class="bc-txt">${txt}</span>
          </div>`;
        }).join("");
        return `<div class="bc-lane" data-track="${esc(tr.id)}">
          <div class="bc-lane-label">${esc(label)}</div>
          <div class="bc-lane-track">${segs}</div>
        </div>`;
      }).join("");

      if (axisEl) {
        const ticks = [0, 10, 20, 30, 40].filter((x) => x <= tmax);
        if (ticks[ticks.length - 1] !== Math.floor(tmax)) ticks.push(Math.floor(tmax));
        axisEl.innerHTML = ticks.map((x) => `<span>${x}s</span>`).join("");
      }

      lanesEl.querySelectorAll(".bc-seg").forEach((node) => {
        const trackLabel = node.getAttribute("data-track-label") || "";
        node.addEventListener("mouseenter", () => showTip(node, trackLabel));
        node.addEventListener("mouseleave", hideTip);
        node.addEventListener("focus", () => showTip(node, trackLabel));
        node.addEventListener("blur", hideTip);
        node.setAttribute("tabindex", "0");
        node.addEventListener("click", () => {
          const start = Number(node.getAttribute("data-start")) || 0;
          lanesEl.querySelectorAll(".bc-seg").forEach((x) => x.classList.remove("active"));
          node.classList.add("active");
          showTip(node, trackLabel);
          try { video.currentTime = start; } catch (e) {}
          setPlayhead(start);
          const p = video.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        });
      });

      lanesEl.querySelectorAll(".bc-lane-track").forEach((track) => {
        track.addEventListener("click", (ev) => {
          if (ev.target.closest(".bc-seg")) return;
          const rect = track.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
          const t = ratio * tmax;
          try { video.currentTime = t; } catch (e) {}
          setPlayhead(t);
        });
      });
      setPlayhead(video.currentTime || 0);
    }

    renderLanes();
    if (!video._bcBound) {
      video._bcBound = true;
      video.addEventListener("timeupdate", () => setPlayhead(video.currentTime || 0));
      video.addEventListener("seeked", () => setPlayhead(video.currentTime || 0));
      window.addEventListener("resize", () => setPlayhead(video.currentTime || 0));
    }
    window.__BOUNDARY_DATA__ = bc;
    window.__rerenderBoundaryI18n = () => renderBoundaryCompare(window.__BOUNDARY_DATA__);
  }

  async function loadJSON(url, fallback) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(String(r.status));
      return await r.json();
    } catch (e) {
      return fallback;
    }
  }

  async function main() {
    const data = await loadJSON("data/results.json", window.__RESULTS__);
    const walk = await loadJSON("data/homer4_walkthrough.json", window.__WALK__);
    const boundary = await loadJSON("data/boundary_compare_homer4.json", window.__BOUNDARY__);
    const cost = await loadJSON("data/cost.json", null) || await loadJSON("data/cost_estimate.json", window.__COST__);
    const heroGrid = await loadJSON("data/hero_grid.json", null);
    if (!data) {
      const err = document.querySelector("#load-error");
      if (err) err.hidden = false;
      return;
    }
    const mainSeg = orderedSegRows(data);
    renderBars(document.querySelector("#seg-bars"), mainSeg, "f1", 0.25, false, "s2_fullcover_qwen36");
    renderBars(document.querySelector("#label-bars"), orderedLabelRows(data), "acc", 0.60, true, data.meta.best.label_acc);
    renderBars(document.querySelector("#e2e-bars"), data.e2e, "e2e_f1", 0.18, true);
    fillSegTable(data);
    fillSegPadTable(data);
    fillLabelTable(data);
    fillE2ETable(data);
    renderTimeline(document.querySelector("#toy-timeline"), data.walkthrough_toy);
    window.__REPORT_DATA__ = { data, walk, boundary, cost, heroGrid };
    function rerenderDynamicI18n() {
      const D = window.__REPORT_DATA__;
      if (!D || !D.data) return;
      const mainSeg = orderedSegRows(D.data);
      renderBars(document.querySelector("#seg-bars"), mainSeg, "f1", 0.25, false, "s2_fullcover_qwen36");
      renderBars(document.querySelector("#label-bars"), orderedLabelRows(D.data), "acc", 0.60, true, D.data.meta.best.label_acc);
      renderBars(document.querySelector("#e2e-bars"), D.data.e2e, "e2e_f1", 0.18, true);
      fillSegTable(D.data);
      fillSegPadTable(D.data);
      fillLabelTable(D.data);
      fillE2ETable(D.data);
      if (D.walk) renderWalk(D.walk);
      if (D.boundary) renderBoundaryCompare(D.boundary);
      renderTimeline(document.querySelector("#toy-timeline"), D.data.walkthrough_toy);
    }
    window.__rerenderTablesI18n = rerenderDynamicI18n;
    renderWalk(walk);
    if (boundary) renderBoundaryCompare(boundary);
    renderCost(cost);
    if (heroGrid) renderHeroGrid(heroGrid);
    initTocSpy();
  }

  window.__RESULTS__ = {
  "meta": {
    "title": "EgoANT on WGO-Bench HomER",
    "eval_subset": "HomER 25 episodes / 470 gold segments",
    "metric_seg": "Segment F1@0.75 micro + outer snap",
    "metric_label": "Gemini-3.5-Flash judge accuracy on gold boundaries",
    "metric_e2e": "Semantic E2E F1 (IoU match then Gemini-3.5-Flash judge)",
    "model_note": "Model roles are separated: Qwen3.6-27B is the primary segmenter and strongest fixed-boundary raw-frame labeler; Qwen3.5-397B remains the strongest tested predicted-boundary candidate selector; Gemini-3.5-Flash is the semantic evaluation judge.",
    "blog_refs": {
      "full100_seg_f1": 0.306,
      "full100_label_acc": 0.61,
      "full100_e2e_f1": 0.168,
      "homer_only_gemini_seg_f1": 0.227,
      "same_recipe_non_gemini_seg": "0.11-0.14"
    },
    "best": {
      "seg_f1": 0.2031,
      "seg_config": "Qwen3.6-27B · S2 pad=0 + full-cover local prompt · timestamped contact sheets",
      "label_acc": 0.5574,
      "label_config": "Qwen3.6-27B raw labels · Gemini-3.5-Flash judge · fixed reference boundaries",
      "e2e_f1": 0.1542,
      "e2e_config": "S2 predicted boundaries + Qwen3.5-397B multi-candidate selector · Gemini-3.5-Flash judge"
    },
    "generated_note": "All listed Label Acc and Semantic E2E entries are rescored with Gemini-3.5-Flash judge; Segment F1 remains pure temporal IoU. The 27B-only E2E audit was completed on 2026-08-12."
  },
  "glossary": [
    {
      "term": "contact sheet",
      "def": "按固定间隔抽帧拼成的带时间戳网格图，用于时间分段。本文默认每 0.5 秒一帧，每张约 20 格。"
    },
    {
      "term": "temporal collage",
      "def": "把 past / current / future 的整帧网格合并给标注模型，用于固定边界标注消融。"
    },
    {
      "term": "neighbor sheet",
      "def": "把上一段、当前段和下一段的 contact sheets 一起给标注模型，用于测试相邻动作上下文是否有帮助。"
    },
    {
      "term": "proxy hand-collage",
      "def": "在没有可靠手部轨迹时，用 YOLO 或画面中心启发式裁剪出的近似手部拼图；不等同于重建腕轨迹裁剪。"
    },
    {
      "term": "HaWoR-reconstructed wrist-guided crop",
      "def": "先用 HaWoR 从第一视角视频估计腕部轨迹，再基于估计轨迹裁剪手部区域；不是传感器 ground truth。"
    },
    {
      "term": "proxy overlay",
      "def": "在原帧上叠加光流或启发式视觉提示；不是真实手部重建。"
    },
    {
      "term": "GEPA-derived segmentation prompt",
      "def": "Macrodata 通过 GEPA 搜索得到的 completed-event segmentation rules；本文推理时复用的是规则文本，而不是运行 GEPA。"
    },
    {
      "term": "S1 denser cuts",
      "def": "提高预测片段密度以提升召回率的第一遍分段设置。"
    },
    {
      "term": "S2 pad=0 + full-cover local prompt",
      "def": "粗分后在局部时间窗口内精修；pad=0 表示不引入窗口外上下文，full-cover 要求覆盖窗口内可见完成动作。"
    },
    {
      "term": "candidate selector",
      "def": "在同一预测边界上生成多条候选标签，再由 Qwen3.5-397B 选择最终标签；selector 不读取 gold 标签。"
    },
    {
      "term": "Qwen3.6-27B",
      "def": "本文主要分段模型，也用于部分候选标签生成。"
    },
    {
      "term": "Qwen3.5-397B",
      "def": "用于候选标签生成和 candidate selector；不作为主语义评测 judge。"
    },
    {
      "term": "Gemini-3.5-Flash",
      "def": "本文主语义评测 judge，用于 Label Acc 和 Semantic E2E F1 的语义匹配。"
    },
    {
      "term": "HomER 25 / 470",
      "def": "本文评测范围：25 个第一视角人类操作视频，470 个参考片段。"
    }
  ],
  "segmentation": [
    {
      "id": "egovid_baseline",
      "name": "EgoANT production baseline: wrist-speed segmentation + merge",
      "f1": 0.0953,
      "p": null,
      "r": null,
      "match": 61,
      "pred": 810,
      "gold": 470,
      "model": "rule-based（腕速 minima + merge）",
      "full25": true,
      "note": "Predicted segments exceed reference segments",
      "method": {
        "goal": "评估基于腕速候选边界的生产管线基线。",
        "how": "HaWoR 重建手部运动后，根据腕部速度低谷生成候选边界，并进行相邻片段合并。",
        "input": "视频 + HaWoR 手部运动重建",
        "result": "Segment F1 0.0953；810 个预测片段，470 个参考片段",
        "verdict": "该启发式基线产生的片段数量明显多于参考片段。"
      }
    },
    {
      "id": "cs_max3_397b",
      "name": "Contact-sheet chunking (max_sheets=3)",
      "f1": 0.0952,
      "p": 0.132,
      "r": 0.075,
      "match": 35,
      "pred": 265,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "Chunk seams introduce pseudo-boundaries",
      "method": {
        "goal": "评估分片提交 contact sheets 的影响。",
        "how": "旧版 prompt；每次请求最多包含 3 张 sheet。",
        "input": "分片 contact sheets",
        "result": "Segment F1 0.0952",
        "verdict": "请求分片边界会被模型误识别为动作边界。"
      }
    },
    {
      "id": "cs_max3_27b",
      "name": "Contact-sheet chunking (max_sheets=3) · 27B",
      "f1": 0.1278,
      "p": 0.171,
      "r": 0.102,
      "match": 48,
      "pred": 281,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Same chunked setup with Qwen3.6-27B",
      "method": {
        "goal": "在相同分片设置下替换分段模型。",
        "how": "同 max_sheets=3 与旧版 prompt，模型换为 Qwen3.6-27B。",
        "input": "分片 contact sheets",
        "result": "Segment F1 0.1278",
        "verdict": "模型变化不能消除分片请求边界带来的伪边界问题。"
      }
    },
    {
      "id": "whole_legacy_27b",
      "name": "Whole-episode sheets + legacy prompt",
      "f1": 0.123,
      "p": 0.257,
      "r": 0.081,
      "match": 38,
      "pred": 148,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Fewer pseudo-boundaries but fewer predicted segments",
      "method": {
        "goal": "移除分片请求边界。",
        "how": "整集 sheets 一次性作为视觉输入提交，使用旧版 prompt。",
        "input": "整集 contact sheets",
        "result": "Segment F1 0.1230；148 个预测片段",
        "verdict": "伪边界减少，但预测片段数量低于参考片段。"
      }
    },
    {
      "id": "aligned_gepa_27b",
      "name": "Whole-episode sheets + GEPA-derived segmentation prompt",
      "f1": 0.1369,
      "p": 0.228,
      "r": 0.098,
      "match": 46,
      "pred": 202,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Improves over legacy prompt but remains low-recall",
      "method": {
        "goal": "使用 completed-event segmentation rules 对齐公开协议。",
        "how": "整集 sheets 加入 GEPA-derived segmentation prompt。",
        "input": "整集 contact sheets + GEPA-derived segmentation prompt",
        "result": "Segment F1 0.1369",
        "verdict": "相对旧版 prompt 有提高，但召回率仍较低。"
      }
    },
    {
      "id": "s1_full25_397b",
      "name": "S1 denser cuts",
      "f1": 0.1556,
      "p": 0.143,
      "r": 0.17,
      "match": 80,
      "pred": 558,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "Higher recall with more predicted segments",
      "method": {
        "goal": "提高预测片段密度以改善召回率。",
        "how": "调整 duration prior 与分段密度指令，覆盖全部 25 个 HomER 视频。",
        "input": "整集 sheets + denser-cut prompt",
        "result": "Segment F1 0.1556；558 个预测片段",
        "verdict": "召回率提高，同时预测片段数量增加。"
      }
    },
    {
      "id": "s2_full25_397b",
      "name": "S2 early local refinement (pad≈1, no full-cover)",
      "f1": 0.1674,
      "p": 0.163,
      "r": 0.172,
      "match": 81,
      "pred": 498,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "Early local-refinement configuration",
      "method": {
        "goal": "在粗分后加入局部时间窗口精修。",
        "how": "粗边界附近生成局部 contact sheets，early 设置约 pad=1.0。",
        "input": "局部 contact sheets + coarse-bound hints",
        "result": "Segment F1 0.1674",
        "verdict": "局部精修高于对应粗分设置，但不同于最终 full-cover 配置。"
      }
    },
    {
      "id": "s2_pad0_plain_27b",
      "name": "S2 local refinement pad=0 (without full-cover)",
      "f1": 0.1711,
      "p": 0.1546,
      "r": 0.1915,
      "match": 90,
      "pred": 582,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Pad=0 variant before full-cover prompt",
      "method": {
        "goal": "比较局部精修窗口的外扩宽度。",
        "how": "pad_sec=0，无覆盖完整动作提示词。",
        "input": "局部 contact sheets",
        "result": "Segment F1 0.1711；582 个预测片段",
        "verdict": "pad=0 高于其他 pad-out 设置，但预测片段仍较多。"
      }
    },
    {
      "id": "s2_pad05_27b",
      "name": "S2 local refinement pad=0.5",
      "f1": 0.1444,
      "p": 0.1266,
      "r": 0.1681,
      "match": 79,
      "pred": 624,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Pad-out by 0.5 seconds",
      "method": {
        "goal": "测试轻微窗口外扩。",
        "how": "局部精修时向两侧加入 0.5 秒上下文。",
        "input": "局部 contact sheets",
        "result": "Segment F1 0.1444",
        "verdict": "该设置低于 pad=0。"
      }
    },
    {
      "id": "s2_pad1_27b",
      "name": "S2 local refinement pad=1.0",
      "f1": 0.1485,
      "p": 0.1259,
      "r": 0.1809,
      "match": 85,
      "pred": 675,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Pad-out by 1 second",
      "method": {
        "goal": "测试 1 秒窗口外扩。",
        "how": "局部精修时向两侧加入 1.0 秒上下文。",
        "input": "局部 contact sheets",
        "result": "Segment F1 0.1485",
        "verdict": "该设置低于 pad=0。"
      }
    },
    {
      "id": "s2_pad2_27b",
      "name": "S2 local refinement pad=2.0",
      "f1": 0.1436,
      "p": 0.122,
      "r": 0.1745,
      "match": 82,
      "pred": 672,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Pad-out by 2 seconds",
      "method": {
        "goal": "测试 2 秒窗口外扩。",
        "how": "局部精修时向两侧加入 2.0 秒上下文。",
        "input": "局部 contact sheets",
        "result": "Segment F1 0.1436",
        "verdict": "该设置低于 pad=0。"
      }
    },
    {
      "id": "s2_midpoint_post",
      "name": "S2 pad=0 + midpoint full-cover postprocess",
      "f1": 0.1635,
      "p": 0.1478,
      "r": 0.183,
      "match": 86,
      "pred": 582,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Scripted coverage postprocess",
      "method": {
        "goal": "比较脚本式覆盖后处理与 prompt 约束。",
        "how": "在 pad=0 预测后应用 midpoint full-cover 后处理。",
        "input": "预测边界",
        "result": "Segment F1 0.1635",
        "verdict": "该后处理低于直接在 prompt 中加入 full-cover 约束。"
      }
    },
    {
      "id": "s2_fullcover_qwen36",
      "name": "S2 pad=0 + full-cover local prompt",
      "f1": 0.2031,
      "p": 0.256,
      "r": 0.168,
      "match": 79,
      "pred": 308,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "Highest Segment F1 among evaluated segmentation settings",
      "method": {
        "goal": "在局部时间窗口内重切并覆盖可见完成动作。",
        "how": "粗分后生成局部 timestamped contact sheets；pad=0；prompt 要求覆盖窗口内完成动作。",
        "input": "局部 timestamped contact sheets + coarse-bound hints",
        "result": "Segment F1 0.2031；308 个预测片段",
        "verdict": "这是已评测分段配置中的最高 Segment F1。"
      }
    },
    {
      "id": "merge_exact",
      "name": "Postprocess: merge adjacent identical labels",
      "f1": 0.1987,
      "p": null,
      "r": null,
      "match": 77,
      "pred": 305,
      "gold": 470,
      "model": "基于规则的后处理",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试标签相同的相邻预测段是否应被合并。",
        "how": "按时间顺序扫描 S2 预测段；只有相邻段的 subtask 规范化后完全一致时才合并。这是预测 JSON 后处理，不是新的模型调用。",
        "input": "S2 full-cover 预测：start_sec、end_sec、subtask",
        "result": "Segment F1 0.1987",
        "verdict": "该合并策略低于未合并的 S2 full-cover 结果。"
      }
    },
    {
      "id": "merge_verb",
      "name": "Postprocess: merge adjacent verb/object matches",
      "f1": 0.1947,
      "p": null,
      "r": null,
      "match": 74,
      "pred": 290,
      "gold": 470,
      "model": "基于规则的后处理",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试描述同一动词/物体的相邻预测段是否应被合并。",
        "how": "从相邻 subtask 文本中抽取近似动作词和关键物体；若两者兼容则合并。按相邻段标签与时间间隙合并。",
        "input": "S2 full-cover 预测：start_sec、end_sec、subtask",
        "result": "Segment F1 0.1947",
        "verdict": "该合并策略低于未合并的 S2 full-cover 结果。"
      }
    },
    {
      "id": "merge_bridge",
      "name": "Postprocess: bridge short gaps then merge",
      "f1": 0.1883,
      "p": null,
      "r": null,
      "match": 69,
      "pred": 263,
      "gold": 470,
      "model": "基于规则的后处理",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试合并前先桥接很短时间空隙是否有帮助。",
        "how": "把相邻 S2 预测段之间的很短空隙视作连续，再按标签或动词/物体兼容规则尝试合并。",
        "input": "S2 full-cover 预测：start_sec、end_sec、subtask",
        "result": "Segment F1 0.1883",
        "verdict": "该合并策略低于未合并的 S2 full-cover 结果。"
      }
    }
  ],
  "labeling": [
    {
      "id": "raw_27b",
      "name": "raw frames · Qwen3.6-27B",
      "acc": 0.5574,
      "n_match": 262,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.05531914889999989,
      "note": "262 / 470 semantic matches under fixed reference boundaries",
      "method": {
        "goal": "评估 27B 在固定参考边界下的标注准确率。",
        "how": "对每个参考片段抽取 raw frames，由 Qwen3.6-27B 生成标签，再由 Gemini-3.5-Flash 评测。",
        "input": "raw frames",
        "result": "Label Acc 55.7%",
        "verdict": "这是固定参考边界诊断设置中的最高观察值。"
      }
    },
    {
      "id": "temporal_collage_27b",
      "name": "temporal collage · Qwen3.6-27B",
      "acc": 0.5277,
      "n_match": 248,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.025531914899999952,
      "note": "248 / 470 semantic matches",
      "method": {
        "goal": "评估 past/current/future 整帧上下文对固定边界标注的影响。",
        "how": "为每个参考片段构造 temporal collage，由 Qwen3.6-27B 生成标签。",
        "input": "temporal collage",
        "result": "Label Acc 52.8%",
        "verdict": "该设置低于 raw 27B。"
      }
    },
    {
      "id": "l2_hawor_27b",
      "name": "HaWoR 腕轨迹裁剪 · 27B",
      "acc": 0.5234042553191489,
      "n_match": 246,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.0212765953191489,
      "note": "246 / 470 semantic matches; below raw 27B but above the 397B HaWoR crop row",
      "method": {
        "goal": "评估真正 HaWoR 腕轨迹裁剪在 27B 固定边界标注下是否优于原始帧。",
        "how": "先用 HaWoR 估计腕部轨迹并裁剪手部区域；裁剪不可用时回退到 raw frames；由 Qwen3.6-27B 生成标签，再用 Gemini-3.5-Flash 评测。",
        "input": "HaWoR wrist-guided hand crop with raw fallback",
        "result": "Label Acc 52.34% (246/470)",
        "verdict": "该设置高于 397B HaWoR crop，但仍低于 raw 27B。"
      }
    },
    {
      "id": "overlay_27b",
      "name": "proxy overlay · Qwen3.6-27B",
      "acc": 0.5064,
      "n_match": 238,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.004255319099999988,
      "note": "238 / 470 semantic matches; overlay is heuristic, not hand reconstruction",
      "method": {
        "goal": "评估启发式叠加提示对固定边界标注的影响。",
        "how": "在 raw frames 上叠加光流或启发式视觉提示，由 Qwen3.6-27B 生成标签。",
        "input": "proxy overlay frames",
        "result": "Label Acc 50.6%",
        "verdict": "该设置低于 raw 27B。"
      }
    },
    {
      "id": "l1_neighbor_27b",
      "name": "neighbor sheet · Qwen3.6-27B",
      "acc": 0.4085,
      "n_match": 192,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.09361702127659574,
      "note": "192 / 470 semantic matches; neighbor context is still below raw 27B",
      "method": {
        "goal": "评估 27B 是否能更好利用上一/当前/下一段上下文。",
        "how": "同时输入 previous/current/next segment sheets，由 Qwen3.6-27B 生成标签，再由 Gemini-3.5-Flash 评测。",
        "input": "neighbor contact sheets",
        "result": "Label Acc 40.9%",
        "verdict": "该设置略高于 397B neighbor，但明显低于 raw 27B。"
      }
    },
    {
      "id": "l2_proxy_27b",
      "name": "proxy hand-collage · Qwen3.6-27B",
      "acc": 0.3851,
      "n_match": 181,
      "n": 470,
      "model": "Qwen3.6-27B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.11702127659574468,
      "note": "181 / 470 semantic matches; below raw 27B and HaWoR crop",
      "method": {
        "goal": "评估 27B 在近似手部拼贴输入下的固定边界标注。",
        "how": "使用 YOLO 或画面中心启发式裁剪手部附近区域后拼图提交；该路径不读取 HaWoR 腕轨迹。",
        "input": "proxy hand-collage",
        "result": "Label Acc 38.5%",
        "verdict": "该近似裁剪路径低于 raw 27B，也低于 397B proxy hand-collage。"
      },
      "figure": "assets/demos/demo_handcrop_homer7_yolo_t1.jpg"
    },
    {
      "id": "l2_hawor",
      "name": "HaWoR 腕轨迹裁剪 · 397B",
      "acc": 0.5085,
      "n_match": 239,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.0063829786999999305,
      "note": "239 / 470 semantic matches; crop path uses raw fallback when needed",
      "method": {
        "goal": "评估基于 HaWoR 重建腕轨迹的裁剪输入。",
        "how": "用 HaWoR 估计腕部轨迹并裁剪手部区域；裁剪不完整时使用 raw fallback。",
        "input": "HaWoR-reconstructed wrist-guided crop + raw fallback",
        "result": "Label Acc 50.9%",
        "verdict": "该混合输入略高于 raw 397B，低于 raw 27B。"
      }
    },
    {
      "id": "raw_397b",
      "name": "raw frames · Qwen3.5-397B",
      "acc": 0.5021,
      "n_match": 236,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.0,
      "note": "236 / 470 semantic matches",
      "method": {
        "goal": "评估 397B raw-frame 固定边界标注。",
        "how": "对每个参考片段抽取 raw frames，由 Qwen3.5-397B 生成标签，再由 Gemini-3.5-Flash 评测。",
        "input": "raw frames",
        "result": "Label Acc 50.2%",
        "verdict": "作为 397B raw-frame 基线。"
      }
    },
    {
      "id": "predictions_labeling",
      "name": "raw frames duplicate audit · Qwen3.5-397B",
      "acc": 0.5021,
      "n_match": 236,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": 0.0,
      "note": "236 / 470 semantic matches",
      "method": {
        "goal": "审计一份重复预测产物。",
        "how": "用相同 Gemini judge 对复制的预测文件重新计分。",
        "input": "raw label predictions",
        "result": "Label Acc 50.2%",
        "verdict": "与 raw 397B 结果一致。"
      }
    },
    {
      "id": "overlay_proxy",
      "name": "proxy overlay · Qwen3.5-397B",
      "acc": 0.4851,
      "n_match": 228,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.01702127660000008,
      "note": "228 / 470 semantic matches",
      "method": {
        "goal": "评估启发式 overlay 输入对 397B 标注的影响。",
        "how": "使用 optical-flow 或 center-proxy 视觉提示；该输入不等同于手部重建。",
        "input": "proxy overlay frames",
        "result": "Label Acc 48.5%",
        "verdict": "该设置低于 raw 397B。"
      }
    },
    {
      "id": "temporal_collage",
      "name": "temporal collage · Qwen3.5-397B",
      "acc": 0.4511,
      "n_match": 212,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.05106382980000007,
      "note": "212 / 470 semantic matches",
      "method": {
        "goal": "评估 whole-frame past/current/future 上下文对 397B 标注的影响。",
        "how": "为每个参考片段构造整帧 temporal collage。",
        "input": "whole-frame temporal collage",
        "result": "Label Acc 45.1%",
        "verdict": "该设置低于 raw 397B。"
      }
    },
    {
      "id": "l1_ts_rerun",
      "name": "neighbor sheet + timestamps · Qwen3.5-397B",
      "acc": 0.4,
      "n_match": 188,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.10212765960000003,
      "note": "188 / 470 semantic matches",
      "method": {
        "goal": "测试给 neighbor sheets 添加秒级时间戳后的效果。",
        "how": "上一/当前/下一段 sheet 均加入秒级时间戳后重新标注。",
        "input": "timestamped neighbor sheets",
        "result": "Label Acc 40.0%",
        "verdict": "该设置低于 raw 397B。"
      }
    },
    {
      "id": "l1_neighbor",
      "name": "neighbor sheet · Qwen3.5-397B",
      "acc": 0.3957,
      "n_match": 186,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.10638297870000007,
      "note": "186 / 470 semantic matches",
      "method": {
        "goal": "评估上一段/当前段/下一段上下文对固定边界标注的影响。",
        "how": "同时输入 previous/current/next segment sheets。",
        "input": "neighbor contact sheets",
        "result": "Label Acc 39.6%",
        "verdict": "该设置低于 raw 397B。"
      }
    },
    {
      "id": "l2_yolo_proxy",
      "name": "proxy hand-collage · Qwen3.5-397B",
      "acc": 0.3915,
      "n_match": 184,
      "n": 470,
      "model": "Qwen3.5-397B · Gemini-3.5-Flash judge",
      "full25": true,
      "delta_vs_raw": -0.11063829790000007,
      "note": "184 / 470 semantic matches",
      "method": {
        "goal": "评估近似手部裁剪拼图。",
        "how": "使用 YOLO 或中心启发式裁剪，而不是重建腕轨迹。",
        "input": "proxy hand-collage",
        "result": "Label Acc 39.1%",
        "verdict": "该设置低于 raw 397B。"
      },
      "figure": "assets/demos/demo_handcrop_homer7_yolo_t1.jpg"
    }
  ],
  "e2e": [
    {
      "id": "egovid_e2e",
      "name": "EgoANT production one-pass · Gemini judge",
      "seg_f1": 0.0953,
      "e2e_f1": 0.064063,
      "pred_gold": "810/470",
      "note": "810 predicted / 470 reference segments; 41 semantic matches after temporal matching",
      "method": {
        "goal": "评估生产管线基线的端到端输出。",
        "how": "腕速候选边界生成后，对每段生成标签。",
        "result": "Semantic E2E F1 0.0641",
        "verdict": "该生产基线低于 WGO-Bench 评测管线的 S2 配置。"
      }
    },
    {
      "id": "s2_self",
      "name": "S2 boundaries + 27B self-label · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.123393,
      "pred_gold": "308/470",
      "note": "48 semantic matches after temporal matching",
      "method": {
        "goal": "评估分段模型自标。",
        "how": "使用 S2 预测边界，并保留 Qwen3.6-27B 生成的标签。",
        "result": "Semantic E2E F1 0.1234",
        "verdict": "该设置低于后续 relabel 和 selector 设置。"
      }
    },
    {
      "id": "raw27b_e2e",
      "name": "S2 + 27B raw relabel · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.128535,
      "pred_gold": "308/470",
      "note": "50 semantic matches after temporal matching",
      "method": {
        "goal": "测试固定边界诊断中表现最高的 27B raw 标注是否也提高 E2E。",
        "how": "固定 S2 预测边界，由 Qwen3.6-27B 基于 raw frames 重新生成标签。",
        "result": "Semantic E2E F1 0.1285",
        "verdict": "该设置高于 self-label，低于 397B raw 和 selector。"
      }
    },
    {
      "id": "raw397",
      "name": "S2 + 397B raw relabel · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.141388,
      "pred_gold": "308/470",
      "note": "55 semantic matches after temporal matching",
      "method": {
        "goal": "评估 397B raw-frame relabel。",
        "how": "固定 S2 预测边界，由 Qwen3.5-397B 基于 raw frames 重新生成标签。",
        "result": "Semantic E2E F1 0.1414",
        "verdict": "这是低成本 predicted-boundary E2E 配置。"
      }
    },
    {
      "id": "ffmpeg397",
      "name": "S2 + 397B ffmpeg-raw relabel · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1491,
      "pred_gold": "308/470",
      "note": "58 semantic matches after temporal matching",
      "method": {
        "goal": "评估另一套解码/抽帧路径产生的候选标签。",
        "how": "固定 S2 预测边界，使用 ffmpeg 抽帧后由 Qwen3.5-397B 标注。",
        "result": "Semantic E2E F1 0.1491",
        "verdict": "该候选源进入 selector 比较。"
      }
    },
    {
      "id": "nb28",
      "name": "S2 + neighbor relabel (27B prior) · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.123393,
      "pred_gold": "308/470",
      "note": "48 semantic matches after temporal matching",
      "method": {
        "goal": "评估带 27B prior 的 neighbor relabel。",
        "how": "固定 S2 预测边界，输入上一/当前/下一段视觉上下文和 27B prior。",
        "result": "Semantic E2E F1 0.1234",
        "verdict": "该设置低于 397B raw。"
      }
    },
    {
      "id": "nb397",
      "name": "S2 + neighbor relabel (397B prior) · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1491,
      "pred_gold": "308/470",
      "note": "58 semantic matches after temporal matching",
      "method": {
        "goal": "评估带 397B raw prior 的 neighbor relabel。",
        "how": "固定 S2 预测边界，输入上一/当前/下一段视觉上下文和 397B raw prior。",
        "result": "Semantic E2E F1 0.1491",
        "verdict": "该候选源进入 selector 比较。"
      }
    },
    {
      "id": "raw27b_inner05_e2e",
      "name": "S2 + 27B raw relabel (inner-0.5) · Gemini judge",
      "seg_f1": 0.2030848329048843,
      "e2e_f1": 0.13367609254498714,
      "pred_gold": "308/470",
      "note": "52 semantic matches after temporal matching",
      "method": {
        "goal": "测试 27B raw 标注在 S2 预测边界上的端到端表现。",
        "how": "固定 S2 预测边界，使用 inner-0.5 采样窗口，由 Qwen3.6-27B 基于 raw frames 重新生成标签。",
        "result": "Semantic E2E F1 0.1337",
        "verdict": "高于旧 27B raw/self-label，但低于 397B raw 和 397B selector。"
      }
    },
    {
      "id": "raw27b_ffmpeg_e2e",
      "name": "S2 + 27B ffmpeg-raw relabel · Gemini judge",
      "seg_f1": 0.2030848329048843,
      "e2e_f1": 0.14395886889460155,
      "pred_gold": "308/470",
      "note": "56 semantic matches after temporal matching",
      "method": {
        "goal": "测试 27B 在另一套 ffmpeg 解码/抽帧路径下的端到端表现。",
        "how": "固定 S2 预测边界，使用 ffmpeg 抽帧后由 Qwen3.6-27B 生成标签。",
        "result": "Semantic E2E F1 0.1440",
        "verdict": "这是补测的 27B-only E2E 路径中最高的一条，但仍低于 397B candidate selector。"
      }
    },
    {
      "id": "seeded_neighbor27_e2e",
      "name": "S2 + 27B seeded-neighbor relabel · Gemini judge",
      "seg_f1": 0.2030848329048843,
      "e2e_f1": 0.12596401028277635,
      "pred_gold": "308/470",
      "note": "49 semantic matches after temporal matching",
      "method": {
        "goal": "评估 27B seed 与相邻片段上下文是否能提高 predicted-boundary 标签。",
        "how": "固定 S2 预测边界，输入上一/当前/下一段视觉上下文，并使用 27B 分段标签作为文本先验。",
        "result": "Semantic E2E F1 0.1260",
        "verdict": "该设置低于 27B raw/ffmpeg relabel。"
      }
    },
    {
      "id": "raw27_prior_neighbor27_e2e",
      "name": "S2 + 27B raw-prior neighbor relabel · Gemini judge",
      "seg_f1": 0.2030848329048843,
      "e2e_f1": 0.14138817480719792,
      "pred_gold": "308/470",
      "note": "55 semantic matches after temporal matching",
      "method": {
        "goal": "评估 27B raw prior 加相邻视觉上下文的组合。",
        "how": "固定 S2 预测边界，输入 neighbor sheets，并用 27B raw 标签作为文本 prior 让 27B 重写。",
        "result": "Semantic E2E F1 0.1414",
        "verdict": "接近 397B raw relabel，但仍低于 27B ffmpeg 和 397B selector。"
      }
    },
    {
      "id": "selector27_e2e",
      "name": "S2 + 27B multi-candidate selector · Gemini judge",
      "seg_f1": 0.2030848329048843,
      "e2e_f1": 0.13624678663239076,
      "pred_gold": "308/470",
      "note": "53 semantic matches after temporal matching",
      "method": {
        "goal": "测试 27B 是否也适合作为多候选 selector。",
        "how": "在同一 S2 预测边界上生成多路候选描述，再由 Qwen3.6-27B 选择最终标签。selector 不读取 gold 标签。",
        "result": "Semantic E2E F1 0.1362",
        "verdict": "27B selector 没有超过 27B ffmpeg relabel，也没有超过 397B selector。"
      }
    },
    {
      "id": "selector397",
      "name": "S2 + 397B multi-candidate selector · Gemini judge",
      "seg_f1": 0.2031,
      "e2e_f1": 0.154242,
      "pred_gold": "308/470",
      "note": "60 semantic matches after temporal matching",
      "method": {
        "goal": "评估多候选选择。",
        "how": "在同一 S2 预测边界上生成 raw、ffmpeg、seed、rawprior 等候选，由 Qwen3.5-397B 选择最终标签。selector 不读取 gold 标签。",
        "result": "Semantic E2E F1 0.1542",
        "verdict": "这是已评测 E2E 配置中的最高观察值。"
      }
    }
  ],
  "walkthrough_toy": {
    "gold": [
      {
        "id": "G0",
        "start": 0.0,
        "end": 3.0
      },
      {
        "id": "G1",
        "start": 3.0,
        "end": 6.0
      },
      {
        "id": "G2",
        "start": 6.0,
        "end": 10.0
      }
    ],
    "pred": [
      {
        "id": "P0",
        "start": 0.5,
        "end": 2.8
      },
      {
        "id": "P1",
        "start": 2.8,
        "end": 5.5
      },
      {
        "id": "P2",
        "start": 5.5,
        "end": 8.0
      },
      {
        "id": "P3",
        "start": 8.0,
        "end": 9.5
      }
    ],
    "after_snap": [
      {
        "id": "P0",
        "start": 0.0,
        "end": 2.8
      },
      {
        "id": "P1",
        "start": 2.8,
        "end": 5.5
      },
      {
        "id": "P2",
        "start": 5.5,
        "end": 8.0
      },
      {
        "id": "P3",
        "start": 8.0,
        "end": 10.0
      }
    ],
    "ious": {
      "P0-G0": 0.933,
      "P1-G1": 0.781
    },
    "n_match": 2,
    "P": 0.5,
    "R": 0.667,
    "F1": 0.571
  }
}
  main();
})();
