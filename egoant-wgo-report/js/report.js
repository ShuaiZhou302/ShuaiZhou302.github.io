/* EgoANT HomER blog report renderer */
(function () {
  // Decision path only; pad ablations go to #seg-pad-tbody
  const MAIN_SEG_IDS = new Set([
    "egovid_baseline","cs_max3_397b","cs_max3_27b","whole_legacy_27b",
    "aligned_gepa_27b","s1_full25_397b","s2_full25_397b","s2_fullcover_qwen36",
    "s2_midpoint_post","merge_exact","merge_verb","merge_bridge"
  ]);
  const PAD_SEG_IDS = new Set([
    "s2_pad0_plain_27b","s2_pad05_27b","s2_pad1_27b","s2_pad2_27b"
  ]);

  const ABLATION_I18N = {
    "egovid_baseline": {
      "zh": {
        "name": "EgoANT 原管线：腕速规则切段 + merge",
        "note": "过分割：预测段远多于 gold",
        "model": "rule-based（腕速 minima + merge）"
      },
      "en": {
        "name": "EgoANT baseline: wrist-speed rule cuts + merge",
        "note": "Over-segmentation: far more preds than gold",
        "model": "rule-based (wrist minima + merge)"
      }
    },
    "cs_max3_397b": {
      "zh": {
        "name": "Contact sheet 分片（每次最多 3 张）",
        "note": "分片接缝处出现假边界",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Contact sheet chunks (max 3 sheets/call)",
        "note": "Fake boundaries at chunk seams",
        "model": "Qwen3.5-397B"
      }
    },
    "cs_max3_27b": {
      "zh": {
        "name": "Contact sheet 分片（max_sheets=3）",
        "note": "同设置下小模型优于大模型分片版",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Contact sheet chunks (max_sheets=3)",
        "note": "Smaller model beats large on same chunking",
        "model": "Qwen3.6-27B"
      }
    },
    "whole_legacy_27b": {
      "zh": {
        "name": "整集一次 + 旧版 prompt（无切段规则清单）",
        "note": "欠分割：预测段过少",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Whole-episode + legacy prompt (no rule list)",
        "note": "Under-segmentation: too few preds",
        "model": "Qwen3.6-27B"
      }
    },
    "aligned_gepa_27b": {
      "zh": {
        "name": "整集一次 + 切段规则清单（GEPA）",
        "note": "仍欠分割，但比旧版略好",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Whole-episode + segmentation rule list (GEPA)",
        "note": "Still under-segments; better than legacy",
        "model": "Qwen3.6-27B"
      }
    },
    "s1_full25_397b": {
      "zh": {
        "name": "第一遍加密切（S1）：抬召回",
        "note": "召回上升，但又切得过碎",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Pass-1 denser cuts (S1): lift recall",
        "note": "Recall up, but over-cuts",
        "model": "Qwen3.5-397B"
      }
    },
    "s2_full25_397b": {
      "zh": {
        "name": "第二遍局部精修早期版（窗外扩≈1s，尚未盖住完整动作）",
        "note": "早期局部精修配置",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Early local refine (≈1s pad-out; no full-cover yet)",
        "note": "Right direction; not final full-cover",
        "model": "Qwen3.5-397B"
      }
    },
    "s2_pad0_plain_27b": {
      "zh": {
        "name": "局部精修·窗口不外扩（尚未盖住完整动作）",
        "note": "窗口不外扩较好，但仍偏碎",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Local refine · no pad-out (no full-cover yet)",
        "note": "No pad-out helps; still shreddy",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad05_27b": {
      "zh": {
        "name": "局部精修·窗外扩 0.5s",
        "note": "向外多看 0.5s，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Local refine · pad-out 0.5s",
        "note": "Expanding 0.5s loses to no pad-out",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad1_27b": {
      "zh": {
        "name": "局部精修·窗外扩 1.0s",
        "note": "外扩 1s，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Local refine · pad-out 1.0s",
        "note": "1s pad-out worse than none",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_pad2_27b": {
      "zh": {
        "name": "局部精修·窗外扩 2.0s",
        "note": "外扩 2s，不如不外扩",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Local refine · pad-out 2.0s",
        "note": "2s pad-out worse than none",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_midpoint_post": {
      "zh": {
        "name": "窗口不外扩 + 算法补覆盖（后处理，非写进 prompt）",
        "note": "用算法补覆盖 ≠ 写进 prompt 的「盖住完整动作」",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "No pad-out + midpoint cover postprocess (not in prompt)",
        "note": "Algorithmic cover ≠ full-cover in the prompt",
        "model": "Qwen3.6-27B"
      }
    },
    "s2_fullcover_qwen36": {
      "zh": {
        "name": "局部再切：窗口不外扩 + 盖住完整动作（S2 · pad=0 · full-cover）",
        "note": "已评测分段配置最高值",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "Local re-cut: no pad-out + cover full actions (S2 · pad=0 · full-cover)",
        "note": "Best segmentation so far",
        "model": "Qwen3.6-27B"
      }
    },
    "merge_exact": {
      "zh": {
        "name": "后处理：合并相邻完全相同标签段",
        "note": "合并后 F1 下降",
        "model": "规则后处理（非 LLM）"
      },
      "en": {
        "name": "Postprocess: merge adjacent identical labels",
        "note": "F1 drops after merge",
        "model": "Rule postprocess (no LLM)"
      }
    },
    "merge_verb": {
      "zh": {
        "name": "后处理：按动词/物体合并相邻段",
        "note": "更激进合并，F1 再降",
        "model": "规则后处理（非 LLM）"
      },
      "en": {
        "name": "Postprocess: merge by verb/object",
        "note": "More aggressive merge; F1 falls further",
        "model": "Rule postprocess (no LLM)"
      }
    },
    "merge_bridge": {
      "zh": {
        "name": "后处理：跨短间隙桥接合并",
        "note": "跨短间隙合并，F1 降低最多",
        "model": "规则后处理（非 LLM）"
      },
      "en": {
        "name": "Postprocess: bridge short gaps then merge",
        "note": "Largest drop among merges",
        "model": "Rule postprocess (no LLM)"
      }
    },
    "raw_397b": {
      "zh": {
        "name": "raw 原帧 · Qwen3.5-397B",
        "note": "Gemini judge 基线",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Raw frames · Qwen3.5-397B",
        "note": "Gemini-judge baseline",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "overlay_proxy": {
      "zh": {
        "name": "proxy overlay · Qwen3.5-397B",
        "note": "非真 hand；低于 raw",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Proxy overlay · Qwen3.5-397B",
        "note": "Heuristic overlay; below raw",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "overlay_27b": {
      "zh": {
        "name": "proxy overlay · Qwen3.6-27B",
        "note": "近似叠图；未超过 raw 27B",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Proxy overlay · Qwen3.6-27B",
        "note": "Approximate overlay; below raw 27B",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      }
    },
    "temporal_collage": {
      "zh": {
        "name": "temporal collage · Qwen3.5-397B",
        "note": "低于 raw 397B",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Temporal collage · Qwen3.5-397B",
        "note": "Context pollutes current label",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "temporal_collage_27b": {
      "zh": {
        "name": "temporal collage · Qwen3.6-27B",
        "note": "低于 raw 27B",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Temporal collage · Qwen3.6-27B",
        "note": "Below raw 27B",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      }
    },
    "raw_27b": {
      "zh": {
        "name": "raw 原帧 · Qwen3.6-27B",
        "note": "固定边界标注最高",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Raw frames · Qwen3.6-27B",
        "note": "Best fixed-boundary labels",
        "model": "Qwen3.6-27B · Gemini-3.5-Flash judge"
      }
    },
    "predictions_labeling": {
      "zh": {
        "name": "raw 原帧重复审计 · Qwen3.5-397B",
        "note": "与 raw 397B 一致",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Raw-frame duplicate audit · Qwen3.5-397B",
        "note": "Matches raw 397B",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "l1_neighbor": {
      "zh": {
        "name": "邻段 sheet（上一/当前/下一段）",
        "note": "容易写到邻段动作",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Neighbor contact sheets (prev/cur/next)",
        "note": "Often labels neighboring actions",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "l1_ts_rerun": {
      "zh": {
        "name": "邻段 sheet + 秒级时间戳重跑",
        "note": "修时间戳仍低",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Neighbor sheets + second-level timestamps",
        "note": "Fixing timestamps still lowers accuracy",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "l2_yolo_proxy": {
      "zh": {
        "name": "proxy hand-collage · Qwen3.5-397B",
        "note": "近似 crop，不是真 hand-crop",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "Proxy hand-collage · Qwen3.5-397B",
        "note": "近似裁剪，不是重建腕轨迹裁剪",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "l2_hawor": {
      "zh": {
        "name": "HaWoR 真手部 crop",
        "note": "略高于 raw 397B，低于 raw 27B",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      },
      "en": {
        "name": "HaWoR 重建腕轨迹裁剪",
        "note": "Slightly above raw 397B, below raw 27B",
        "model": "Qwen3.5-397B · Gemini-3.5-Flash judge"
      }
    },
    "l4_strict_judge": {
      "zh": {
        "name": "更严 judge 重判 raw",
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
        "name": "YOLO/proxy hand-collage · 27B",
        "note": "更差",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "YOLO/proxy hand-collage · 27B",
        "note": "Worse",
        "model": "Qwen3.6-27B"
      }
    },
    "egovid_e2e": {
      "zh": {
        "name": "EgoANT one-pass",
        "note": "切+标一体弱",
        "model": null
      },
      "en": {
        "name": "EgoANT one-pass",
        "note": "Joint cut+label is weak",
        "model": null
      }
    },
    "s2_self": {
      "zh": {
        "name": "精修边界 + 分段模型自标",
        "note": "边界已锁",
        "model": null
      },
      "en": {
        "name": "Refined bounds + self-label from seg model",
        "note": "Bounds locked",
        "model": null
      }
    },
    "raw397": {
      "zh": {
        "name": "+ 397B 单路 raw 重标",
        "note": "固定 0.2031 预测边界；Gemini E2E 0.1414；调用少于 selector",
        "model": null
      },
      "en": {
        "name": "+ 397B raw-only relabel",
        "note": "Same 0.2031 predicted boundaries; Gemini E2E 0.1414; fewer calls than selector",
        "model": null
      }
    },
    "raw27b_e2e": {
      "zh": {
        "name": "+ 27B 单路 raw 重标",
        "note": "固定边界 Label Acc 最高，但 E2E 不是最高",
        "model": null
      },
      "en": {
        "name": "+ 27B raw-only relabel",
        "note": "Best fixed-boundary Label Acc, but not best E2E",
        "model": null
      }
    },
    "ffmpeg397": {
      "zh": {
        "name": "+ 397B ffmpeg 抽帧重标",
        "note": "抽帧路径变体",
        "model": null
      },
      "en": {
        "name": "+ 397B ffmpeg-frame relabel",
        "note": "Decode/sample path variant",
        "model": null
      }
    },
    "nb28": {
      "zh": {
        "name": "+ 邻段重标（27B prior）",
        "note": "得分下降",
        "model": null
      },
      "en": {
        "name": "+ neighbor relabel (27B prior)",
        "note": "Hurts score",
        "model": null
      }
    },
    "nb397": {
      "zh": {
        "name": "+ 邻段重标（raw397 prior）",
        "note": "",
        "model": null
      },
      "en": {
        "name": "+ neighbor relabel (raw397 prior)",
        "note": "",
        "model": null
      }
    },
    "selector397": {
      "zh": {
        "name": "+ 397B 多候选 selector",
        "note": "同一预测边界；Gemini E2E 0.1542；调用更多",
        "model": null
      },
      "en": {
        "name": "+ 397B multi-candidate selector",
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
    s2_fullcover_qwen36: { en: { goal: "Refine local windows while covering completed actions.", how: "Use local timestamped contact sheets, pad=0, and a full-cover prompt after coarse segmentation.", input: "local timestamped contact sheets plus coarse-bound hints", result: "Segment F1 0.2031; 308 predictions", verdict: "Highest Segment F1 among evaluated segmentation settings." } },
    merge_exact: { en: { goal: "Test adjacent identical-label merging.", how: "Merge adjacent predictions whose labels are exactly identical.", input: "S2 full-cover predictions", result: "Segment F1 0.1987", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    merge_verb: { en: { goal: "Test adjacent verb/object merging.", how: "Parse approximate verb/object matches and merge adjacent spans.", input: "S2 full-cover predictions", result: "Segment F1 0.1947", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    merge_bridge: { en: { goal: "Test short-gap bridge merging.", how: "Allow short temporal gaps before merging adjacent spans.", input: "S2 full-cover predictions", result: "Segment F1 0.1883", verdict: "This rule merge is below the unmerged S2 full-cover result." } },
    raw_27b: { en: { goal: "Evaluate 27B labeling under fixed reference boundaries.", how: "Sample raw frames from each reference segment, label with Qwen3.6-27B, and score with Gemini-3.5-Flash.", input: "raw frames", result: "Label Acc 55.7%", verdict: "Highest observed value in the fixed-reference-boundary diagnostic setting." } },
    temporal_collage_27b: { en: { goal: "Evaluate past/current/future context with 27B.", how: "Build temporal collages for fixed reference segments and label with Qwen3.6-27B.", input: "temporal collage", result: "Label Acc 52.8%", verdict: "Below raw 27B." } },
    overlay_27b: { en: { goal: "Evaluate heuristic overlay cues with 27B.", how: "Draw optical-flow or heuristic visual marks on raw frames before labeling.", input: "proxy overlay frames", result: "Label Acc 50.6%", verdict: "Below raw 27B." } },
    raw_397b: { en: { goal: "Evaluate 397B raw-frame labeling under fixed reference boundaries.", how: "Sample raw frames from each reference segment, label with Qwen3.5-397B, and score with Gemini-3.5-Flash.", input: "raw frames", result: "Label Acc 50.2%", verdict: "397B raw-frame baseline." } },
    predictions_labeling: { en: { goal: "Audit a duplicate prediction artifact.", how: "Score the copied prediction file with the same Gemini judge.", input: "raw label predictions", result: "Label Acc 50.2%", verdict: "Matches the raw 397B result." } },
    overlay_proxy: { en: { goal: "Evaluate heuristic overlay cues with 397B.", how: "Use optical-flow or center-proxy visual marks; this is not hand reconstruction.", input: "proxy overlay frames", result: "Label Acc 48.5%", verdict: "Below raw 397B." } },
    temporal_collage: { en: { goal: "Evaluate whole-frame past/current/future context with 397B.", how: "Build a temporal collage for each fixed reference segment.", input: "whole-frame temporal collage", result: "Label Acc 45.1%", verdict: "Below raw 397B." } },
    l1_neighbor: { en: { goal: "Evaluate previous/current/next context.", how: "Feed previous, current, and next segment sheets to the labeler.", input: "neighbor contact sheets", result: "Label Acc 39.6%", verdict: "Below raw 397B." } },
    l1_ts_rerun: { en: { goal: "Evaluate neighbor sheets with second-level timestamps.", how: "Re-run previous/current/next sheets after adding second-level timestamps.", input: "timestamped neighbor sheets", result: "Label Acc 40.0%", verdict: "Below raw 397B." } },
    l2_yolo_proxy: { en: { goal: "Evaluate approximate hand-crop collages.", how: "Use YOLO or center-heuristic crops rather than reconstructed wrist tracks.", input: "proxy hand-collage", result: "Label Acc 39.1%", verdict: "Below raw 397B." } },
    l2_hawor: { en: { goal: "Evaluate HaWoR-reconstructed wrist-guided crops.", how: "Estimate wrist tracks with HaWoR, crop around hands, and use raw fallback when crops are incomplete.", input: "HaWoR-reconstructed wrist-guided crop plus raw fallback", result: "Label Acc 50.9%", verdict: "Above raw 397B and below raw 27B." } },
    l4_strict_judge: { en: { goal: "Measure sensitivity to judge strictness.", how: "Re-score the same raw predictions with a stricter semantic rubric.", input: "unchanged predicted captions", result: "Accuracy 43.0%", verdict: "Main reports should keep the semantic judge fixed." } },
    l2_proxy_27b: { en: { goal: "Legacy excluded ablation.", how: "Approximate hand-collage with Qwen3.6-27B was not part of the Gemini-rescored main table.", input: "approximate hand collage", result: "Excluded from main table", verdict: "Do not compare with Gemini-rescored rows." } },
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

  function renderBars(el, rows, valueKey, maxVal, alt) {
    if (!el) return;
    el.innerHTML = rows.map((row) => {
      const r = locRow(row);
      const v = r[valueKey];
      const w = Math.max(2, Math.round((v / maxVal) * 100));
      return `<div class="bar-row">
        <div class="bar-label">${esc(r.name)}</div>
        <div class="bar-track"><div class="bar-fill${alt ? " alt" : ""}" style="width:${w}%"></div></div>
        <div class="bar-val">${valueKey === "acc" ? pct(v) : fmtF1(v)}</div>
      </div>`;
    }).join("");
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
    el.innerHTML = lane("Gold", toy.gold, "gold") + lane("Pred (after outer snap)", toy.after_snap, "pred") +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0.6rem 0 0">n_match=${toy.n_match} · F1≈${Number(toy.F1).toFixed(3)}</p>`;
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

  function segRowHTML(row, best) {
    const r = locRow(row);
    const bestCls = r.f1 === best ? "best" : "";
    const pr = (r.p != null && r.r != null) ? `${Number(r.p).toFixed(3)} / ${Number(r.r).toFixed(3)}` : "—";
    const mpg = (r.match != null) ? `${r.match}/${r.pred}/${r.gold}` : `—/—/${r.gold}`;
    return `<tr class="${bestCls}"><td>${esc(r.name)}</td><td class="num">${fmtF1(r.f1)}</td><td class="num">${pr}</td><td class="num">${mpg}</td><td>${esc(r.model)}</td><td>${esc(r.note || "")}</td></tr>`;
  }

  function fillSegTable(data) {
    const tbody = document.querySelector("#seg-tbody");
    if (!tbody) return;
    const best = data.meta.best.seg_f1;
    const rows = data.segmentation.filter((r) => MAIN_SEG_IDS.has(r.id));
    tbody.innerHTML = rows.map((r) => segRowHTML(r, best)).join("");
  }

  function fillSegPadTable(data) {
    const tbody = document.querySelector("#seg-pad-tbody");
    if (!tbody) return;
    const best = data.meta.best.seg_f1;
    const rows = data.segmentation.filter((r) => PAD_SEG_IDS.has(r.id));
    tbody.innerHTML = rows.length
      ? rows.map((r) => segRowHTML(r, best)).join("")
      : `<tr><td colspan="6">${lang()==="en" ? "No extra pad-out ablation rows." : "无额外窗口外扩消融行。"}</td></tr>`;
  }

  function fillLabelTable(data) {
    const tbody = document.querySelector("#label-tbody");
    if (!tbody) return;
    const best = data.meta.best.label_acc;
    tbody.innerHTML = data.labeling.map((row) => {
      const r = locRow(row);
      const bestCls = r.acc === best ? "best" : "";
      let delta = "—";
      if (r.delta_vs_raw != null) {
        const pp = r.delta_vs_raw * 100;
        delta = `<span class="${pp >= 0 ? "delta-up" : "delta-down"}">${pp >= 0 ? "+" : ""}${pp.toFixed(1)}pp</span>`;
      }
      return `<tr class="${bestCls}"><td>${esc(r.name)}</td><td class="num">${pct(r.acc)}</td><td class="num">${r.n_match}/${r.n}</td><td>${esc(r.model)}</td><td>${delta}</td><td>${esc(r.note || "")}</td></tr>`;
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
    const mainSeg = data.segmentation.filter((r) => ["egovid_baseline","cs_max3_397b","cs_max3_27b","whole_legacy_27b","aligned_gepa_27b","s1_full25_397b","s2_full25_397b","s2_fullcover_qwen36"].includes(r.id));
    renderBars(document.querySelector("#seg-bars"), mainSeg, "f1", 0.25);
    renderBars(document.querySelector("#label-bars"), data.labeling.filter((r) => r.id !== "l2_proxy_27b"), "acc", 0.60, true);
    renderBars(document.querySelector("#e2e-bars"), data.e2e, "e2e_f1", 0.18, true);
    fillSegTable(data);
    fillSegPadTable(data);
    fillLabelTable(data);
    fillE2ETable(data);
    renderTimeline(document.querySelector("#toy-timeline"), data.walkthrough_toy);
    renderMethods(document.querySelector("#seg-methods"), data.segmentation, "seg");
    renderMethods(document.querySelector("#label-methods"), data.labeling, "label");
    renderMethods(document.querySelector("#e2e-methods"), data.e2e, "e2e");
    window.__REPORT_DATA__ = { data, walk, boundary, cost, heroGrid };
    function rerenderDynamicI18n() {
      const D = window.__REPORT_DATA__;
      if (!D || !D.data) return;
      const mainSeg = D.data.segmentation.filter((r) => ["egovid_baseline","cs_max3_397b","cs_max3_27b","whole_legacy_27b","aligned_gepa_27b","s1_full25_397b","s2_full25_397b","s2_fullcover_qwen36"].includes(r.id));
      renderBars(document.querySelector("#seg-bars"), mainSeg, "f1", 0.25);
      renderBars(document.querySelector("#label-bars"), D.data.labeling.filter((r) => r.id !== "l2_proxy_27b"), "acc", 0.60, true);
      renderBars(document.querySelector("#e2e-bars"), D.data.e2e, "e2e_f1", 0.18, true);
      fillSegTable(D.data);
      fillSegPadTable(D.data);
      fillLabelTable(D.data);
      fillE2ETable(D.data);
      renderMethods(document.querySelector("#seg-methods"), D.data.segmentation, "seg");
      renderMethods(document.querySelector("#label-methods"), D.data.labeling, "label");
      renderMethods(document.querySelector("#e2e-methods"), D.data.e2e, "e2e");
      if (D.walk) renderWalk(D.walk);
      if (D.boundary) renderBoundaryCompare(D.boundary);
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
    "model_note": "Model roles are separated: Qwen3.6-27B is the primary segmenter; Qwen3.6-27B and Qwen3.5-397B generate label candidates; Qwen3.5-397B selects among candidates; Gemini-3.5-Flash is the primary semantic evaluation judge.",
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
    "generated_note": "All main Label Acc and Semantic E2E entries are rescored with Gemini-3.5-Flash judge; Segment F1 remains pure temporal IoU."
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
        "how": "pad_sec=0，尚未加入 full-cover 约束。",
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
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试基于相同标签的相邻片段合并。",
        "how": "相邻且标签完全相同时合并。",
        "input": "S2 full-cover 预测",
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
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试基于近似动词/物体匹配的相邻片段合并。",
        "how": "解析近似 verb/object 后合并相邻片段。",
        "input": "S2 full-cover 预测",
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
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "Rule merge lowers Segment F1",
      "method": {
        "goal": "测试允许短时间间隔桥接的相邻片段合并。",
        "how": "允许短间隙桥接后合并片段。",
        "input": "S2 full-cover 预测",
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
      "id": "l2_hawor",
      "name": "HaWoR-reconstructed wrist-guided crop · Qwen3.5-397B",
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
};
  window.__WALK__ = {
  "id": "homer_4",
  "instruction": "Clean tables, desks, or shelves with a cloth",
  "duration_sec": 130.03333333333333,
  "video": "assets/homer4/homer_4_seek.mp4",
  "gold_path": "assets/homer4/gold_homer_4.json",
  "pred_path": "assets/homer4/pred_homer_4_candidate_selector.json",
  "assets": {
    "contact_sheet_example": "assets/homer4/contact_sheet_example.jpg",
    "contact_window": "assets/homer4/contact_window_sample.jpg",
    "video_seek": "assets/homer4/homer_4_seek.mp4"
  },
  "pipeline_meta": {
    "n_sheets": 14,
    "prompt_variant": "refine_local_v1",
    "n_windows_refined": 8,
    "contact_params": "sample_sec=0.5, tile_px=224, ~20 tiles/sheet, yellow timestamps"
  },
  "scores_episode": {
    "n_gold": 15,
    "n_pred": 11,
    "temporal_iou075": 4,
    "semantic_match": 3,
    "e2e_f1_episode": 0.231,
    "note_zh": "本集分数；全集 HomER micro E2E F1 = 0.1542",
    "note_en": "Episode score; HomER micro E2E F1 = 0.1542 overall"
  },
  "candidate_demo_segment": {
    "start_sec": 26.5,
    "end_sec": 45.0,
    "subtask": "Wipe the drawer interior with a cloth",
    "candidate_labels": {
      "raw": "Wipe the table with a cloth",
      "rawprior": "Wipe the drawer interior with a cloth",
      "seed": "Wipe the interior of the open drawer",
      "ffmpeg": "Wipe the drawer with a cloth"
    },
    "candidate_select_source": "B",
    "candidate_select_meta": {
      "fps": 30.0,
      "nframes": 3901,
      "frames_per_sheet": 5,
      "image_max_side": 1120
    },
    "index": 3
  },
  "gold_segments": [
    {
      "start_sec": 0.0,
      "end_sec": 9.69,
      "subtask": "wipe the top surface of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_00.mp4"
    },
    {
      "start_sec": 9.69,
      "end_sec": 22.898,
      "subtask": "wipe the front surface and drawer of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_01.mp4"
    },
    {
      "start_sec": 22.898,
      "end_sec": 26.785,
      "subtask": "open the nightstand drawer",
      "clip": "assets/homer4/clips/gold_02.mp4"
    },
    {
      "start_sec": 26.785,
      "end_sec": 44.345,
      "subtask": "wipe the inside of the nightstand drawer with a cloth",
      "clip": "assets/homer4/clips/gold_03.mp4"
    },
    {
      "start_sec": 44.345,
      "end_sec": 47.292,
      "subtask": "close the nightstand drawer",
      "clip": "assets/homer4/clips/gold_04.mp4"
    },
    {
      "start_sec": 47.292,
      "end_sec": 53.789,
      "subtask": "wipe the top surface of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_05.mp4"
    },
    {
      "start_sec": 53.789,
      "end_sec": 60.341,
      "subtask": "fold the cloth",
      "clip": "assets/homer4/clips/gold_06.mp4"
    },
    {
      "start_sec": 60.341,
      "end_sec": 66.365,
      "subtask": "wipe the top surface of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_07.mp4"
    },
    {
      "start_sec": 66.365,
      "end_sec": 77.904,
      "subtask": "wipe the front of wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_08.mp4"
    },
    {
      "start_sec": 77.904,
      "end_sec": 86.989,
      "subtask": "wipe the drawer handle of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_09.mp4"
    },
    {
      "start_sec": 86.989,
      "end_sec": 96.318,
      "subtask": "wipe the top surface of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_10.mp4"
    },
    {
      "start_sec": 96.318,
      "end_sec": 97.709,
      "subtask": "fold the cloth",
      "clip": "assets/homer4/clips/gold_11.mp4"
    },
    {
      "start_sec": 97.709,
      "end_sec": 114.862,
      "subtask": "wipe the top surface of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_12.mp4"
    },
    {
      "start_sec": 114.862,
      "end_sec": 120.034,
      "subtask": "wipe the front drawer of the wooden nightstand with a white cloth",
      "clip": "assets/homer4/clips/gold_13.mp4"
    },
    {
      "start_sec": 120.034,
      "end_sec": 130.03,
      "subtask": "wipe the top surface of the wooden table with a white cloth",
      "clip": "assets/homer4/clips/gold_14.mp4"
    }
  ],
  "pred_segments": [
    {
      "start_sec": 0.0,
      "end_sec": 23.5,
      "subtask": "Wipe the table with a cloth",
      "candidate_labels": {
        "raw": "Wipe the table with a cloth",
        "rawprior": "Wipe the table with a cloth",
        "seed": "Wipe the top surface and exterior sides of the wooden cabinet",
        "ffmpeg": "Wipe the table with the cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_00.mp4"
    },
    {
      "start_sec": 23.5,
      "end_sec": 24.5,
      "subtask": "Open the drawer",
      "candidate_labels": {
        "raw": "Open the drawer",
        "rawprior": "Open the drawer",
        "seed": "Open the top drawer of the cabinet",
        "ffmpeg": "Open the drawer"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_01.mp4"
    },
    {
      "start_sec": 24.5,
      "end_sec": 26.5,
      "subtask": "Wipe the table with the cloth",
      "candidate_labels": {
        "raw": "Wipe the table with the cloth",
        "rawprior": "Wipe the table with the cloth",
        "seed": "Wipe the inside of the drawer",
        "ffmpeg": "Wipe the table with a cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_02.mp4"
    },
    {
      "start_sec": 26.5,
      "end_sec": 45.0,
      "subtask": "Wipe the drawer interior with a cloth",
      "candidate_labels": {
        "raw": "Wipe the table with a cloth",
        "rawprior": "Wipe the drawer interior with a cloth",
        "seed": "Wipe the interior of the open drawer",
        "ffmpeg": "Wipe the drawer with a cloth"
      },
      "candidate_select_source": "B",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_03.mp4"
    },
    {
      "start_sec": 45.0,
      "end_sec": 46.5,
      "subtask": "Wipe the table with a cloth",
      "candidate_labels": {
        "raw": "Wipe the table with a cloth",
        "rawprior": "Wipe the table with a cloth",
        "seed": "Wipe the top of the table",
        "ffmpeg": "Wipe the table with a cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_04.mp4"
    },
    {
      "start_sec": 46.5,
      "end_sec": 54.5,
      "subtask": "Wipe the table with a cloth",
      "candidate_labels": {
        "raw": "Wipe the table with a cloth",
        "rawprior": "Wipe the table with a cloth",
        "seed": "Wipe the top surface of the cabinet",
        "ffmpeg": "Wipe the table with the cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_05.mp4"
    },
    {
      "start_sec": 54.5,
      "end_sec": 59.5,
      "subtask": "Unfold the cloth",
      "candidate_labels": {
        "raw": "Fold the cloth",
        "rawprior": "Fold the cloth",
        "seed": "Unfold and adjust the cleaning cloth",
        "ffmpeg": "Unfold the cloth"
      },
      "candidate_select_source": "D",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_06.mp4"
    },
    {
      "start_sec": 59.5,
      "end_sec": 79.5,
      "subtask": "Wipe the table with the cloth",
      "candidate_labels": {
        "raw": "Wipe the table with the cloth",
        "rawprior": "Wipe the table with the cloth",
        "seed": "Wipe the top surface and front exterior of the cabinet",
        "ffmpeg": "Wipe the nightstand with a cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_07.mp4"
    },
    {
      "start_sec": 79.5,
      "end_sec": 87.5,
      "subtask": "Wipe the drawer handle with a cloth",
      "candidate_labels": {
        "raw": "Wipe the drawer with a cloth",
        "rawprior": "Wipe the drawer with a cloth",
        "seed": "Open the middle drawer of the cabinet",
        "ffmpeg": "Wipe the drawer handle with a cloth"
      },
      "candidate_select_source": "D",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_08.mp4"
    },
    {
      "start_sec": 87.5,
      "end_sec": 89.5,
      "subtask": "Wipe the table with the cloth",
      "candidate_labels": {
        "raw": "Wipe the table with the cloth",
        "rawprior": "Wipe the table with the cloth",
        "seed": "Wipe the table with the cloth",
        "ffmpeg": "Wipe the table with the cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_09.mp4"
    },
    {
      "start_sec": 89.5,
      "end_sec": 130.03,
      "subtask": "Wipe the table with the cloth",
      "candidate_labels": {
        "raw": "Wipe the table with the cloth",
        "rawprior": "Wipe the table with the cloth",
        "seed": "Wipe the top surface of the cabinet thoroughly",
        "ffmpeg": "Wipe the table with a cloth"
      },
      "candidate_select_source": "A",
      "candidate_select_meta": {
        "fps": 30.0,
        "nframes": 3901,
        "frames_per_sheet": 5,
        "image_max_side": 1120
      },
      "clip": "assets/homer4/clips/pred_10.mp4"
    }
  ]
};
  window.__COST__ = {
  "kind": "public_engineering_estimate",
  "note": "WGO raw/selector tokens are engineering estimates. API call counts are artifact-counted from report outputs. Internal machines, paths, and service-state details are intentionally omitted from the public report.",
  "eval_subset": "HomER 25 episodes",
  "sources": {
    "labels": "public report artifacts",
    "wgo_exp_usage_files": 0,
    "internal_usage_sources": "omitted"
  },
  "video": {
    "n_episodes": 25,
    "total_sec": 2402.4,
    "total_min": 40.04,
    "mean_sec": 96.1,
    "duration_source": "ffprobe_on_local_mp4",
    "per_episode_sec": {
      "homer_1": 161.2,
      "homer_10": 120.8,
      "homer_11": 131.7,
      "homer_12": 124.7,
      "homer_15": 132.3,
      "homer_2": 154.2,
      "homer_29": 84.9,
      "homer_3": 137.5,
      "homer_33": 72.2,
      "homer_37": 66.1,
      "homer_38": 90.8,
      "homer_39": 61.1,
      "homer_4": 130.0,
      "homer_40": 61.5,
      "homer_41": 54.3,
      "homer_48": 56.0,
      "homer_5": 129.5,
      "homer_50": 46.5,
      "homer_52": 38.0,
      "homer_53": 47.1,
      "homer_56": 55.2,
      "homer_59": 60.7,
      "homer_60": 71.2,
      "homer_7": 143.8,
      "homer_9": 171.1
    }
  },
  "recipe_counts": {
    "kind": "artifact_counted",
    "n_pred_segments": 308,
    "n_sheets_total": 256,
    "n_s2_windows_total": 155,
    "n_iou_match_judge": 79,
    "mean_sheets_per_ep": 10.24,
    "mean_pred_per_ep": 12.32,
    "mean_s2_windows_per_ep": 6.2
  },
  "assumptions_tokens": {
    "label_frames_per_segment": 5,
    "image_max_side": 1120,
    "candidate_paths": 4,
    "img_tokens_per_image": [
      900,
      1600
    ],
    "text_tokens_per_call": 600,
    "judge_text_tokens": 400,
    "status": "public_engineering_estimate"
  },
  "recipes": {
    "raw_only": {
      "label": "S2 边界 + 单路 raw 标注",
      "e2e_f1": 0.1414,
      "api_calls": {
        "kind": "artifact_counted",
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 308,
        "candidate_selector": 0,
        "e2e_judge_text_only": 79,
        "total": 567
      },
      "api_calls_estimate": {
        "kind": "artifact_counted",
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 308,
        "candidate_selector": 0,
        "e2e_judge_text_only": 79,
        "total": 567
      },
      "tokens": {
        "kind": "engineering_estimate",
        "total_low": 2080300,
        "total_high": 3446000,
        "per_video_minute_low": 51956,
        "per_video_minute_high": 86064
      },
      "tokens_estimate": {
        "kind": "engineering_estimate",
        "total_low": 2080300,
        "total_high": 3446000,
        "per_video_minute_low": 51956,
        "per_video_minute_high": 86064
      }
    },
    "selector": {
      "label": "S2 边界 + 4 路候选 + selector",
      "e2e_f1": 0.1542,
      "api_calls": {
        "kind": "artifact_counted",
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 1232,
        "candidate_selector": 308,
        "e2e_judge_text_only": 79,
        "total": 1799
      },
      "api_calls_estimate": {
        "kind": "artifact_counted",
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 1232,
        "candidate_selector": 308,
        "e2e_judge_text_only": 79,
        "total": 1799
      },
      "tokens": {
        "kind": "engineering_estimate",
        "total_low": 6977500,
        "total_high": 11577200,
        "per_video_minute_low": 174263,
        "per_video_minute_high": 289141
      },
      "tokens_estimate": {
        "kind": "engineering_estimate",
        "total_low": 6977500,
        "total_high": 11577200,
        "per_video_minute_low": 174263,
        "per_video_minute_high": 289141
      }
    }
  },
  "production_measured": {
    "label": "EgoANT production default path (HaWoR wrist-speed cuts + caption + merge)",
    "kind": "aggregate_estimate",
    "source": "internal aggregate, paths omitted",
    "n_episodes": 25,
    "api_calls_total": 2574,
    "prompt_tokens": 8039348,
    "completion_tokens": 823878,
    "total_tokens": 8863226,
    "per_video_minute_tokens": 221359,
    "per_episode_mean_tokens": 354529,
    "stages": {
      "caption": {
        "requests": 1882,
        "prompt_tokens": 5756442,
        "completion_tokens": 481952,
        "total_tokens": 6238394,
        "latency_sec": 12411.453
      },
      "episode_summary": {
        "requests": 25,
        "prompt_tokens": 32544,
        "completion_tokens": 369,
        "total_tokens": 32913,
        "latency_sec": 10.493
      },
      "merge_judge": {
        "requests": 299,
        "prompt_tokens": 1312672,
        "completion_tokens": 202621,
        "total_tokens": 1515293,
        "latency_sec": 2477.988
      },
      "merge_rewrite": {
        "requests": 368,
        "prompt_tokens": 937690,
        "completion_tokens": 138936,
        "total_tokens": 1076626,
        "latency_sec": 1660.459
      }
    },
    "e2e_f1_note": "production one-pass E2E≈0.0641; not the same path as WGO selector E2E 0.1542"
  },
  "default_display": "both"
};
  main();
})();
