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
        "note": "方向对，但不是最终「盖住完整动作」",
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
        "note": "当前最强分段",
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
        "name": "后处理：合并相邻「文案完全相同」段",
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
        "name": "raw 原帧（默认基线）",
        "note": "Track A",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Raw frames (default baseline)",
        "note": "Track A",
        "model": "Qwen3.5-397B"
      }
    },
    "overlay_proxy": {
      "zh": {
        "name": "optical-flow proxy overlay",
        "note": "非真 hand",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "optical-flow proxy overlay",
        "note": "Not true hand crops",
        "model": "Qwen3.5-397B"
      }
    },
    "temporal_collage": {
      "zh": {
        "name": "整帧 temporal collage（P/C/F）",
        "note": "整帧≠hand",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Whole-frame temporal collage (P/C/F)",
        "note": "Whole frame ≠ hand",
        "model": "Qwen3.5-397B"
      }
    },
    "raw_27b": {
      "zh": {
        "name": "raw + Qwen3.6-27B",
        "note": "",
        "model": "Qwen3.6-27B"
      },
      "en": {
        "name": "raw + Qwen3.6-27B",
        "note": "",
        "model": "Qwen3.6-27B"
      }
    },
    "l1_neighbor": {
      "zh": {
        "name": "邻段 contact sheet（上一/当前/下一段）",
        "note": "大跌",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Neighbor contact sheets (prev/cur/next)",
        "note": "Large drop",
        "model": "Qwen3.5-397B"
      }
    },
    "l1_ts_rerun": {
      "zh": {
        "name": "邻段 sheet + 秒级时间戳重跑",
        "note": "修时间戳仍跌",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "Neighbor sheets + second-level timestamps",
        "note": "Fixing timestamps still lowers accuracy",
        "model": "Qwen3.5-397B"
      }
    },
    "l2_yolo_proxy": {
      "zh": {
        "name": "YOLO/proxy hand-collage",
        "note": "失败线",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "YOLO/proxy hand-collage",
        "note": "Failure path",
        "model": "Qwen3.5-397B"
      }
    },
    "l2_hawor": {
      "zh": {
        "name": "HaWoR 真手部 crop",
        "note": "+0.4pp",
        "model": "Qwen3.5-397B"
      },
      "en": {
        "name": "HaWoR true hand-crop",
        "note": "+0.4pp",
        "model": "Qwen3.5-397B"
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
        "note": "锁 0.2031 边界后单路 raw；E2E 0.1388，成本远低于 selector",
        "model": null
      },
      "en": {
        "name": "+ 397B raw-only relabel",
        "note": "Same 0.2031 bounds; E2E 0.1388; cheaper than selector",
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
        "note": "同边界上多候选选优；E2E 0.1517，标注调用更多",
        "model": null
      },
      "en": {
        "name": "+ 397B multi-candidate selector",
        "note": "Same bounds; pick among candidates; E2E 0.1517; more label calls",
        "model": null
      }
    }
  };

  const METHOD_I18N = {
    egovid_baseline: { en: { goal: "Use wrist-speed valleys as automatic subtask cuts.", how: "HaWoR/wrist speed minima, short-span rules, then merge judge.", input: "video plus hand reconstruction", result: "F1 0.0953, 810 predictions vs 470 gold", verdict: "Over-fragmented heuristic baseline." } },
    cs_max3_397b: { en: { goal: "Approximate the public contact-sheet recipe with chunked sheets.", how: "Legacy prompt; at most three sheets per API call.", input: "chunked contact sheets", result: "F1 0.0952", verdict: "Artificial chunk seams become fake event boundaries." } },
    cs_max3_27b: { en: { goal: "Repeat chunked contact sheets with the smaller model.", how: "Same max_sheets=3 legacy setup.", input: "chunked contact sheets", result: "F1 0.1278", verdict: "Model size alone does not fix a flawed chunking recipe." } },
    whole_legacy_27b: { en: { goal: "Remove fake chunk seams.", how: "Send whole-episode sheets in one request with the legacy prompt.", input: "whole-episode contact sheets", result: "F1 0.1230, only 148 predictions", verdict: "Seam artifacts vanish, but the model under-segments." } },
    aligned_gepa_27b: { en: { goal: "Align the prompt with completed-event and duration-prior rules.", how: "Use a GEPA-derived rule list: completed actions, roughly 2–10 second events.", input: "whole-episode sheets plus rule list", result: "F1 0.1369", verdict: "The rule list helps, but recall remains low." } },
    s1_full25_397b: { en: { goal: "Counter under-segmentation by increasing cut density.", how: "Shorter duration prior and denser-cut instruction over all 25 HomER episodes.", input: "whole-episode sheets plus denser-cut prompt", result: "F1 0.1556, 558 predictions", verdict: "Recall improves, but over-segmentation returns." } },
    s2_full25_397b: { en: { goal: "Re-cut locally after a coarse pass.", how: "Coarse bounds to local contact-sheet windows; early setup used about one second of pad-out.", input: "local sheets plus coarse-bound hints", result: "F1 0.1674", verdict: "Right direction, but not the final full-cover recipe." } },
    s2_pad0_plain_27b: { en: { goal: "Ablate local-window padding.", how: "Local refine with pad_sec=0, before adding the full-cover instruction.", input: "local sheets", result: "F1 0.1711, 582 predictions", verdict: "No pad-out is best among pad widths, but still too fragmented." } },
    s2_pad05_27b: { en: { goal: "Test whether a little extra context helps.", how: "Local refine with 0.5 seconds of pad-out.", input: "local sheets", result: "F1 0.1444", verdict: "Worse than no pad-out." } },
    s2_pad1_27b: { en: { goal: "Test a larger local context window.", how: "Local refine with 1.0 second of pad-out.", input: "local sheets", result: "F1 0.1485", verdict: "Worse than no pad-out." } },
    s2_pad2_27b: { en: { goal: "Test an even wider local context window.", how: "Local refine with 2.0 seconds of pad-out.", input: "local sheets", result: "F1 0.1436", verdict: "Extra neighboring context lowers F1." } },
    s2_midpoint_post: { en: { goal: "Cover the time window using scripted postprocessing.", how: "Apply midpoint full-cover postprocess after pad=0 predictions.", input: "predicted boundaries", result: "F1 0.1635", verdict: "Scripted cover is worse than putting full-cover into the prompt." } },
    s2_fullcover_qwen36: { en: { goal: "Re-cut locally while covering all completed actions in the window.", how: "Coarse GEPA pass, local timestamped sheets, pad=0, and full-cover prompt.", input: "local contact sheet plus coarse-bound hint", result: "F1 0.2031, 308 predictions", verdict: "Main segmentation gain in the Qwen stack." } },
    merge_exact: { en: { goal: "Make the timeline cleaner by merging adjacent identical labels.", how: "Rule-based merge when adjacent labels are exactly identical.", input: "S2 full-cover predictions", result: "F1 0.1987", verdict: "Looks cleaner but lowers F1; do not enable by default." } },
    merge_verb: { en: { goal: "Merge adjacent segments with similar verb/object.", how: "Parse approximate verb/object matches and merge adjacent spans.", input: "S2 full-cover predictions", result: "F1 0.1947", verdict: "More aggressive merge lowers F1 further." } },
    merge_bridge: { en: { goal: "Bridge short gaps between likely-similar spans.", how: "Allow short temporal gaps before merging.", input: "S2 full-cover predictions", result: "F1 0.1883", verdict: "Largest drop among merge rules." } },
    raw_397b: { en: { goal: "Evaluate label quality with fixed gold boundaries.", how: "Uniformly sample about five raw frames per segment, caption with 397B, and judge separately.", input: "raw frames", result: "Accuracy 50.6%", verdict: "Most stable default labeling input." } },
    overlay_proxy: { en: { goal: "Show the model an approximate hand location.", how: "Use optical-flow centroid proxy overlay because true hand reconstruction was not available for this ablation.", input: "proxy overlay frames", result: "Accuracy 48.3%", verdict: "Hurts score; do not present it as true hand overlay." } },
    temporal_collage: { en: { goal: "Add whole-frame past/current/future context.", how: "Create separate full-frame grids from past, current, and future windows.", input: "whole-frame collage", result: "Accuracy 42.1%", verdict: "Context noise outweighs the benefit." } },
    raw_27b: { en: { goal: "Test whether the smaller model can label fixed segments.", how: "Same raw-frame input as the default labeler, but with Qwen3.6-27B.", input: "raw frames", result: "Accuracy 46.0%", verdict: "Labeling still benefits from the larger model." } },
    l1_neighbor: { en: { goal: "Use previous/current/next segment context.", how: "Feed PREV/CUR/NEXT contact sheets together to the labeler.", input: "neighbor contact sheets", result: "Accuracy 36.8%", verdict: "The model loses track of which action is current." } },
    l1_ts_rerun: { en: { goal: "Check whether missing timestamps caused the neighbor-sheet drop.", how: "Re-run neighbor sheets after adding second-level yellow timestamps.", input: "timestamped neighbor sheets", result: "Accuracy 35.5%", verdict: "The input design lowers accuracy; timestamps were not the issue." } },
    l2_yolo_proxy: { en: { goal: "Focus visual attention on hand-object regions.", how: "Use YOLO/person or center-proxy crops because HomER has no native hand asset in this benchmark.", input: "approximate hand collage", result: "Accuracy 40.6%", verdict: "Approximate crops hurt and are not true hand crops." } },
    l2_hawor: { en: { goal: "Use real wrist tracks for hand crops.", how: "Run HaWoR, build wrist tracks, and crop around hand points; 411/470 segments had full crop coverage.", input: "true hand crops plus raw fallback", result: "Accuracy 51.1%", verdict: "Small positive gain, but expensive; use when reliable hand assets exist." } },
    l4_strict_judge: { en: { goal: "Measure sensitivity to judge strictness.", how: "Re-score the same raw predictions with a stricter semantic rubric.", input: "unchanged predicted captions", result: "Accuracy 43.0%", verdict: "Reports must keep the judge fixed." } },
    l2_proxy_27b: { en: { goal: "Combine small model and approximate hand collage.", how: "Same proxy-crop input, but with Qwen3.6-27B.", input: "approximate hand collage", result: "Accuracy 31.7%", verdict: "Both the input and the smaller labeler hurt." } },
    egovid_e2e: { en: { goal: "Measure the original one-pass cut-and-label path.", how: "Rule-based wrist cuts followed by per-segment captions.", input: "production-style baseline output", result: "E2E F1 0.0656", verdict: "Weak end-to-end baseline under the WGO protocol." } },
    s2_self: { en: { goal: "Keep the best boundaries but let the segmentation model self-label.", how: "Use S2 full-cover boundaries and Qwen3.6-27B labels.", input: "S2 predicted segments", result: "E2E F1 0.1017", verdict: "Better boundaries alone are not enough; labels remain weak." } },
    raw397: { en: { goal: "Lock boundaries and upgrade the labeler.", how: "Use the same S2 boundaries, then let 397B caption raw frames.", input: "raw frames within S2 segments", result: "E2E F1 0.1388", verdict: "Most gain comes from the larger labeler." } },
    ffmpeg397: { en: { goal: "Test sensitivity to decode and sampling path.", how: "Use ffmpeg-based frame extraction with the same S2 boundaries and 397B labeler.", input: "ffmpeg-sampled raw frames", result: "E2E F1 0.1414", verdict: "Slightly better than the default raw path; useful as a candidate." } },
    nb28: { en: { goal: "Try neighbor context with a small-model prior.", how: "Feed previous/current/next frames plus a Qwen3.6-27B prior.", input: "neighbor frames plus prior", result: "E2E F1 0.1080", verdict: "Context pollution lowers semantic accuracy while boundaries stay fixed." } },
    nb397: { en: { goal: "Try neighbor context with a stronger raw prior.", how: "Feed previous/current/next frames plus a 397B raw prior.", input: "neighbor frames plus prior", result: "E2E F1 0.1440", verdict: "Better than the 27B-prior neighbor path, still below selector." } },
    selector397: { en: { goal: "Select among multiple candidate labels for the same boundary.", how: "Generate candidates from raw, ffmpeg, seed, and prior variants, then let 397B select the final label.", input: "candidate labels for S2 segments", result: "E2E F1 0.1517", verdict: "Best current end-to-end result; higher call count." } }
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
    renderBars(document.querySelector("#label-bars"), data.labeling.filter((r) => r.id !== "l2_proxy_27b"), "acc", 0.55, true);
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
      renderBars(document.querySelector("#label-bars"), D.data.labeling.filter((r) => r.id !== "l2_proxy_27b"), "acc", 0.55, true);
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
    "title": "EgoANT × WGO-Bench HomER 标注消融长报告",
    "eval_subset": "HomER 25 episodes / 470 gold segments",
    "metric_seg": "Segment F1@0.75 micro + outer snap",
    "metric_label": "LLM-judge accuracy on gold boundaries",
    "metric_e2e": "Semantic E2E F1 (IoU match then judge)",
    "model_note": "文中「Qwen3.6-27B」与日志里的 28B endpoint 指同一小模型服务；大模型统一写 Qwen3.5-397B。",
    "blog_refs": {
      "full100_seg_f1": 0.306,
      "full100_label_acc": 0.61,
      "full100_e2e_f1": 0.168,
      "homer_only_gemini_seg_f1": 0.227,
      "same_recipe_non_gemini_seg": "0.11-0.14"
    },
    "best": {
      "seg_f1": 0.2031,
      "seg_config": "Qwen3.6-27B · S2 pad=0 + full-cover local prompt · contact sheet",
      "label_acc": 0.511,
      "label_config": "Qwen3.5-397B · HaWoR true hand-crop（raw 50.6%）",
      "e2e_f1": 0.1517,
      "e2e_config": "锁 S2 full-cover 边界 + Qwen3.5-397B candidate selector"
    },
    "generated_note": "分数对齐 V5.1 / wgo_bench_v5_1_results；HomER-only 除非注明。"
  },
  "glossary": [
    {
      "term": "contact sheet",
      "def": "按固定间隔抽帧拼成的时间戳联系表，用于分段；默认 0.5s×约20格≈10s 窗。"
    },
    {
      "term": "整帧 temporal collage",
      "def": "把 past/current/future 的整帧格子拼在一起给标注模型；≠ contact sheet。"
    },
    {
      "term": "L1 邻段 contact sheet",
      "def": "把上一/当前/下一子任务的 sheet 一起喂给标注模型。"
    },
    {
      "term": "L2 YOLO/proxy hand-collage",
      "def": "HomER 无 hand asset 时用 YOLO 腕点或画面中心 proxy 裁手部拼图；失败线。"
    },
    {
      "term": "HaWoR true hand-crop",
      "def": "先跑 HaWoR 得 wrist track，再按手部点裁剪；固定边界标注微涨线。"
    },
    {
      "term": "optical-flow proxy overlay",
      "def": "用光流质心近似手部叠图；不是真 hand overlay。"
    },
    {
      "term": "GEPA",
      "def": "Macrodata 用自动搜索得到的英文分段 prompt 规则集（不是新模型）；推理时只是把这些规则贴进请求。"
    },
    {
      "term": "S1 反欠分割",
      "def": "提高切段密度以抬召回；易过分割。"
    },
    {
      "term": "S2 pad=0 + full-cover local prompt",
      "def": "粗分后再对局部时间窗口精修；pad=0 表示不外扩；full-cover 要求盖住该时间窗口内完成事件。"
    },
    {
      "term": "candidate selector",
      "def": "对同一边界生成多条候选标签，再由大模型选一条定稿。"
    },
    {
      "term": "Qwen3.6-27B",
      "def": "分段主模型；日志里有时写作 28B endpoint，本文统一 27B。"
    },
    {
      "term": "Qwen3.5-397B",
      "def": "标注 / judge / selector 用的大模型。"
    },
    {
      "term": "HomER 25 / 470",
      "def": "本报告评测子集：25 集第一视角 episode、470 个 gold 段。"
    }
  ],
  "segmentation": [
    {
      "id": "egovid_baseline",
      "name": "EgoANT 原管线：rule-based 腕速切段 + merge",
      "f1": 0.0953,
      "p": null,
      "r": null,
      "match": 61,
      "pred": 810,
      "gold": 470,
      "model": "rule-based（腕速 minima + merge）",
      "full25": true,
      "note": "过分割：预测段远多于 gold",
      "method": {
        "goal": "用手腕速度谷值自动切子任务",
        "how": "HaWoR/腕速找 minima → 短段策略 → merge judge",
        "input": "视频 + hand recon",
        "result": "F1 0.0953，pred 810（远超 470）",
        "verdict": "启发式过碎，作基线"
      }
    },
    {
      "id": "cs_max3_397b",
      "name": "Contact sheet 分片（max_sheets=3，每次最多 3 张）",
      "f1": 0.0952,
      "p": 0.132,
      "r": 0.075,
      "match": 35,
      "pred": 265,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "分片接缝处出现假边界",
      "method": {
        "goal": "模仿 blog：把长视频切成多张 sheet 分次送模型",
        "how": "legacy prompt；每集最多 3 张 sheet，分次 API",
        "input": "contact sheet（分片）",
        "result": "F1 0.0952",
        "verdict": "人工切窗边界被当成事件边界"
      }
    },
    {
      "id": "cs_max3_27b",
      "name": "Contact sheet 分片（max_sheets=3）",
      "f1": 0.1278,
      "p": 0.171,
      "r": 0.102,
      "match": 48,
      "pred": 281,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "同设置下小模型优于大模型分片版",
      "method": {
        "goal": "同上，换小模型",
        "how": "同 max3 + legacy",
        "input": "contact sheet（分片）",
        "result": "F1 0.1278",
        "verdict": "更大模型≠自动更好；分片 recipe 本身有毒"
      }
    },
    {
      "id": "whole_legacy_27b",
      "name": "整集一次 + legacy prompt（无 GEPA-searched 规则）",
      "f1": 0.123,
      "p": 0.257,
      "r": 0.081,
      "match": 38,
      "pred": 148,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "欠分割：预测段过少",
      "method": {
        "goal": "去掉分片接缝",
        "how": "max_sheets=0，整集 sheet 一次作为视觉输入提交给 API",
        "input": "整集 contact sheet",
        "result": "F1 0.123，pred 仅 148",
        "verdict": "假切点没了，但切太少"
      }
    },
    {
      "id": "aligned_gepa_27b",
      "name": "整集一次 + GEPA-searched 规则 prompt",
      "f1": 0.1369,
      "p": 0.228,
      "r": 0.098,
      "match": 46,
      "pred": 202,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "仍欠分割，但比 legacy 略好",
      "method": {
        "goal": "用 completed-events + 时长先验对齐 blog 规则",
        "how": "GEPA-searched prompt：只标完成操作；偏好约 2–10s 段",
        "input": "整集 contact sheet + GEPA",
        "result": "F1 0.1369",
        "verdict": "外形对齐有效，但仍欠分割"
      }
    },
    {
      "id": "s1_full25_397b",
      "name": "S1：反欠分割（提高切段密度）",
      "f1": 0.1556,
      "p": 0.143,
      "r": 0.17,
      "match": 80,
      "pred": 558,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "召回上升，但又切得过碎",
      "method": {
        "goal": "纠正 GEPA 后切太少",
        "how": "改 duration prior / 提高切段密度；全量 25 集",
        "input": "整集 sheet + 反欠分割 prompt",
        "result": "F1 0.1556，pred 558",
        "verdict": "召回上来，过分割回来"
      }
    },
    {
      "id": "s2_full25_397b",
      "name": "S2 早期精修（pad≈1，无 full-cover）",
      "f1": 0.1674,
      "p": 0.163,
      "r": 0.172,
      "match": 81,
      "pred": 498,
      "gold": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "note": "早期二次精修，尚未用 full-cover",
      "method": {
        "goal": "粗分后再局部细切",
        "how": "粗边界 → 局部时间窗口 contact sheet → 二次精修；early 配置 pad≈1.0",
        "input": "局部 sheet + 粗段 hint",
        "result": "F1 0.1674",
        "verdict": "方向对，但不是最终 full-cover"
      }
    },
    {
      "id": "s2_pad0_plain_27b",
      "name": "S2 精修 pad=0（尚无 full-cover）",
      "f1": 0.1711,
      "p": 0.1546,
      "r": 0.1915,
      "match": 90,
      "pred": 582,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "pad=0 较好，但仍偏碎",
      "method": {
        "goal": "消融 pad 宽度",
        "how": "局部精修，pad_sec=0，未加 full-cover 覆盖约束",
        "input": "局部 sheet",
        "result": "F1 0.1711，pred 582",
        "verdict": "pad=0 优于 pad=0.5/1/2，但仍过碎"
      }
    },
    {
      "id": "s2_pad05_27b",
      "name": "S2 精修 pad=0.5（时间窗口外扩）",
      "f1": 0.1444,
      "p": 0.1266,
      "r": 0.1681,
      "match": 79,
      "pred": 624,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "把时间窗口外扩 0.5s，不如 pad=0",
      "method": {
        "goal": "给局部时间窗口前后多看一点",
        "how": "pad_sec=0.5",
        "input": "局部 sheet",
        "result": "F1 0.1444",
        "verdict": "不如 pad=0"
      }
    },
    {
      "id": "s2_pad1_27b",
      "name": "S2 精修 pad=1.0",
      "f1": 0.1485,
      "p": 0.1259,
      "r": 0.1809,
      "match": 85,
      "pred": 675,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "外扩 1s，不如 pad=0",
      "method": {
        "goal": "同上",
        "how": "pad_sec=1.0",
        "input": "局部 sheet",
        "result": "F1 0.1485",
        "verdict": "不如 pad=0"
      }
    },
    {
      "id": "s2_pad2_27b",
      "name": "S2 精修 pad=2.0",
      "f1": 0.1436,
      "p": 0.122,
      "r": 0.1745,
      "match": 82,
      "pred": 672,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "外扩 2s，不如 pad=0",
      "method": {
        "goal": "同上",
        "how": "pad_sec=2.0",
        "input": "局部 sheet",
        "result": "F1 0.1436",
        "verdict": "不如 pad=0"
      }
    },
    {
      "id": "s2_midpoint_post",
      "name": "S2 pad=0 + midpoint full-cover 后处理（非 prompt）",
      "f1": 0.1635,
      "p": 0.1478,
      "r": 0.183,
      "match": 86,
      "pred": 582,
      "gold": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "note": "用算法补覆盖 ≠ 写进 prompt 的 full-cover",
      "method": {
        "goal": "用算法把预测盖满时间轴",
        "how": "pad=0 预测后再做 midpoint full-cover postprocess",
        "input": "预测边界",
        "result": "F1 0.1635",
        "verdict": "不如把 full-cover 写进 local prompt"
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
      "note": "当前最强分段",
      "method": {
        "goal": "局部时间窗口内重切，并要求盖满该时间窗口、保持任务粒度",
        "how": "粗分 GEPA → 滑动时间窗口/覆盖时间窗口 sheet（0.5s×20）→ pad=0 + full-cover prompt 只重切该时间窗口",
        "input": "局部 timestamped contact sheet + 粗段 hint",
        "result": "F1 0.2031，pred 308，P↑",
        "verdict": "Qwen 栈主升力；勿与 early S2 0.1674 混称"
      }
    },
    {
      "id": "merge_exact",
      "name": "后处理：在 0.2031 上合并相邻「文案完全相同」段",
      "f1": 0.1987,
      "p": null,
      "r": null,
      "match": 77,
      "pred": 305,
      "gold": 470,
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "合并后 F1 下降",
      "method": {
        "goal": "合并相邻同文案碎片，让时间轴更干净",
        "how": "相邻且 label 完全相同则合并",
        "input": "S2 full-cover 预测",
        "result": "F1 0.1987",
        "verdict": "时间轴更整洁但 F1 降低；不要默认 merge"
      }
    },
    {
      "id": "merge_verb",
      "name": "后处理：在 0.2031 上按动词/物体合并相邻段",
      "f1": 0.1947,
      "p": null,
      "r": null,
      "match": 74,
      "pred": 290,
      "gold": 470,
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "更激进合并，F1 再降",
      "method": {
        "goal": "同动词/物体就合并",
        "how": "解析 verb/object 近似匹配后合并",
        "input": "S2 full-cover 预测",
        "result": "F1 0.1947",
        "verdict": "继续降低 F1"
      }
    },
    {
      "id": "merge_bridge",
      "name": "后处理：在 0.2031 上跨短间隙桥接合并",
      "f1": 0.1883,
      "p": null,
      "r": null,
      "match": 69,
      "pred": 263,
      "gold": 470,
      "model": "规则后处理（非 LLM）",
      "full25": true,
      "note": "跨短间隙合并，F1 降低最多",
      "method": {
        "goal": "短间隙也桥接合并",
        "how": "允许短时间桥接后合并",
        "input": "S2 full-cover 预测",
        "result": "F1 0.1883",
        "verdict": "F1 降低最多"
      }
    }
  ],
  "labeling": [
    {
      "id": "raw_397b",
      "name": "raw 原帧（默认基线）",
      "acc": 0.506,
      "n_match": 238,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": 0.0,
      "note": "Track A",
      "method": {
        "goal": "给定 gold 边界，只评句子",
        "how": "段内均匀抽约 5 帧原图 → 397B caption → 另一次 397B judge",
        "input": "raw frames",
        "result": "50.6%",
        "verdict": "生产默认最稳"
      }
    },
    {
      "id": "overlay_proxy",
      "name": "optical-flow proxy overlay",
      "acc": 0.483,
      "n_match": 227,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": -0.023,
      "note": "非真 hand",
      "method": {
        "goal": "把「手在哪」叠到画面上帮模型",
        "how": "HomER 无 hand_recon，用光流质心画 proxy overlay",
        "input": "overlay frames",
        "result": "48.3%",
        "verdict": "得分下降；不能等同于真实 hand-crop"
      }
    },
    {
      "id": "temporal_collage",
      "name": "整帧 temporal collage（P/C/F）",
      "acc": 0.421,
      "n_match": 198,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": -0.085,
      "note": "整帧≠hand",
      "method": {
        "goal": "给前后文整帧上下文",
        "how": "past/current/future 各约 6 格整帧拼图，再 caption",
        "input": "整帧 collage",
        "result": "42.1%",
        "verdict": "上下文噪音大，准确率下降"
      }
    },
    {
      "id": "raw_27b",
      "name": "raw + Qwen3.6-27B",
      "acc": 0.46,
      "n_match": 216,
      "n": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "delta_vs_raw": -0.046,
      "note": "",
      "method": {
        "goal": "小模型能否扛标注",
        "how": "同 raw 抽帧，换 27B",
        "input": "raw",
        "result": "46.0%",
        "verdict": "标注仍需大模型"
      }
    },
    {
      "id": "l1_neighbor",
      "name": "L1 邻段 contact sheet",
      "acc": 0.368,
      "n_match": 173,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": -0.138,
      "note": "大跌",
      "method": {
        "goal": "对齐 WGO：看上一/当前/下一段",
        "how": "PREV/CUR/NEXT 三段 sheet 一并送 labeler",
        "input": "邻段 contact sheet",
        "result": "36.8%",
        "verdict": "模型搞不清「当前」是哪一步"
      }
    },
    {
      "id": "l1_ts_rerun",
      "name": "L1 + 秒级时间戳重跑",
      "acc": 0.355,
      "n_match": 167,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": -0.151,
      "note": "修时间戳仍跌",
      "method": {
        "goal": "检查准确率下降是否由 tile 缺少秒戳导致",
        "how": "补黄字秒级时间戳后全量重跑",
        "input": "邻段 sheet（有戳）",
        "result": "35.5%",
        "verdict": "不是缺戳的问题，这个视觉输入设计本身降低了标注准确率"
      }
    },
    {
      "id": "l2_yolo_proxy",
      "name": "L2 YOLO/proxy hand-collage",
      "acc": 0.406,
      "n_match": 191,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": -0.1,
      "note": "失败线",
      "method": {
        "goal": "聚焦手部区域像 Scale/blog",
        "how": "HomER 无 hand asset：用 YOLO 人/腕点或 center-proxy 裁剪拼 collage（非 HaWoR）",
        "input": "hand-collage approx",
        "result": "40.6%",
        "verdict": "近似 crop 使得分下降；≠ true hand-crop"
      },
      "figure": "assets/demos/demo_handcrop_homer7_yolo_t1.jpg"
    },
    {
      "id": "l2_hawor",
      "name": "HaWoR true hand-crop",
      "acc": 0.511,
      "n_match": 240,
      "n": 470,
      "model": "Qwen3.5-397B",
      "full25": true,
      "delta_vs_raw": 0.005,
      "note": "+0.4pp",
      "method": {
        "goal": "真手腕 track 后再 crop",
        "how": "HaWoR → wrist track → 按手点裁；411/470 段 5/5 有效 crop",
        "input": "true hand-crop (+raw)",
        "result": "51.1%",
        "verdict": "有正向但成本高；有 asset 才作候选"
      },
      "figure": "assets/homer1/homer1_handcrop_sheet_84_94.jpg"
    },
    {
      "id": "l4_strict_judge",
      "name": "L4 严 judge 重判 raw",
      "acc": 0.43,
      "n_match": 202,
      "n": 470,
      "model": "Qwen3.5-397B judge",
      "full25": true,
      "delta_vs_raw": -0.076,
      "note": "尺子变了",
      "method": {
        "goal": "更严语义等价标准",
        "how": "同一批 raw 预测，只换 judge rubric 重判",
        "input": "不变的 pred captions",
        "result": "43.0%",
        "verdict": "汇报时必须固定 judge"
      }
    },
    {
      "id": "l2_proxy_27b",
      "name": "L2 YOLO/proxy hand-collage · 27B",
      "acc": 0.317,
      "n_match": 149,
      "n": 470,
      "model": "Qwen3.6-27B",
      "full25": true,
      "delta_vs_raw": null,
      "note": "更差",
      "method": {
        "goal": "小模型 + 糙 hand collage",
        "how": "同 L2 近似 collage，换 27B",
        "input": "hand-collage approx",
        "result": "31.7%",
        "verdict": "双重减分"
      }
    }
  ],
  "e2e": [
    {
      "id": "egovid_e2e",
      "name": "EgoANT one-pass",
      "seg_f1": 0.0953,
      "e2e_f1": 0.0656,
      "pred_gold": "810/470",
      "note": "切+标一体弱",
      "method": {
        "goal": "原管线端到端",
        "how": "腕速切 + 段内 caption",
        "result": "E2E 0.0656",
        "verdict": "基线"
      }
    },
    {
      "id": "s2_self",
      "name": "S2 full-cover + 自标",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1054,
      "pred_gold": "308/470",
      "note": "边界已锁",
      "method": {
        "goal": "边界用最强分段，标注仍用分段模型",
        "how": "锁 Seg=0.2031，27B 自写 subtask",
        "result": "E2E 0.1054",
        "verdict": "边界好了，句子仍弱"
      }
    },
    {
      "id": "raw397",
      "name": "+ 397B raw relabel",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1388,
      "pred_gold": "308/470",
      "note": "锁 0.2031 边界后单路 raw；E2E 0.1388，成本远低于 selector",
      "method": {
        "goal": "锁边界换大模型标",
        "how": "同一批 S2 边界，397B 看 raw 帧重写标签",
        "result": "E2E 0.1388",
        "verdict": "主涨分来自换大模型"
      }
    },
    {
      "id": "ffmpeg397",
      "name": "+ 397B ffmpeg raw relabel",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1414,
      "pred_gold": "308/470",
      "note": "抽帧路径变体",
      "method": {
        "goal": "换解码/抽帧路径是否改变标注",
        "how": "ffmpeg 抽帧替代默认读帧，再 397B caption",
        "result": "E2E 0.1414",
        "verdict": "略好于默认 raw，作候选源"
      }
    },
    {
      "id": "nb28",
      "name": "+ 27B-prior neighbor relabel",
      "seg_f1": 0.2031,
      "e2e_f1": 0.108,
      "pred_gold": "308/470",
      "note": "得分下降",
      "method": {
        "goal": "邻段（上一/当前/下一段）上下文 + 小模型 prior",
        "how": "PREV/CUR/NEXT≤5 帧 + seed prior，再标当前段",
        "result": "E2E 0.1080",
        "verdict": "邻段（上一/当前/下一段）上下文在 Qwen 上易引入邻段上下文干扰"
      }
    },
    {
      "id": "nb397",
      "name": "+ raw397-prior neighbor relabel",
      "seg_f1": 0.2031,
      "e2e_f1": 0.144,
      "pred_gold": "308/470",
      "note": "",
      "method": {
        "goal": "邻段 + 大模型 prior",
        "how": "同上，prior 来自 397B raw",
        "result": "E2E 0.1440",
        "verdict": "可用作候选，仍低于 selector"
      }
    },
    {
      "id": "selector397",
      "name": "+ 397B candidate selector",
      "seg_f1": 0.2031,
      "e2e_f1": 0.1517,
      "pred_gold": "308/470",
      "note": "同边界上多候选选优；E2E 0.1517，标注调用更多",
      "method": {
        "goal": "多候选选优",
        "how": "对每段收集 raw / rawprior / seed / ffmpeg 等候选，397B selector 选一条",
        "result": "E2E 0.1517（semantic 59）",
        "verdict": "生产 E2E 推荐配置"
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
    "note_zh": "本集分数；全集 HomER micro E2E F1 = 0.1517",
    "note_en": "Episode score; HomER micro E2E F1 = 0.1517 overall"
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
  "kind": "estimate",
  "note": "Engineering estimate (not billing). Two recipes share the same S2 segmentation; they differ in labeling fan-out.",
  "eval_subset": "HomER 25 episodes",
  "video": {
    "n_episodes": 25,
    "total_sec": 2402.4,
    "total_min": 40.04,
    "mean_sec": 96.1,
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
    "n_pred_segments": 308,
    "n_sheets_total": 256,
    "n_s2_windows_total": 155,
    "mean_sheets_per_ep": 10.24,
    "mean_pred_per_ep": 12.32,
    "mean_s2_windows_per_ep": 6.2
  },
  "api_calls_estimate": {
    "segmentation_whole_episode": 25,
    "segmentation_s2_refine": 155,
    "labeling": 1232,
    "candidate_selector": 308,
    "e2e_judge_text_only": 79,
    "total": 1799
  },
  "tokens_estimate": {
    "total_low": 6977500,
    "total_high": 11577200,
    "per_video_minute_low": 174263,
    "per_video_minute_high": 289141,
    "per_episode_mean_low": 279100,
    "per_episode_mean_high": 463088,
    "segmentation_low": 477900,
    "segmentation_high": 765600,
    "labeling_low": 6468000,
    "labeling_high": 10780000,
    "judge": 31600
  },
  "assumptions": {
    "sample_interval_sec": 0.5,
    "frames_per_sheet": 20,
    "label_frames_per_segment": 5,
    "candidate_paths": 4,
    "img_tokens_per_image": [
      900,
      1600
    ],
    "text_tokens_per_call": 600
  },
  "recipes": {
    "raw_only": {
      "label": "生产简化：S2 边界 + 单路 raw 标注",
      "e2e_f1": 0.1388,
      "api_calls_estimate": {
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 308,
        "candidate_selector": 0,
        "e2e_judge_text_only": 79,
        "total": 567
      },
      "tokens_estimate": {
        "total_low": 2080300,
        "total_high": 3446000,
        "per_video_minute_low": 51956,
        "per_video_minute_high": 86064,
        "per_episode_mean_low": 83212,
        "per_episode_mean_high": 137840,
        "segmentation_low": 477900,
        "segmentation_high": 765600,
        "labeling_low": 1570800,
        "labeling_high": 2648800,
        "judge": 31600
      }
    },
    "selector": {
      "label": "最强：S2 边界 + 4 路候选 + selector",
      "e2e_f1": 0.1517,
      "api_calls_estimate": {
        "segmentation_whole_episode": 25,
        "segmentation_s2_refine": 155,
        "labeling": 1232,
        "candidate_selector": 308,
        "e2e_judge_text_only": 79,
        "total": 1799
      },
      "tokens_estimate": {
        "total_low": 6977500,
        "total_high": 11577200,
        "per_video_minute_low": 174263,
        "per_video_minute_high": 289141,
        "per_episode_mean_low": 279100,
        "per_episode_mean_high": 463088,
        "segmentation_low": 477900,
        "segmentation_high": 765600,
        "labeling_low": 6468000,
        "labeling_high": 10780000,
        "judge": 31600
      }
    }
  },
  "default_display": "both"
};
  main();
})();
