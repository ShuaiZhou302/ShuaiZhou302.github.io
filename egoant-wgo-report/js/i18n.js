/* EgoANT report i18n — splash / demos / narrative sections */
(function () {
  const I18N = {
    zh: {
      "nav.intro": "导读",
      "nav.tldr": "结论速览",
      "nav.world": "背景",
      "nav.metrics": "评测",
      "nav.contact": "Contact sheet",
      "nav.walk": "样例",
      "nav.cost": "成本",
      "nav.story": "消融",
      "nav.recipe": "推荐配置",
      "nav.appendix": "附录",
      "nav.references": "参考文献",
      "toc.label": "目录",
      "tag.ego": "第一视角",
      "tag.human": "人手数据",
      "tag.subtask": "子任务",
      "tag.wgo": "WGO-Bench",
      "tag.egoant": "EgoANT",
      "hero.link.blog": "Macrodata blog",
      "hero.link.app": "附录细节",
      "hero.eyebrow": "WGO-Bench HomER · EgoANT",
      "hero.lede": "EgoANT 是一套面向第一视角人类操作视频的自动标注管线，用于将长视频划分为动作级片段，并为每个片段生成简洁的操作描述。在 WGO-Bench HomER 的 25 个视频 / 470 个参考片段上，最佳分段配置取得 Segment F1 0.2031；在固定该预测边界后，多候选标注与选择方案取得 Semantic E2E F1 0.1542。",
      "en.banner": "",
      "intro.h2": "导读：第一视角操作视频的子任务分段与语义标注",
      "intro.p1": "为将第一视角人类操作视频转化为结构化训练数据，我们需要识别其中的动作级时间片段，并为每个片段生成简洁的语义描述。这类视频通常包含相机运动、手部遮挡和连续的细粒度操作。",
      "intro.p2": "动作边界与语义描述可用于 VLA 预训练、层级技能学习和奖励模型构建。人工逐小时标注难以覆盖大规模视频，因此需要可审计的自动标注管线。",
      "intro.h3": "相关数据集与标注方法",
      "intro.li0": "Egocentric 数据集如 <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">EgoVerse</a>、<a href=\"https://github.com/apple/ml-egodex\" target=\"_blank\" rel=\"noopener\">EgoDex</a> 和 <a href=\"https://arxiv.org/abs/2604.23570\" target=\"_blank\" rel=\"noopener\">EgoLive</a> 提供大规模第一人称人手操作视频；本报告关注如何为这类视频生成时间边界和短操作描述。",
      "intro.li1": "HomER 是 <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a> 中的第一视角人类操作子集；本文的评测范围为 HomER 的 25 个视频和 470 个参考片段。",
      "intro.li2": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a> 将单目第一视角视频处理为三维手部与相机运动、原子动作片段和语言指令。EgoANT 的生产管线借鉴 motion-first decomposition，但使用独立的 HaWoR 腕部运动信号进行分段，并未运行 VITRA 模型。",
      "intro.li3": "WGO-Bench 与 <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata 博客</a> 提供公开的分段、固定边界标注和端到端评测协议，以及 Gemini 参考结果和成本口径。",
      "intro.li4": "Scale Labs dense video captioning 讨论已切分 clip 的稠密描述；本文关注从长视频 episode 中同时预测时间边界和语义标签。",
      "intro.p3": "本页报告 EgoANT 在 HomER 上的评测协议、方法设计、主要组件比较、失败模式和成本分析。",
      "intro.scope": "评测范围：本页分数与推荐配置均锚定 HomER 的 25 个视频 / 470 个参考片段。HomER 同时用于方法开发和最终报告，因此本文应视为 HomER development study，而不是独立 held-out benchmark 结论。WGO-Bench 中 robot 视角子集及其他 egocentric 数据集上的同协议结果留待后续扩展。",
      "tldr.h2": "结论速览",
      "tldr.seg": "整集粗分 + 局部再切（窗口不外扩、盖住完整动作）· Qwen3.6-27B",
      "tldr.label": "raw 27B：固定参考边界下的最高 Label Acc",
      "tldr.e2e": "S2 预测边界 + 397B 多候选 selector",
      "cost.h2": "5. 开销对照：Macrodata 公开数字 vs EgoANT",
      "cost.note": "两种 WGO 路径共用同一套 S2 分段（Seg F1=0.2031），只改标注调用。API 次数由公开报告产物结构计数；token 为工程估计。Macrodata 报的是 Gemini batch 美元价；本页给出 Qwen 栈的结构化估计，二者不是同模型账单。细节见附录 G。",
      "cost.compare.h3": "与 Macrodata 公开开销对照",
      "cost.th.source": "来源",
      "cost.th.scope": "口径",
      "cost.th.num": "数字",
      "cost.row.md_e2e": "Macrodata 公开",
      "cost.row.md_e2e_scope": "E2E seeded relabel（batch）",
      "cost.row.md_e2e_num": "~$2.64 / 视频小时；segmentation-only batch ~$0.43/h",
      "cost.row.md_cs": "Macrodata 公开",
      "cost.row.md_cs_scope": "contact sheet vs 逐帧输入",
      "cost.row.md_cs_num": "约 12× 更便宜（文中有 token/价格示意）",
      "cost.row.wgo": "EgoANT（本页 WGO）",
      "cost.row.wgo_scope": "raw / selector 工程估计 + 产物 API 次数",
      "cost.row.wgo_num": "见下表；非 Gemini 账单",
      "cost.row.prod": "EgoANT 生产管线",
      "cost.row.prod_scope": "同一 HomER 子集上的内部工程估计",
      "cost.row.prod_num": "仅保留聚合调用量级；不公开内部机器、路径或服务状态",
      "cost.recipe.h3": "WGO 两条标注路径（估计 tokens）",
      "cost.th.item": "项",
      "cost.th.raw": "单路 raw（E2E 0.1414）",
      "cost.th.sel": "候选+selector（E2E 0.1542）",
      "cost.dyn.summary": "HomER {n} 集合计 {min} 分钟（均长约 {mean}s）。WGO token 为工程估计；API 次数为产物计数。{extra}",
      "cost.dyn.extra": "",
      "cost.dyn.prod_h3": "生产管线：聚合成本说明",
      "cost.dyn.prod_p": "该路径与 contact-sheet selector 路径不同；公开页只保留聚合口径。",
      "cost.dyn.api": "API 请求",
      "cost.dyn.prompt": "prompt tokens",
      "cost.dyn.completion": "completion tokens",
      "cost.dyn.total": "total tokens",
      "cost.dyn.per_min": "tokens / 视频分钟",
      "cost.dyn.measured": "实测值",
      "cost.dyn.stage": "阶段",
      "cost.dyn.reqs": "请求数",
      "cost.row.dur": "视频总时长（ffprobe）",
      "cost.row.pred": "预测段数（产物计数）",
      "cost.row.s2": "S2 局部时间窗口（产物计数）",
      "cost.row.label_api": "标注相关 API（产物计数）",
      "cost.row.api_tot": "API 总计（产物计数）",
      "cost.row.tok": "Tokens 总量（工程估计）",
      "cost.row.tok_min": "Tokens / 视频分钟（工程估计）",
      "cost.row.e2e": "E2E F1",
      "app.cost.h3": "G. 成本：估计与 Macrodata 对照",
      "app.cost.md": "Macrodata 公开 E2E（seeded relabel）batch 约 $2.64/视频小时，segmentation-only batch 约 $0.43/h；contact sheet 相对逐帧约 12× 更便宜。原文无 HomER-25 总 token 账单。",
      "splash.link.demos": "视频",
      "splash.link.blog": "报告",
      "splash.cta": "进入报告",
      "demos.h2": "Egocentric human subtasks",
      "demos.lede": "HomER 25 集各取一段第一人称人手动作（5×5）；字幕为自动标注短指令示意。",
      "load.error": "无法加载数据文件。请在本报告目录启动静态服务器后打开（例如 <code>python3 serve_report.py --port 8765</code>；需支持 HTTP Range 才能跳播视频片段），不要直接用受限的 <code>file://</code>。",
      "world.h2": "1. 术语、数据集与实验设置",
      "world.h3.md": "WGO-Bench 与 Macrodata 公开协议",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata · Annotating Robot Video Subtasks</a> 将“长视频 → 动作级片段 + 短语义描述”定义为公开评测问题：发布 <strong>WGO-Bench</strong>、三类指标（分段 / 固定边界标注 / 端到端）以及 Gemini 参考结果。本报告在相同指标框架下评测 <strong>EgoANT</strong> 的若干配置。",
      "world.h3.ego": "Egocentric 数据与 HomER 子集",
      "world.p.ego": "EgoVerse、EgoDex、EgoLive 等第一人称人手数据集提供长程人类操作视频，但时间边界和短操作描述仍需单独生成与评测。<strong>HomER</strong> 是 WGO-Bench 中的第一视角人类操作子集；本文固定评测 <strong>25 个视频 / 470 个参考片段</strong>。Macrodata 报告的完整 WGO-Bench Segment F1 约为 0.306，覆盖全部约 100 个视频；HomER-only 参考结果约为 0.227，更适合作为本文的范围对照。",
      "world.h3.egoant": "生产管线与 WGO-Bench 评测管线",
      "world.p.egoant": "<strong>EgoANT</strong> 是面向第一视角人类操作视频的自动标注系统。本文区分两条用途不同的管线：",
      "world.li.prod": "<strong>生产管线</strong>：HaWoR 手部运动重建 → 腕部速度平滑与低谷候选边界 → 段内 raw 抽帧描述 → 相邻片段合并与重写。细节见 <a href=\"#app-prod\">附录 D</a>。该管线借鉴 VITRA 类 motion-first decomposition，但切段后端是 HaWoR 腕部运动信号，不是 VITRA 模型。",
      "world.li.wgo": "<strong>WGO-Bench 评测管线</strong>：带时间戳的 contact sheets → Qwen3.6-27B 分段 → 固定预测边界后的语义标注与多候选选择。正文实验主要针对这条管线。",
      "world.p.models": "模型角色如下：<strong>Qwen3.6-27B</strong> 用于分段，也可作为部分标注候选生成器；<strong>Qwen3.5-397B</strong> 用于候选描述生成和 candidate selector；<strong>Gemini-3.5-Flash</strong> 仅作为最终语义评测 judge，不参与生成标签或选择候选。早期 Qwen judge 结果仅作为敏感性实验，不进入主分数。",

      "role.th.role": "角色",
      "role.th.model": "模型",
      "role.th.gold": "是否读取 gold 信息",
      "role.th.use": "在本文中的作用",
      "role.segmenter": "Segmenter",
      "role.captioner": "Caption generator",
      "role.selector": "Candidate selector",
      "role.judge": "Primary evaluation judge",
      "role.no": "否",
      "role.gold_label": "只读取 gold 标签用于离线评分",
      "role.segmenter.use": "生成预测时间边界",
      "role.captioner.use": "生成候选语义标签",
      "role.selector.use": "从候选标签中选择最终标签",
      "role.judge.use": "计算 Label Acc 与 Semantic E2E F1",
      "world.h3.gepa": "GEPA-derived prompt 在本文中的含义",
      "world.gepa.1": "Macrodata 使用 GEPA 在独立验证集上搜索分段 prompt。本文没有在推理阶段运行 GEPA。",
      "world.gepa.2": "本文实际复用的是公开得到的 completed-event segmentation rules，也就是一组英文分段规则 prompt。",
      "world.gepa.3": "因此，后文中的 “GEPA-derived prompt” 仅指这组规则文本；它不是新模型，也不是后处理脚本。",
      "world.gepa.4": "使用方式是：整集 contact sheets + 由 GEPA 搜索得到的分段规则 prompt → 一次粗分。规则要求只标完成动作、偏好约 2–10 秒片段，并忽略靠近、微调和收回等非完成事件。",
      "world.h3.terms": "常用术语",
      "world.term.1": "<strong>时间窗口</strong>：视频时间轴上的一段连续区间（例如 84–94 秒），不是软件 UI 窗口。",
      "world.term.2": "<strong>第一遍加密切（S1）</strong>：提高预测片段密度以提高召回率，但可能引入过分割。详见 <a href=\"#app-seg\">附录 B</a>。",
      "world.term.3": "<strong>第二遍局部精修（S2）</strong>：在粗边界附近的一小段时间里再切一次。",
      "world.term.4": "<strong>窗口不外扩（pad=0）</strong>：局部精修只使用粗分边界内部的视觉上下文，不引入窗口外相邻动作。",
      "world.term.5": "<strong>盖住完整动作（full-cover）</strong>：要求模型覆盖窗口内可见的完成动作，同时避免把靠近、微调和收回拆成不完整微动作片段。",
      "world.term.6": "<strong>selector / judge</strong>：selector 从多条候选标签中选择最终标签；judge 只用于评测，判断预测标签与 gold 标签是否描述同一完成动作。",
      "world.term.7": "<strong>HaWoR</strong>：从第一视角视频中重建手部运动，用于得到估计腕部轨迹并生成 wrist-guided crops。它不是传感器 ground truth。",
      "world.term.8": "<strong>Qwen3.6-27B</strong>：主要分段模型；<strong>Qwen3.5-397B</strong>：候选描述生成和 candidate selector；<strong>Gemini-3.5-Flash</strong>：主语义评测 judge。",
      "world.callout": "<strong>易混淆的视觉输入：</strong> contact sheet（分段用时间戳拼图）≠ 整帧 temporal collage ≠ 邻段 sheet ≠ proxy hand-collage ≠ 基于 HaWoR 重建腕轨迹的手部裁剪。",
      "metrics.h2": "2. 评测指标",
      "metrics.lead": "完整公式与简化示例见 <a href=\"#app-metrics\">附录 A</a>。正文先给出三类分数的定义。",
      "metrics.li1": "<strong>Segment F1</strong>：仅衡量预测片段与参考片段之间的时间边界质量；时间 IoU≥0.75 时可形成一对一匹配。",
      "metrics.li2": "<strong>Fixed-boundary Label Acc</strong>：使用参考时间边界，仅评估预测描述是否表达了相同的完成动作。",
      "metrics.li3": "<strong>Semantic E2E F1</strong>：先进行时间匹配，再判断匹配片段的语义描述是否正确；只有时间和语义都正确才计入正确预测。",
      "metrics.toy": "简化示例（与 scorer 逻辑一致）：",
      "metrics.figcap": "该图展示如何先用 IoU 判断 pred/gold 时间段是否重叠足够，再由匹配数计算 precision、recall 和 F1。",
      "legend.gold": "Gold / 人工标注",
      "legend.pred": "Pred / 模型预测",
      "legend.coarse": "Whole-episode coarse",
      "legend.contact": "Contact-sheet prediction",
      "contact.h2": "3. Contact-sheet 视觉输入",
      "contact.p": "我们不把整段 MP4 作为视觉输入直接提交给模型，而是每隔 <strong>0.5 秒</strong>抽一帧，缩到约 <strong>224×144</strong>，每张 sheet <strong>20 格（5×4）</strong>，格子上画<strong>黄色时间戳</strong>。长视频会生成多张 sheet；这些 sheet 可以在一次请求中作为整集上下文提交，也可以在分片实验中被拆成多次请求。",
      "contact.cap1": "同参数生成的一张 sheet（前 ~10 秒）。全片与局部时间窗口都用这一套 layout。",
      "contact.cap2": "局部时间窗口示例：版式相同，只换时间范围（第二遍精修看这种图）。",
      "contact.taxonomy.cap": "该图展示 raw frames、proxy overlay、temporal collage、neighbor sheet 和 wrist-guided crop 等视觉输入的差异。",
      "contact.taxonomy.explain": "<strong>读图：</strong>contact sheet 用于时间分段；raw frames 是固定边界标注的基础输入；proxy overlay 是在原帧上叠加光流或启发式提示，不是手部重建；temporal collage 与 neighbor sheet 引入前后文；基于 HaWoR 重建腕轨迹的裁剪依赖估计腕部轨迹。Gemini 重评显示，增加视觉上下文并未提高 HomER 上的固定边界标注准确率。",
      "walk.h2": "4. 案例分析：homer_4 的端到端处理流程",
      "walk.lead": "下列案例展示 <strong>selector 路径</strong>：先预测分段边界，再在固定预测边界下生成多个候选标签，并由 selector 选择最终描述。任务：用布擦桌面 / 柜面。折叠区保留英文 prompt 原文。",
      "story.h2": "6. 方法演进与组件比较",
      "story.lead": "本节按方法演进顺序说明主要配置。部分实验同时改变模型、prompt 或窗口设计，因此应理解为 iterative system development，而不是严格单变量消融。",
      "story.h3.seg": "6.1 分段：从分片伪边界到局部精修",
      "story.h3.label": "6.2 标注：更复杂的视觉输入未必提高准确率",
      "story.h3.e2e": "6.3 预测边界上的语义标注：单路生成与多候选选择",
      "recipe.h2": "7. 推荐配置与使用边界",
      "appendix.h2": "8. 附录：概念、公式、实现与成本记账",
      "tldr.k.label": "Label Acc（固定边界）",
      "intro.vs": "<strong>HomER-only 范围对照：</strong>EgoANT 的 Segment F1 为 <strong>0.2031</strong>；Macrodata 报告的 HomER-only Gemini 参考约为 <strong>0.227</strong>，绝对差为 <strong>0.0239</strong>。端到端本页 Gemini judge Semantic E2E F1 为 <strong>0.1542</strong>；公开 blog 的 full-set E2E≈0.168 覆盖不同范围，只作量级参考。固定参考边界下，raw 27B 的 Label Acc 为 <strong>55.7%</strong>。<em>核心观察：粗到细的分段策略显著高于腕速生产基线；简单 raw-frame 标注在 HomER 上比更复杂的视觉上下文更稳定；多候选选择在额外调用成本下取得最高 E2E 观察值。</em>",
      "walk.score": "<strong>本集成绩：</strong>gold 15 / pred 11；IoU≥0.75 匹配 4；语义匹配 3；本集 E2E≈0.231（全集 HomER micro 仍是 0.1542）。",
      "walk.task": "任务指令：",
      "walk.s0.t": "输入视频",
      "walk.s1.t": "生成 contact sheet",
      "walk.s1.p": "参数与上一节相同。模型后续只看这些带时间戳的拼图，而不是原始 MP4 字节流。",
      "walk.s1.note": "下方为首张 sheet 示例（同参数）。",
      "walk.s2.t": "粗分：整集一次 + 切段规则清单",
      "walk.s2.p": "将整集 contact sheets 与<strong>分段规则 prompt</strong>一起提交给分段模型。规则来自 GEPA-derived completed-event segmentation prompt，要求只标完成动作、偏好约 2–10 秒片段，并避免把靠近、微调和收回标为独立事件。这样减少由分片请求边界引入的伪边界，但可能欠分割。",
      "walk.s3.t": "局部再切一遍：窗口不外扩，盖住完整动作",
      "walk.s3.p": "在粗边界附近开一个<strong>短时间窗</strong>，用<strong>同一版式</strong>的 sheet 再切一次。<strong>窗口不外扩</strong>表示只使用粗边界内部的视觉上下文；<strong>盖住完整动作</strong>表示窗口内可见的完成动作都应被覆盖，同时避免不完整微动作片段。（技术名：S2 · pad=0 · full-cover）",
      "walk.s3.cap": "局部时间窗 contact sheet（第二遍精修输入）。",
      "walk.s3.diagram.cap": "该图展示：S2 只在粗分窗口内重切；pad=0 避免看进邻段，full-cover 要求窗口内完成动作都被覆盖。",
      "walk.s4.t": "多候选标注",
      "walk.s4.p": "固定分段边界后，对每个预测片段生成多条候选描述：<strong>raw</strong> 使用默认抽帧；<strong>ffmpeg</strong> 使用另一套解码/抽帧路径；<strong>seed</strong> 和 <strong>rawprior</strong> 使用先前模型输出作为文本先验。selector 在推理时只看候选及其来源，不看 gold 标签。",
      "walk.s5.t": "Candidate selector 定稿",
      "walk.s5.p": "Qwen3.5-397B 从候选描述中选择最准确表达当前完成动作的一条。",
      "walk.s6.t": "点选 pred 段：看视频 + 标注",
      "walk.s6.p": "这里只展示 <strong>selector 预测轨</strong>：点击色块或表格行后，右侧播放对应片段，左侧显示预测标签。gold / 整集粗分 / contact-sheet 粗分的多轨边界对照见上方 <a href=\"#boundary\">§3.5</a>。",
      "walk.s6.hint": "点击 pred 色块或表格行。",
      "walk.th.src": "来源",
      "walk.th.cand": "候选标签",
      "walk.th.track": "轨道",
      "walk.th.time": "时间 (s)",
      "walk.th.sub": "子任务",
      "walk.prompt.gepa": "Prompt (English only) — segmentation rules",
      "walk.prompt.s2": "Prompt (English only)",
      "walk.prompt.label": "Prompt (English only) — labeling",
      "walk.prompt.sel": "Prompt (English only) — selector",
      "walk.prompt.judge": "Prompt (English only) — judge (scoring only)",
      "story.seg.1": "原 EgoANT <strong>rule-based</strong> 腕速切段：过碎（F1≈0.095）。",
      "story.seg.2": "Contact sheet <strong>分片</strong>（max_sheets=3）：接近公开报告中的输入形式，但请求边界会引入伪边界。",
      "story.seg.3": "<strong>整集一次</strong> + 旧版 prompt：减少分片伪边界，但预测片段过少。",
      "story.seg.4": "加入 <strong>GEPA-derived segmentation prompt</strong>：Segment F1 提高到 0.1369，但仍欠分割。",
      "story.seg.5": "<strong>第一遍加密切（S1）</strong>：提高召回率，但同时增加过分割。",
      "story.seg.6": "<strong>第二遍局部精修</strong>：结果支持局部精修这一设计方向；最终 <strong>窗口不外扩 + 盖住完整动作</strong>（S2 · pad=0 · full-cover）取得 <strong>0.2031</strong>。算法式 midpoint 覆盖后处理低于直接在 prompt 中写入 full-cover 约束。",
      "story.seg.7": "三种相邻片段合并策略均降低 Segment F1，因此不作为默认配置。",
      "story.chart.seg": "Segment F1（主路径）",
      "story.seg.legend": "表头：<strong>P（Precision）</strong>= match / pred（预测段里配对成功的比例）；<strong>R（Recall）</strong>= match / gold（gold 段被找回的比例）；<strong>match / pred / gold</strong>= 配对成功数 / 预测段数 / gold 段数（本子集 gold 恒为 470）。「模型」列若写<strong>规则后处理</strong>，表示在已有预测上做脚本合并，不再调用 LLM。",
      "story.seg.padnote": "窗口外扩秒数（旧称 pad）的消融未进入主决策路径；细节见折叠区。",
      "story.seg.fold": "展开：分段实验细节",
      "story.label.p": "固定参考边界后，Gemini judge 全量重评显示：<strong>raw 27B 的观察值最高，为 55.7%</strong>；temporal collage 27B 为 52.8%，proxy overlay 27B 为 50.6%，基于 HaWoR 重建腕轨迹的手部裁剪（397B）为 50.9%，raw 397B 为 50.2%。在 397B 上，overlay 为 48.5%、temporal collage 为 45.1%、neighbor / proxy hand-collage 约为 39–40%。这些结果表明，在 HomER 上，增加视觉上下文并未提高固定边界标注准确率；错误检查显示相邻动作经常被写入当前片段描述。",
      "story.label.cap1": "<strong>读图（三栏）：</strong>左=原帧；中=启发式框（画面中心偏下固定方框，<em>不是</em>手腕检测）；右=裁出后送给标注模型的图。这是失败的 proxy 路径示意。固定边界上这类输入低于 raw。详见 <a href=\"#app-visual\">附录 E</a>。",
      "story.label.cap2": "<strong>读图（三栏）：</strong>左=原帧；中=YOLO person 框（仍非 HaWoR 重建腕轨迹）；右=模型实际看到的 crop。HomER 早期无手重建时使用此类 proxy；Gemini 重评后，基于 HaWoR 重建腕轨迹的裁剪为 50.9%。",
      "story.label.fold": "展开：标注实验细节（做法卡）",
      "story.e2e.p": "固定 S2 分段边界后，只改变语义标注路径。<strong>27B 自标</strong>为 0.1234；<strong>27B raw 重标</strong>虽然在固定参考边界 Label Acc 上最高，但在预测边界上 E2E 只有 0.1285；<strong>397B raw 重标</strong>为 0.1414；<strong>ffmpeg raw</strong> 和 <strong>397B-prior neighbor</strong> 均为 0.1491；<strong>candidate selector</strong> 从多路候选中选择最终标签，取得最高观察值 <strong>0.1542</strong>。该增益应与额外候选生成和 selector 调用成本一起理解。",
      "story.e2e.fold": "展开：E2E 实验细节（做法卡）",
      "story.takeaway": "<strong>要点：</strong>分片请求边界会引入伪边界；分段规则定义要切分的完成动作，局部精修决定边界粒度；三种规则合并策略均降低 Segment F1；Gemini 重评后，raw 27B 是固定参考边界下观察值最高的标注配置，但端到端最高观察值仍来自 S2 预测边界 + 397B 多候选 selector。换句话说，<strong>27B 是最佳 fixed-boundary captioner，但不是最佳 noisy predicted-segment label resolver</strong>。proxy overlay、neighbor sheet 和 proxy hand-collage 目前不作为默认路径。",
      "th.cond": "条件",
      "th.model": "模型或方法",
      "th.note": "结果一句话",
      "th.acc": "Acc",
      "th.matchn": "n_match/n",
      "th.delta": "Δ vs raw",
      "th.remark": "备注",
      "th.segf1": "Seg F1",
      "th.e2ef1": "E2E F1",
      "th.predgold": "pred/gold",
      "recipe.p1.t": "Contact sheet",
      "recipe.p1.d": "0.5s · 224×144 · 20 tiles · yellow stamps",
      "recipe.p2.t": "粗分",
      "recipe.p2.d": "整集一次 + 切段规则清单",
      "recipe.p3.t": "局部再切",
      "recipe.p3.d": "窗口不外扩 · 盖住完整动作 · 27B → 0.2031",
      "recipe.p4.t": "Selector",
      "recipe.p4.d": "397B 多候选 selector → Gemini E2E 0.1542",
      "recipe.th.stage": "阶段",
      "recipe.th.do": "推荐配置",
      "recipe.th.dont": "当前不推荐",
      "recipe.r1.a": "分段",
      "recipe.r1.b": "Qwen3.6-27B + GEPA-derived segmentation prompt + 局部精修（窗口不外扩、盖住完整动作）",
      "recipe.r1.c": "分片 max3；基于规则的相邻片段合并",
      "recipe.r2.a": "低成本配置",
      "recipe.r2.b": "固定参考边界诊断：27B raw（Label Acc 55.7%）；预测边界 E2E 低成本配置：397B raw（0.1414）",
      "recipe.r2.c": "proxy overlay / neighbor sheet / whole-frame collage / proxy hand-crop 作为默认配置",
      "recipe.r3.a": "高准确率配置",
      "recipe.r3.b": "同一 S2 预测边界 + 多候选生成 + 397B selector（Gemini E2E 0.1542）",
      "recipe.r3.c": "将分段模型自标直接作为最终标签",
      "recipe.r4.a": "对照",
      "recipe.r4.b": "HomER-only vs Macrodata HomER≈0.227",
      "recipe.r4.c": "与 full-100 0.306 headline 直接比较",
      "appendix.lead": "正文讲「试了什么、分数怎么变」；本附录补清楚公式、术语和实现边界。目录： <a href=\"#app-metrics\">A 得分</a> · <a href=\"#app-seg\">B 分段概念</a> · <a href=\"#app-e2e\">C 标注/E2E 术语</a> · <a href=\"#app-prod\">D 生产管线</a> · <a href=\"#app-visual\">E 视觉输入</a> · <a href=\"#app-prompts\">F Prompt</a> · <a href=\"#app-cost\">G 成本记账</a> · <a href=\"#audit\">H 效度</a>。",
      "metrics.toy.g": "Gold：G0[0,3], G1[3,6], G2[6,10] · Pred：P0[0.5,2.8], P1[2.8,5.5], P2[5.5,8], P3[8,9.5]",
      "metrics.toy.1": "Outer snap：P0.start→0，P3.end→10",
      "metrics.toy.2": "IoU：P0–G0≈0.933，P1–G1≈0.781",
      "metrics.toy.3": "n_match=2 → P=0.50，R≈0.67，F1≈0.571",
      "story.chart.label": "标注准确率",
      "story.chart.e2e": "E2E F1",
      "walk.s0.hint": "下方为整集预览。到 Step 06 点选时间轴或表格行，可只播该段并同步看标注。",
      "walk.s6.clipidle": "尚未选择片段",
      "walk.s6.selected": "当前选中",
      "walk.s6.cands": "候选标签",
      "walk.s6.looping": "循环播放该段",
      "walk.s6.clickplay": "再点一次开始循环播放",
      "nav.boundary": "边界对照",
      "boundary.h2": "3.5 边界对照：同一视频上的三种分段结果",
      "boundary.lead": "对齐 Macrodata 博客的 Boundary comparison：上方视频，下方多轨时间轴；播放头随播放移动。悬停看完整标注，点击跳到该段。集号与样例走读一致（homer_4）。",
      "boundary.kicker": "边界对照",
      "boundary.caption": "模型通常能够识别主要动作事件，但容易遗漏细粒度的动作边界。同集 homer_4（与下方案例一致）对照：人工 gold、整集粗分、contact sheet 粗分。悬停色块可看完整标签。",
      "page.title": "EgoANT 在 WGO-Bench HomER 上的评测",
      "hero.title": "EgoANT<br />on WGO-Bench HomER",
      "hero.grid.aria": "第一视角人手子任务视频墙",
      "nav.brand": "EgoANT · 报告",
      "references.h2": "参考文献",
      "references.wgo": "Macrodata Labs. (2026). <em>WGO-Bench: What's Going On Benchmark</em>. Hugging Face. <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">https://huggingface.co/datasets/macrodata/WGO-Bench</a>",
      "references.macrodata": "Macrodata Labs. (2026). <em>Segmenting Robot Video into Actionable Subtasks</em>. Macrodata Labs. <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">https://macrodata.co/blog/annotating-robot-video-subtasks</a>",
      "references.gepa": "Agrawal, Lakshya A., Tan, Shangyin, Soylu, Dilara, Ziems, Noah, Khare, Rishi, Opsahl-Ong, Krista, et al. (2026). <em>GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning</em>. arXiv. <a href=\"https://arxiv.org/abs/2507.19457\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2507.19457</a>",
      "references.scale": "Choghari, Jade, Sansone, Agustin, Pasqualis, Nicolas, Mader, Conrado, Tiupikov, Aleks, Sivapurapu, Mouli. (2026). <em>The Path to Large Scale Dense Video Captioning</em>. Scale Labs. <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning</a>",
      "references.vitra": "Li, Qixiu, Deng, Yu, Liang, Yaobo, Luo, Lin, Zhou, Lei, Yao, Chengtang, et al. (2025). <em>VITRA: Scalable Vision-Language-Action Model Pretraining for Robotic Manipulation with Real-Life Human Activity Videos</em>. Project page. <a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">https://microsoft.github.io/VITRA/</a>",
      "references.hawor": "Zhang, Jinglei, Deng, Jiankang, Ma, Chao, Potamias, Rolandos Alexandros. (2025). <em>HaWoR: World-Space Hand Motion Reconstruction from Egocentric Videos</em>. arXiv. <a href=\"https://arxiv.org/abs/2501.02973\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2501.02973</a>",
      "references.egodex": "Hoque, Ryan, Huang, Peide, Yoon, David J., Sivapurapu, Mouli, Zhang, Jian. (2025). <em>EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video</em>. arXiv. <a href=\"https://arxiv.org/abs/2505.11709\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2505.11709</a>",
      "references.egoverse": "EgoVerse Consortium. (2026). <em>EgoVerse: Egocentric Data for Robot Learning from Around the World</em>. Project website. <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">https://egoverse.ai/</a>",
      "references.egolive": "Li, Yihang, Wei, Xuelong, Luo, Jingzhou, Xiao, Yingjing, Bai, Yibo, Zhou, Guangyuan, Zou, Teng, et al. (2026). <em>EgoLive: A Large-Scale Egocentric Dataset from Real-World Human Tasks</em>. arXiv. <a href=\"https://doi.org/10.48550/arXiv.2604.23570\" target=\"_blank\" rel=\"noopener\">https://doi.org/10.48550/arXiv.2604.23570</a>",
      "footer.text": "EgoANT 在 WGO-Bench HomER 上的评测 · HomER 25/470 · F1 越大越好"
    },
    en: {
      "nav.intro": "Intro",
      "nav.tldr": "Key results",
      "nav.world": "Background",
      "nav.metrics": "Metrics",
      "nav.contact": "Contact sheet",
      "nav.walk": "Walkthrough",
      "nav.cost": "Cost",
      "nav.story": "Ablations",
      "nav.recipe": "Recipe",
      "nav.appendix": "Appendix",
      "nav.references": "References",
      "toc.label": "On this page",
      "tag.ego": "Egocentric",
      "tag.human": "Human data",
      "tag.subtask": "Subtasks",
      "tag.wgo": "WGO-Bench",
      "tag.egoant": "EgoANT",
      "hero.link.blog": "Macrodata blog",
      "hero.link.app": "Appendix",
      "hero.eyebrow": "WGO-Bench HomER · EgoANT",
      "hero.lede": "EgoANT converts long egocentric manipulation videos into temporally localized action units with concise operation labels. On the 25-episode / 470-segment WGO-Bench HomER subset, the best segmentation configuration obtains Segment F1 0.2031; with those predicted boundaries fixed, multi-candidate labeling and selection obtains Semantic E2E F1 0.1542.",
      "en.banner": "",
      "intro.h2": "Introduction: subtask segmentation and semantic labeling for egocentric manipulation video",
      "intro.p1": "To turn egocentric human manipulation videos into structured training data, we identify temporally localized action units and generate concise semantic descriptions for each unit. These videos often contain camera motion, hand occlusion, and dense fine-grained manipulation.",
      "intro.p2": "Action boundaries and semantic descriptions can provide structured supervision for VLA pretraining, hierarchical skill learning, and reward-model construction. Hourly human annotation does not scale to large video corpora, so an auditable automatic labeling pipeline is needed.",
      "intro.h3": "Related datasets and annotation methods",
      "intro.li0": "Egocentric datasets such as <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">EgoVerse</a>, <a href=\"https://github.com/apple/ml-egodex\" target=\"_blank\" rel=\"noopener\">EgoDex</a>, and <a href=\"https://arxiv.org/abs/2604.23570\" target=\"_blank\" rel=\"noopener\">EgoLive</a> provide large first-person hand-manipulation videos; this report focuses on generating temporal boundaries and short operation labels for such videos.",
      "intro.li1": "HomER is the egocentric human subset of <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a>; this report evaluates on 25 HomER videos and 470 reference segments.",
      "intro.li2": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a> processes monocular egocentric videos into 3D hand/camera motion, atomic action segments, and language instructions. EgoANT borrows the motion-first decomposition idea, but uses an independent HaWoR wrist-motion signal for production segmentation and does not run the VITRA model.",
      "intro.li3": "WGO-Bench and the <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata blog</a> provide public protocols for segmentation, fixed-boundary labeling, and end-to-end evaluation, together with Gemini reference results and cost estimates.",
      "intro.li4": "Scale Labs dense video captioning discusses dense descriptions for already-cut clips; this report studies predicting both temporal boundaries and semantic labels from long video episodes.",
      "intro.p3": "This page reports EgoANT’s evaluation protocol, method design, main component comparisons, failure patterns, and cost analysis on HomER.",
      "intro.scope": "Scope: all scores and recommendations on this page are anchored to the 25-video / 470-segment HomER subset. HomER was used for method development as well as final reporting, so this should be read as a HomER development study rather than a held-out benchmark claim. Same-protocol results on WGO robot-view subsets and other egocentric datasets remain future work.",
      "tldr.h2": "Key results",
      "tldr.seg": "Whole-episode coarse + local re-cut (no pad-out, cover full actions) · Qwen3.6-27B",
      "tldr.label": "raw 27B: highest Label Acc under fixed reference boundaries",
      "tldr.e2e": "S2 predicted boundaries + 397B multi-candidate selector",
      "cost.h2": "5. Cost: Macrodata published numbers vs EgoANT",
      "cost.note": "Both WGO paths share the same S2 segmentation (Seg F1=0.2031) and only change labeling calls. API counts are artifact-counted from report outputs; token numbers are engineering estimates. Macrodata quotes Gemini batch USD, while this page reports a Qwen-stack structural estimate, so they are not the same invoice. See Appendix G.",
      "cost.compare.h3": "Vs Macrodata published cost",
      "cost.th.source": "Source",
      "cost.th.scope": "Scope",
      "cost.th.num": "Figure",
      "cost.row.md_e2e": "Macrodata (public)",
      "cost.row.md_e2e_scope": "E2E seeded relabel (batch)",
      "cost.row.md_e2e_num": "~$2.64 / video-hour; segmentation-only batch ~$0.43/h",
      "cost.row.md_cs": "Macrodata (public)",
      "cost.row.md_cs_scope": "Contact sheet vs per-frame inputs",
      "cost.row.md_cs_num": "~12× cheaper (token/price illustration in their post)",
      "cost.row.wgo": "EgoANT (this page, WGO)",
      "cost.row.wgo_scope": "raw / selector estimate + artifact API counts",
      "cost.row.wgo_num": "See table below; not a Gemini invoice",
      "cost.row.prod": "EgoANT production default",
      "cost.row.prod_scope": "Internal engineering estimate on the same HomER subset",
      "cost.row.prod_num": "Aggregated call scale only; no internal machines, paths, or service status disclosed",
      "cost.recipe.h3": "WGO labeling paths (estimated tokens)",
      "cost.th.item": "Item",
      "cost.th.raw": "Raw-only (E2E 0.1414)",
      "cost.th.sel": "Candidates+selector (E2E 0.1542)",
      "cost.dyn.summary": "HomER {n} episodes, {min} minutes total (mean ~{mean}s). WGO tokens are engineering estimates; API counts are artifact-counted. {extra}",
      "cost.dyn.extra": "",
      "cost.dyn.prod_h3": "Production path: aggregated cost note",
      "cost.dyn.prod_p": "This path differs from the contact-sheet selector path; the public page keeps only aggregate accounting.",
      "cost.dyn.api": "API requests",
      "cost.dyn.prompt": "prompt tokens",
      "cost.dyn.completion": "completion tokens",
      "cost.dyn.total": "total tokens",
      "cost.dyn.per_min": "tokens / video-minute",
      "cost.dyn.measured": "Measured",
      "cost.dyn.stage": "Stage",
      "cost.dyn.reqs": "Requests",
      "cost.row.dur": "Total video duration (ffprobe)",
      "cost.row.pred": "Predicted segments (artifact count)",
      "cost.row.s2": "S2 local windows (artifact count)",
      "cost.row.label_api": "Labeling-related API (artifact count)",
      "cost.row.api_tot": "API total (artifact count)",
      "cost.row.tok": "Tokens total (engineering estimate)",
      "cost.row.tok_min": "Tokens / video-minute (estimate)",
      "cost.row.e2e": "E2E F1",
      "app.cost.h3": "G. Cost: estimates and Macrodata",
      "app.cost.md": "Macrodata publishes ~$2.64/video-hour (batch) for E2E seeded relabel and ~$0.43/h for segmentation-only batch; contact sheets are ~12× cheaper than per-frame inputs. They do not publish a HomER-25 total-token invoice.",
      "splash.link.demos": "Videos",
      "splash.link.blog": "Report",
      "splash.cta": "Enter report",
      "demos.h2": "Egocentric human subtasks",
      "demos.lede": "One first-person HomER clip per episode (5×5 = all 25); captions are short auto-annotation labels.",
      "load.error": "Could not load data files. Serve this folder with Range support (e.g. <code>python3 serve_report.py --port 8765</code>); do not open via restricted <code>file://</code>.",
      "world.h2": "1. Terms, datasets, and experimental setup",
      "world.h3.md": "WGO-Bench and Macrodata’s public protocol",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata · Annotating Robot Video Subtasks</a> frames “long video → action segments + short semantic labels” as a public evaluation problem: <strong>WGO-Bench</strong>, three metrics (segmentation / fixed-boundary labeling / end-to-end), and Gemini reference results. This report evaluates several <strong>EgoANT</strong> configurations under the same metric framework.",
      "world.h3.ego": "Egocentric data and the HomER subset",
      "world.p.ego": "First-person hand datasets such as EgoVerse, EgoDex, and EgoLive provide long human manipulation videos, but temporal boundaries and short operation labels still need to be generated and evaluated. <strong>HomER</strong> is the egocentric human subset of WGO-Bench; this report evaluates on <strong>25 videos / 470 reference segments</strong>. Macrodata reports full WGO-Bench Segment F1 around 0.306 over ~100 videos; the HomER-only reference around 0.227 is the appropriate scope comparison here.",
      "world.h3.egoant": "Production pipeline and WGO-Bench evaluation pipeline",
      "world.p.egoant": "<strong>EgoANT</strong> is an automatic annotation system for egocentric human manipulation videos. This report separates two pipelines with different purposes:",
      "world.li.prod": "<strong>Production pipeline</strong>: HaWoR hand-motion reconstruction → smoothed wrist-speed candidate boundaries → raw-frame segment captions → adjacent-segment merge and rewrite. Details are in <a href=\"#app-prod\">Appendix D</a>. This pipeline borrows the VITRA-style motion-first decomposition idea, but the segmentation signal is HaWoR wrist motion, not the VITRA model.",
      "world.li.wgo": "<strong>WGO-Bench evaluation pipeline</strong>: timestamped contact sheets → Qwen3.6-27B segmentation → semantic labeling and multi-candidate selection under fixed predicted boundaries. The body experiments mainly cover this pipeline.",
      "world.p.models": "Model roles are separated as follows: <strong>Qwen3.6-27B</strong> is the segmenter and can also generate some label candidates; <strong>Qwen3.5-397B</strong> generates candidate captions and acts as the candidate selector; <strong>Gemini-3.5-Flash</strong> is only the final semantic evaluation judge and does not generate labels or select candidates. Earlier Qwen-judge results are judge-sensitivity checks, not main scores.",
      "world.h3.gepa": "Meaning of GEPA-derived prompt in this report",
      "world.gepa.1": "Macrodata used GEPA on a validation set to search for segmentation prompts. This report does not run GEPA at inference time.",
      "world.gepa.2": "What we reuse is the publicly described completed-event segmentation rules: an English segmentation-rule prompt.",
      "world.gepa.3": "Thus, “GEPA-derived prompt” below refers only to that rule text; it is not a new model and not a post-processing script.",
      "world.gepa.4": "Usage: whole-episode contact sheets + GEPA-derived segmentation prompt → one coarse segmentation pass. The rules ask for completed actions, prefer roughly 2–10s segments, and ignore approach, adjustment, and retraction when they do not complete an event.",
      "world.h3.terms": "Recurring terms",
      "world.term.1": "<strong>Time window</strong>: a contiguous interval on the video timeline (e.g. 84–94s)—not a UI window.",
      "world.term.2": "<strong>Pass-1 denser cuts (S1)</strong>: increases predicted segment density to improve recall, but may introduce over-segmentation. See <a href=\"#app-seg\">Appendix B</a>.",
      "world.term.3": "<strong>Pass-2 local refine (S2)</strong>: re-cut once inside a short window near coarse bounds.",
      "world.term.4": "<strong>No pad-out (pad=0)</strong>: local refinement uses only visual context inside the coarse boundary and does not include neighboring actions outside the window.",
      "world.term.5": "<strong>Cover full actions (full-cover)</strong>: asks the model to cover completed actions visible in the window while avoiding incomplete approach, adjustment, and retraction fragments.",
      "world.term.6": "<strong>selector / judge</strong>: the selector picks the final label from candidate labels; the judge is used only for evaluation, deciding whether a predicted label and a gold label describe the same completed action.",
      "world.term.7": "<strong>HaWoR</strong>: reconstructs hand motion from egocentric video, yielding estimated wrist tracks for wrist-guided crops. It is not sensor ground truth.",
      "world.term.8": "<strong>Qwen3.6-27B</strong>: primary segmentation model; <strong>Qwen3.5-397B</strong>: candidate caption generator and candidate selector; <strong>Gemini-3.5-Flash</strong>: primary semantic evaluation judge.",
      "world.callout": "<strong>Easy-to-confuse visual inputs:</strong> contact sheet (timestamped collage for segmentation) ≠ whole-frame temporal collage ≠ neighbor sheets ≠ proxy hand-collage ≠ HaWoR-reconstructed wrist-guided crop.",
      "metrics.h2": "2. Evaluation metrics",
      "metrics.lead": "Full formulas and a simplified example are in <a href=\"#app-metrics\">Appendix A</a>. The body first defines the three scores.",
      "metrics.li1": "<strong>Segment F1</strong>: measures temporal boundary quality only; a predicted segment can form a one-to-one match with a reference segment when temporal IoU is at least 0.75.",
      "metrics.li2": "<strong>Fixed-boundary Label Acc</strong>: uses reference time boundaries and evaluates only whether the predicted description expresses the same completed action.",
      "metrics.li3": "<strong>Semantic E2E F1</strong>: first performs temporal matching, then judges the label for matched pairs; a prediction is correct only when both time and semantics are correct.",
      "metrics.toy": "Simplified example (matching the scorer logic):",
      "metrics.figcap": "This figure shows how IoU first checks whether pred/gold time intervals overlap enough, then match counts become precision, recall, and F1.",
      "legend.gold": "Gold / human annotation",
      "legend.pred": "Pred / model prediction",
      "legend.coarse": "Whole-episode coarse",
      "legend.contact": "Contact-sheet prediction",
      "contact.h2": "3. Contact-sheet visual input",
      "contact.p": "We do not feed raw MP4 bytes as the vision input. We sample one frame every <strong>0.5s</strong>, resize it to about <strong>224×144</strong>, and pack <strong>20 tiles (5×4)</strong> per sheet with <strong>yellow timestamps</strong>. Long videos produce multiple sheets; these sheets can be submitted as whole-episode context in one request or split across requests in chunking experiments.",
      "contact.cap1": "One sheet with the same params (first ~10s). Whole-episode and local windows share this layout.",
      "contact.cap2": "Local time-window example: same layout, different range (what pass-2 refine sees).",
      "contact.taxonomy.cap": "This figure contrasts raw frames, proxy overlays, temporal collages, neighbor sheets, and wrist-guided crops.",
      "contact.taxonomy.explain": "<strong>How to read it:</strong> contact sheets are used for temporal segmentation; raw frames are the basic fixed-boundary labeling input; proxy overlay means raw frames with optical-flow or heuristic marks, not hand reconstruction; temporal collages and neighbor sheets add context; HaWoR-reconstructed wrist-guided crops depend on estimated wrist tracks. The Gemini rescore shows that added visual context did not improve fixed-boundary label accuracy on HomER.",
      "walk.h2": "4. Case study: end-to-end processing of homer_4",
      "walk.lead": "This case study shows the <strong>selector path</strong>: predict segment boundaries, generate multiple candidate labels under fixed predicted boundaries, and let the selector choose the final description. Task: wipe tables / cabinet surfaces with a cloth. Folded sections keep the original English prompts.",
      "story.h2": "6. Method development and component comparisons",
      "story.lead": "This section follows the method-development sequence. Some experiments change the model, prompt, or window design at the same time, so they should be read as iterative system development rather than strictly controlled single-variable ablations.",
      "story.h3.seg": "6.1 Segmentation: from chunk-induced pseudo-boundaries to local refinement",
      "story.h3.label": "6.2 Labeling: richer visual inputs do not necessarily improve accuracy",
      "story.h3.e2e": "6.3 Semantic labeling under predicted boundaries: single-path generation vs multi-candidate selection",
      "recipe.h2": "7. Recommended configurations and usage boundaries",
      "appendix.h2": "8. Appendix: concepts, formulas, implementation, cost accounting",
      "tldr.k.label": "Label Acc (fixed boundaries)",
      "intro.vs": "<strong>HomER-only scope comparison:</strong> EgoANT obtains Segment F1 <strong>0.2031</strong>; Macrodata reports a HomER-only Gemini reference of about <strong>0.227</strong>, an absolute gap of <strong>0.0239</strong>. This page’s Gemini-judged Semantic E2E F1 is <strong>0.1542</strong>; the public blog’s full-set E2E≈0.168 covers a different scope and is only a scale reference. Under fixed reference boundaries, raw 27B reaches Label Acc <strong>55.7%</strong>. <em>Main observation: coarse-to-local segmentation improves substantially over the wrist-speed production baseline; simple raw-frame labeling is more stable than richer visual-context designs on HomER; multi-candidate selection gives the highest observed E2E result at additional call cost.</em>",
      "walk.score": "<strong>Episode score:</strong> gold 15 / pred 11; IoU≥0.75 matches 4; semantic matches 3; episode E2E≈0.231 (HomER micro overall stays 0.1542).",
      "walk.task": "Task instruction:",
      "walk.s0.t": "Input video",
      "walk.s1.t": "Build contact sheets",
      "walk.s1.p": "Same parameters as above. The model only sees these timestamped collages—not raw MP4 bytes.",
      "walk.s1.note": "First sheet example below (same params).",
      "walk.s2.t": "Coarse cut: whole episode + segmentation rule list",
      "walk.s2.p": "Submit whole-episode contact sheets together with the <strong>segmentation-rule prompt</strong>. The rules come from the GEPA-derived completed-event segmentation prompt: completed actions only, roughly 2–10s segments, and no independent events for approach, adjustment, or retraction. This reduces pseudo-boundaries from chunked request seams, but may under-segment.",
      "walk.s3.t": "Local re-cut: no pad-out, cover full actions",
      "walk.s3.p": "Open a <strong>short time window</strong> near coarse bounds and re-cut with the <strong>same sheet layout</strong>. <strong>No pad-out</strong> means using only visual context inside the coarse boundary. <strong>Cover full actions</strong> means covering completed events visible in the window while avoiding incomplete micro-action fragments. (Technical name: S2 · pad=0 · full-cover.)",
      "walk.s3.cap": "Local-window contact sheet (pass-2 refine input).",
      "walk.s3.diagram.cap": "This diagram shows: S2 re-cuts only inside the coarse window; pad=0 avoids neighboring actions, and full-cover asks the model to cover every completed action inside the window.",
      "walk.s4.t": "Multi-candidate labeling",
      "walk.s4.p": "After segment boundaries are fixed, each predicted segment receives multiple candidate descriptions: <strong>raw</strong> uses default sampled frames; <strong>ffmpeg</strong> uses an alternate decode/sampling path; <strong>seed</strong> and <strong>rawprior</strong> use previous model outputs as textual priors. At inference time, the selector sees candidates and their sources, not gold labels.",
      "walk.s5.t": "Candidate selector picks the final line",
      "walk.s5.p": "Qwen3.5-397B selects the candidate that most accurately describes the current completed action.",
      "walk.s6.t": "Pick a pred segment: video + label",
      "walk.s6.p": "This section shows the <strong>selector prediction track</strong>: click a bar or table row to play the corresponding clip on the right and inspect its predicted label on the left. The multi-track comparison with gold, whole-episode coarse, and contact-sheet coarse boundaries appears in <a href=\"#boundary\">§3.5</a>.",
      "walk.s6.hint": "Click a pred bar or table row.",
      "walk.th.src": "Source",
      "walk.th.cand": "Candidate label",
      "walk.th.track": "Track",
      "walk.th.time": "Time (s)",
      "walk.th.sub": "Subtask",
      "walk.prompt.gepa": "Prompt (English only) — segmentation rules",
      "walk.prompt.s2": "Prompt (English only)",
      "walk.prompt.label": "Prompt (English only) — labeling",
      "walk.prompt.sel": "Prompt (English only) — selector",
      "walk.prompt.judge": "Prompt (English only) — judge (scoring only)",
      "story.seg.1": "Original EgoANT <strong>rule-based</strong> wrist-speed cuts: over-fragmented (F1≈0.095).",
      "story.seg.2": "Contact-sheet <strong>chunking</strong> (max_sheets=3): close to the public input format, but request seams introduce pseudo-boundaries.",
      "story.seg.3": "<strong>Whole-episode</strong> + legacy prompt: reduces chunk-induced pseudo-boundaries, but predicts too few segments.",
      "story.seg.4": "Adding the <strong>GEPA-derived segmentation prompt</strong>: Segment F1 increases to 0.1369, but the model still under-segments.",
      "story.seg.5": "<strong>Pass-1 denser cuts (S1)</strong>: improves recall, but also increases over-segmentation.",
      "story.seg.6": "<strong>Pass-2 local refinement</strong>: results support local refinement as the preferred design. The final <strong>no pad-out + cover full actions</strong> configuration (S2 · pad=0 · full-cover) obtains <strong>0.2031</strong>. Algorithmic midpoint cover postprocessing performs worse than putting the full-cover constraint directly in the prompt.",
      "story.seg.7": "All three adjacent-segment merge strategies lower Segment F1, so they are not used as defaults.",
      "story.chart.seg": "Segment F1 (main path)",
      "story.seg.legend": "Headers: <strong>P (Precision)</strong>= match / pred; <strong>R (Recall)</strong>= match / gold; <strong>match / pred / gold</strong>= counts (gold fixed at 470 here). If the model column says <strong>rule postprocess</strong>, it means scripted merges on existing preds—no LLM call.",
      "story.seg.padnote": "Pad-out second ablations are not on the main decision path; details stay folded.",
      "story.seg.fold": "Expand: segmentation details",
      "story.label.p": "With reference boundaries fixed, the full Gemini rescore shows: <strong>raw 27B is highest at 55.7%</strong>; temporal collage 27B reaches 52.8%, proxy overlay 27B 50.6%, HaWoR-reconstructed wrist-guided crop with 397B 50.9%, and raw 397B 50.2%. On 397B, overlay reaches 48.5%, temporal collage 45.1%, and neighbor / proxy hand-collage about 39–40%. These results show that added visual context did not improve fixed-boundary label accuracy on HomER; error inspection suggests that neighboring actions are often incorporated into current-segment descriptions.",
      "story.label.cap1": "<strong>How to read (3 panels):</strong> left=raw frame; middle=heuristic box (fixed lower-center square, <em>not</em> wrist detection); right=crop fed to the labeler. Failed proxy path—below raw on fixed bounds. See <a href=\"#app-visual\">Appendix E</a>.",
      "story.label.cap2": "<strong>How to read (3 panels):</strong> left=raw; middle=YOLO person box (still not HaWoR-estimated wrist tracks); right=crop the model sees. Early HomER experiments used such proxies; after Gemini rescore, the HaWoR-reconstructed wrist-guided crop reaches 50.9%.",
      "story.label.fold": "Expand: labeling method cards",
      "story.e2e.p": "With S2 segment boundaries fixed, only the semantic labeling path changes. <strong>27B self-label</strong> gives 0.1234. <strong>27B raw relabel</strong> has the highest fixed-boundary Label Acc, but reaches only 0.1285 E2E under predicted boundaries. <strong>397B raw relabel</strong> reaches 0.1414; <strong>ffmpeg raw</strong> and <strong>397B-prior neighbor</strong> both reach 0.1491. <strong>Candidate selector</strong> chooses the final label from multiple candidates and obtains the highest observed score, <strong>0.1542</strong>. This gain should be interpreted together with the additional cost of candidate generation and selector calls.",
      "story.e2e.fold": "Expand: E2E method cards",
      "story.takeaway": "<strong>Takeaways:</strong> chunked request seams introduce pseudo-boundaries; the segmentation-rule prompt defines which completed actions to segment, while local refinement controls boundary granularity; all three rule-based merge strategies lower Segment F1. After Gemini rescore, raw 27B has the highest observed fixed-reference-boundary labeling score, but the highest observed end-to-end result still comes from S2 predicted boundaries + 397B multi-candidate selector. In short, <strong>27B is the best fixed-boundary captioner, but not the best noisy predicted-segment label resolver</strong>. Proxy overlay, neighbor sheets, and proxy hand-collage are not default paths.",
      "th.cond": "Condition",
      "th.model": "Model / method",
      "th.note": "One-line takeaway",
      "th.acc": "Acc",
      "th.matchn": "n_match/n",
      "th.delta": "Δ vs raw",
      "th.remark": "Note",
      "th.segf1": "Seg F1",
      "th.e2ef1": "E2E F1",
      "th.predgold": "pred/gold",
      "recipe.p1.t": "Contact sheet",
      "recipe.p1.d": "0.5s · 224×144 · 20 tiles · yellow stamps",
      "recipe.p2.t": "Coarse cut",
      "recipe.p2.d": "Whole episode + rule list",
      "recipe.p3.t": "Local re-cut",
      "recipe.p3.d": "No pad-out · cover actions · 27B → 0.2031",
      "recipe.p4.t": "Selector",
      "recipe.p4.d": "397B multi-candidate selector → Gemini E2E 0.1542",
      "recipe.th.stage": "Stage",
      "recipe.th.do": "Recommended configuration",
      "recipe.th.dont": "Not currently recommended",
      "recipe.r1.a": "Segmentation",
      "recipe.r1.b": "Qwen3.6-27B + GEPA-derived segmentation prompt + local refinement (no pad-out, cover full actions)",
      "recipe.r1.c": "Chunked max3; rule-based adjacent-segment merging",
      "recipe.r2.a": "Low-cost configuration",
      "recipe.r2.b": "Fixed-reference-boundary diagnostic: 27B raw (Label Acc 55.7%); predicted-boundary E2E low-cost path: 397B raw (0.1414)",
      "recipe.r2.c": "Proxy overlay / neighbor sheets / whole-frame collage / proxy hand-crop as defaults",
      "recipe.r3.a": "High-accuracy configuration",
      "recipe.r3.b": "Same S2 predicted boundaries + multi-candidate generation + 397B selector (Gemini E2E 0.1542)",
      "recipe.r3.c": "Use segment-model self-labels as final labels",
      "recipe.r4.a": "Comparison",
      "recipe.r4.b": "HomER-only vs Macrodata HomER≈0.227",
      "recipe.r4.c": "Direct comparison to the full-100 0.306 headline",
      "appendix.lead": "The body covers what we tried and how scores moved; this appendix spells out implementation details and metric definitions. Contents: <a href=\"#app-metrics\">A metrics</a> · <a href=\"#app-seg\">B segmentation concepts</a> · <a href=\"#app-e2e\">C label/E2E terms</a> · <a href=\"#app-prod\">D production</a> · <a href=\"#app-visual\">E visuals</a> · <a href=\"#app-prompts\">F prompts</a> · <a href=\"#app-cost\">G cost</a> · <a href=\"#audit\">H validity</a>.",
      "metrics.toy.g": "Gold: G0[0,3], G1[3,6], G2[6,10] · Pred: P0[0.5,2.8], P1[2.8,5.5], P2[5.5,8], P3[8,9.5]",
      "metrics.toy.1": "Outer snap: P0.start→0, P3.end→10",
      "metrics.toy.2": "IoU: P0–G0≈0.933, P1–G1≈0.781",
      "metrics.toy.3": "n_match=2 → P=0.50, R≈0.67, F1≈0.571",
      "story.chart.label": "Label accuracy",
      "story.chart.e2e": "E2E F1",
      "walk.s0.hint": "Full-episode preview below. In Step 06, click a timeline bar or table row to play just that clip with its annotation.",
      "walk.s6.clipidle": "No segment selected yet",
      "walk.s6.selected": "Selected",
      "walk.s6.cands": "Candidates",
      "walk.s6.looping": "looping this segment",
      "walk.s6.clickplay": "click again to start looping playback",
      "nav.boundary": "Boundaries",
      "boundary.h2": "3.5 Boundary comparison: three segmentation results on one video",
      "boundary.lead": "Macrodata-style boundary comparison: video on top, multi-track timeline below; the playhead follows playback. Hover for the full label, click to seek. Episode matches the walkthrough (homer_4).",
      "boundary.kicker": "BOUNDARY COMPARISON",
      "boundary.caption": "Models often identify the main action event but miss finer action boundaries. Same episode homer_4 (matching the case study below) vs gold, whole-episode coarse cut, and contact-sheet cut. Hover a block for the full label.",
      "page.title": "EgoANT on WGO-Bench HomER",
      "hero.title": "EgoANT<br />on HomER",
      "hero.grid.aria": "Egocentric human subtask video wall",
      "nav.brand": "EgoANT · Report",
      "references.h2": "References",
      "references.wgo": "Macrodata Labs. (2026). <em>WGO-Bench: What's Going On Benchmark</em>. Hugging Face. <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">https://huggingface.co/datasets/macrodata/WGO-Bench</a>",
      "references.macrodata": "Macrodata Labs. (2026). <em>Segmenting Robot Video into Actionable Subtasks</em>. Macrodata Labs. <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">https://macrodata.co/blog/annotating-robot-video-subtasks</a>",
      "references.gepa": "Agrawal, Lakshya A., Tan, Shangyin, Soylu, Dilara, Ziems, Noah, Khare, Rishi, Opsahl-Ong, Krista, et al. (2026). <em>GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning</em>. arXiv. <a href=\"https://arxiv.org/abs/2507.19457\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2507.19457</a>",
      "references.scale": "Choghari, Jade, Sansone, Agustin, Pasqualis, Nicolas, Mader, Conrado, Tiupikov, Aleks, Sivapurapu, Mouli. (2026). <em>The Path to Large Scale Dense Video Captioning</em>. Scale Labs. <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning</a>",
      "references.vitra": "Li, Qixiu, Deng, Yu, Liang, Yaobo, Luo, Lin, Zhou, Lei, Yao, Chengtang, et al. (2025). <em>VITRA: Scalable Vision-Language-Action Model Pretraining for Robotic Manipulation with Real-Life Human Activity Videos</em>. Project page. <a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">https://microsoft.github.io/VITRA/</a>",
      "references.hawor": "Zhang, Jinglei, Deng, Jiankang, Ma, Chao, Potamias, Rolandos Alexandros. (2025). <em>HaWoR: World-Space Hand Motion Reconstruction from Egocentric Videos</em>. arXiv. <a href=\"https://arxiv.org/abs/2501.02973\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2501.02973</a>",
      "references.egodex": "Hoque, Ryan, Huang, Peide, Yoon, David J., Sivapurapu, Mouli, Zhang, Jian. (2025). <em>EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video</em>. arXiv. <a href=\"https://arxiv.org/abs/2505.11709\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2505.11709</a>",
      "references.egoverse": "EgoVerse Consortium. (2026). <em>EgoVerse: Egocentric Data for Robot Learning from Around the World</em>. Project website. <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">https://egoverse.ai/</a>",
      "references.egolive": "Li, Yihang, Wei, Xuelong, Luo, Jingzhou, Xiao, Yingjing, Bai, Yibo, Zhou, Guangyuan, Zou, Teng, et al. (2026). <em>EgoLive: A Large-Scale Egocentric Dataset from Real-World Human Tasks</em>. arXiv. <a href=\"https://doi.org/10.48550/arXiv.2604.23570\" target=\"_blank\" rel=\"noopener\">https://doi.org/10.48550/arXiv.2604.23570</a>",
      "footer.text": "EgoANT evaluated on WGO-Bench HomER · HomER 25/470 · higher F1 is better"
    },
  };

  const APPENDIX_HTML = {
    zh: `
      <h2>8. 附录：概念、公式、实现与成本记账</h2>
      <p class="plain">正文讲“试了什么、分数怎么变”；附录补清楚公式、术语和实现边界。目录：
        <a href="#app-metrics">A 得分</a> · <a href="#app-seg">B 分段概念</a> ·
        <a href="#app-e2e">C 标注/E2E 术语</a> · <a href="#app-prod">D 生产管线</a> ·
        <a href="#app-visual">E 视觉输入</a> · <a href="#app-prompts">F Prompt</a> ·
        <a href="#app-cost">G 成本</a> · <a href="#audit">H 效度</a>。</p>

      <h3 id="app-metrics">A. 得分方法：直觉 + 公式</h3>
      <figure class="figure">
        <img src="assets/explain/metric_iou_f1.svg" alt="Temporal IoU and F1 scoring diagram" />
      <figcaption>IoU 衡量时间段重叠；<code>m</code> 是通过 IoU 阈值的一对一时间匹配数。</figcaption>
      </figure>
      <h4>A.1 Segment F1（只评时间切分）</h4>
      <p><strong>IoU</strong> 是两个时间段交集长度除以并集长度。若 pred 与 gold 的 IoU ≥ 0.75，就可 greedy 一对一配对；一个 pred 不能匹配多个 gold。</p>
      <pre class="formula">P = m / n_pred
R = m / n_gold
F1 = 2·P·R / (P+R)</pre>
      <p>其中 <code>m</code> 是时间匹配数（temporal matches），也就是 IoU 达标的一对一 pred/gold 配对数；<code>n_pred</code> 是预测段数，<code>n_gold</code> 是人工 gold 段数。Precision 防止乱切太多，Recall 防止漏切太多，F1 用调和平均同时惩罚这两类错误。</p>

      <h4>A.2 固定边界 Label Acc（只评语义描述）</h4>
      <p>时间边界直接使用 gold，只考模型能否把这段动作写成同一个完成事件。</p>
      <pre class="formula">Acc = n_semantically_correct / n_gold</pre>

      <h4>A.3 Semantic E2E F1（时间 + 语义描述）</h4>
      <p>先按 A.1 做时间匹配，再对匹配成功的 pair 做语义 judge；只有时间和句子都对，才进入分子。</p>
      <pre class="formula">m_sem = semantic matches among temporal matches
P_e2e = m_sem / n_pred
R_e2e = m_sem / n_gold
F1_e2e = 2·P_e2e·R_e2e / (P_e2e+R_e2e)</pre>

      <h3 id="app-seg">B. 分段概念卡</h3>
      <figure class="figure">
        <img src="assets/explain/s2_no_pad_full_cover.svg" alt="S2 no-pad full-cover local refinement diagram" />
        <figcaption>S2 的核心不是“再看更多”，而是在粗分窗口内重切，并要求覆盖窗口内完整完成事件。</figcaption>
      </figure>
      <article class="concept-card">
        <h4>欠分割 vs 第一遍加密切（S1）</h4>
        <p><strong>欠分割</strong>是切太少、漏动作；<strong>S1</strong>故意提高切段密度来抬召回，但容易切碎。HomER 上 S1 到 F1 0.1556，pred 558。</p>
      </article>
      <article class="concept-card">
        <h4>第二遍局部精修（S2）</h4>
        <p>粗分之后，在每条粗边界附近开局部时间窗，再用同样的 timestamped contact sheet 细切一次。最终版本使用 <strong>pad=0 + full-cover prompt</strong>，分段 F1 到 0.2031。</p>
      </article>
      <article class="concept-card">
        <h4>窗口不外扩（pad=0）</h4>
        <p>精修窗口只等于粗边界区间，不向两侧多看 0.5/1/2 秒。这样减少邻段动作污染；pad-out 消融都低于 pad=0。</p>
      </article>
      <article class="concept-card">
        <h4>盖住完整动作（full-cover）</h4>
        <p>要求模型把窗口里看得见的完成事件都切出来，但不要把 approach、adjust、retract 拆成假事件。算法式 midpoint 后处理不如把 full-cover 写进 prompt。</p>
      </article>
      <article class="concept-card">
        <h4>切段规则清单（GEPA 搜索得到的 prompt）</h4>
        <p>这里不是新模型，也不是后处理脚本；更准确地说，是 Macrodata 用 GEPA 在验证集上搜索得到的一组英文分段规则。我们复用的是这份规则清单，而不是在本报告里重新运行 GEPA。</p>
      </article>

      <h3 id="app-e2e">C. 标注 / E2E 术语</h3>
      <article class="concept-card"><h4>raw relabel</h4><p>固定边界后，用 397B 看当前段 raw 帧重写一句 subtask。S2 边界 + 单路 raw 的 E2E F1 为 0.1414。</p></article>
      <article class="concept-card"><h4>ffmpeg raw relabel</h4><p>边界相同，只把默认解码/抽帧实现换成 ffmpeg 路径。它不是新的标注策略，而是同一段视频的另一种候选标签来源；实验中略高于默认 raw，因此进入 selector 候选池。</p></article>
      <article class="concept-card"><h4>neighbor relabel</h4><p>给当前段时同时给上一/当前/下一段的帧。这个想法看似能提供上下文，但在 Qwen 上常把邻段动作写进当前句，因此降低标注准确率。</p></article>
      <article class="concept-card"><h4>candidate selector</h4><p>对同一边界生成 raw、ffmpeg、seed、rawprior 等候选，再让 397B 选最像完成操作的一句；Gemini judge 下最高观察 E2E F1 为 0.1542。</p></article>

      <h3 id="app-prod">D. EgoANT 生产原管线（澄清 VITRA）</h3>
      <div class="pipeline">
        <div class="step"><div class="n">01</div><div class="t">HaWoR</div><div class="d">手重建 → wrist 轨迹</div></div>
        <div class="step"><div class="n">02</div><div class="t">Smooth</div><div class="d">腕速滤波</div></div>
        <div class="step"><div class="n">03</div><div class="t">Cut</div><div class="d">速度 minima + 短段合并</div></div>
        <div class="step"><div class="n">04</div><div class="t">Caption</div><div class="d">段内 raw 抽帧写短句</div></div>
        <div class="step"><div class="n">05</div><div class="t">Merge</div><div class="d">judge → rewrite</div></div>
      </div>
      <figure class="figure">
        <img src="assets/explain/wrist_speed_oversegmentation.svg" alt="Wrist-speed minima segmentation schematic" />
        <figcaption>生产默认管线先用 HaWoR 重建左右手腕轨迹，再对腕速做平滑并在速度低谷切段。这个信号很有用，但停顿、微调、放手和收回也会形成低谷，所以容易把一个完成任务切成太多小段。</figcaption>
      </figure>
      <p>VITRA 启发的是“先手部/运动信号，再 caption”的问题设定；本系统实际用 HaWoR wrist-speed 作为生产切段信号，不把 VITRA 当作后端模型。它的主要失败模式是<strong>过分割</strong>：动作中途的犹豫或微调在速度曲线上也像边界，后续 merge judge 虽可合并一部分，但在 WGO 的 IoU 口径下仍会拉低 Segment F1。</p>

      <h3 id="app-visual">E. 视觉输入对照</h3>
      <figure class="figure">
        <img src="assets/explain/visual_input_taxonomy.svg" alt="Visual input taxonomy" />
        <figcaption>这些视觉输入的作用不同：contact sheet 让模型看完整时间轴，用于找边界；raw、proxy overlay、hand-crop、collage 则是在边界已固定时，比较哪种视觉证据更利于写对当前动作。</figcaption>
      </figure>
      <table><thead><tr><th>名称</th><th>模型看见什么</th><th>典型用途</th><th>HomER 上</th></tr></thead><tbody>
        <tr><td>contact sheet</td><td>带时间戳的抽帧拼图</td><td>分段</td><td>主路径</td></tr>
        <tr><td>raw 多帧</td><td>段内均匀原帧</td><td>标注默认</td><td>Gemini Acc 55.7%（27B）/ 50.2%（397B）</td></tr>
        <tr><td>proxy overlay</td><td>原帧 + 光流/启发式叠加提示，不是真手部重建</td><td>标注消融</td><td>Gemini Acc 50.6%（27B）/ 48.5%（397B）</td></tr>
        <tr><td>temporal collage</td><td>past/current/future 整帧格</td><td>标注消融</td><td>Gemini Acc 52.8%（27B）/ 45.1%（397B）</td></tr>
        <tr><td>neighbor sheet</td><td>上一/当前/下一段 sheet</td><td>标注消融</td><td>Gemini Acc 39.6–40.0%（397B）</td></tr>
        <tr><td>HaWoR-reconstructed wrist-guided crop</td><td>按 HaWoR 估计腕轨裁剪手部区域</td><td>标注候选</td><td>Gemini Acc 50.9%</td></tr>
      </tbody></table>

      <h3 id="app-prompts">F. Prompt 原文（English）</h3>
      <p>英文 prompt 全文在样例章折叠区展示，此处保留下载入口。</p>
      <ul>
        <li><a href="#walk-2">GEPA 搜索得到的切段规则</a> · <a href="prompts/gepa_completed_events_duration_prior_v1.md" download>下载</a></li>
        <li><a href="#walk-3">S2 full-cover</a> · <a href="prompts/s2_fullcover_refine.md" download>下载</a></li>
        <li><a href="#walk-4">Labeling</a> · <a href="prompts/labeling_fixed_boundary.md" download>下载</a></li>
        <li><a href="#walk-5">Judge / Selector</a> · <a href="prompts/judge_semantic_match.md" download>judge</a> · <a href="prompts/candidate_selector.md" download>selector</a></li>
      </ul>

      <h3 id="app-cost">G. 成本：估计与公开数字对照</h3>
      <p>Macrodata 公开 E2E batch 约 $2.64/视频小时，segmentation-only batch 约 $0.43/h；本页 Qwen 栈 token 为工程估计；新增 Gemini judge 重判开销另行记录。页面保留结构化比较，不公开内部机器、路径或服务状态。</p>

      <h3 id="audit">H. 实验效度注意事项</h3>
      <table><thead><tr><th>项</th><th>发现</th><th>处理</th></tr></thead><tbody>
        <tr><td>复制目录产物</td><td>不能把文件时间戳接近当作重标证据</td><td>只报告可追溯实验输出</td></tr>
        <tr><td>proxy overlay</td><td>光流/中心框不是真手部重建</td><td>与 HaWoR-reconstructed wrist-guided crop 分开汇报</td></tr>
        <tr><td>neighbor sheet</td><td>补时间戳后仍降低准确率</td><td>结论是上下文设计本身容易污染当前动作描述</td></tr>
      </tbody></table>
    `,
    en: `
      <h2>8. Appendix: concepts, formulas, implementation, and cost accounting</h2>
      <p class="plain">The body explains what we tried and how scores moved. This appendix spells out formulas, terminology, and implementation boundaries. Contents:
        <a href="#app-metrics">A metrics</a> · <a href="#app-seg">B segmentation concepts</a> ·
        <a href="#app-e2e">C labeling/E2E terms</a> · <a href="#app-prod">D production pipeline</a> ·
        <a href="#app-visual">E visual inputs</a> · <a href="#app-prompts">F prompts</a> ·
        <a href="#app-cost">G cost</a> · <a href="#audit">H validity</a>.</p>

      <h3 id="app-metrics">A. Metrics: intuition and formulas</h3>
      <figure class="figure">
        <img src="assets/explain/metric_iou_f1.svg" alt="Temporal IoU and F1 scoring diagram" />
        <figcaption>IoU measures interval overlap; m is the number of one-to-one temporal matches that pass the IoU threshold.</figcaption>
      </figure>
      <h4>A.1 Segment F1: boundary quality only</h4>
      <p><strong>IoU</strong> is the length of the intersection of two time intervals divided by the length of their union. A predicted segment can greedily match one gold segment when IoU is at least 0.75.</p>
      <pre class="formula">P = m / n_pred
R = m / n_gold
F1 = 2·P·R / (P+R)</pre>
      <p><code>m</code> is temporal matches, <code>n_pred</code> is predicted segments, and <code>n_gold</code> is gold segments. Precision penalizes too many cuts; recall penalizes missed cuts; F1 is the harmonic mean that penalizes both.</p>

      <h4>A.2 Fixed-boundary Label Acc: wording only</h4>
      <p>Gold time boundaries are given, so the model is evaluated only on whether the sentence describes the same completed event.</p>
      <pre class="formula">Acc = n_semantically_correct / n_gold</pre>

      <h4>A.3 Semantic E2E F1: time plus wording</h4>
      <p>First match time intervals as in A.1, then judge semantics only for matched pairs. A segment contributes to the numerator only if both time and wording are correct.</p>
      <pre class="formula">m_sem = semantic matches among temporal matches
P_e2e = m_sem / n_pred
R_e2e = m_sem / n_gold
F1_e2e = 2·P_e2e·R_e2e / (P_e2e+R_e2e)</pre>

      <h3 id="app-seg">B. Segmentation concept cards</h3>
      <figure class="figure">
        <img src="assets/explain/s2_no_pad_full_cover.svg" alt="S2 no-pad full-cover local refinement diagram" />
        <figcaption>S2 is not about seeing more context; it re-cuts inside the coarse window and asks the model to cover completed events visible inside that window.</figcaption>
      </figure>
      <article class="concept-card"><h4>Under-segmentation vs S1 denser cuts</h4><p>Under-segmentation means too few cuts and missed actions. S1 increases cut density to raise recall, but can over-fragment. On HomER, S1 reaches F1 0.1556 with 558 predictions.</p></article>
      <article class="concept-card"><h4>S2 local refinement</h4><p>After coarse segmentation, S2 opens a local time window near coarse bounds and re-cuts using the same timestamped contact-sheet layout. The final <strong>pad=0 + full-cover prompt</strong> reaches Segment F1 0.2031.</p></article>
      <article class="concept-card"><h4>No pad-out (pad=0)</h4><p>The refine window equals the coarse interval and does not peek 0.5/1/2 extra seconds on either side. This reduces neighboring-action contamination; all pad-out ablations scored lower than pad=0.</p></article>
      <article class="concept-card"><h4>Full-cover prompt</h4><p>The model must cover every completed event visible in the window, while avoiding fake approach/adjust/retract fragments. Scripted midpoint postprocessing was worse than writing this requirement into the prompt.</p></article>
      <article class="concept-card"><h4>Segmentation rule list (GEPA-searched prompt)</h4><p>This is not a new model and not a postprocess. More precisely, Macrodata used GEPA on a validation set to search for an English rule list. We reuse that rule list; we do not rerun GEPA in this report.</p></article>

      <h3 id="app-e2e">C. Labeling / E2E terms</h3>
      <article class="concept-card"><h4>raw relabel</h4><p>With boundaries locked, Qwen3.5-397B rewrites one subtask label from raw frames inside the current segment. S2 bounds + raw-only relabel gives Gemini E2E F1 0.1414.</p></article>
      <article class="concept-card"><h4>ffmpeg raw relabel</h4><p>Same boundaries, but the decode / frame-sampling implementation is switched to ffmpeg. It is not a new labeling strategy; it is another candidate label source for the same video segment, and it slightly beats the default raw path in this benchmark.</p></article>
      <article class="concept-card"><h4>neighbor relabel</h4><p>The labeler sees previous/current/next segment frames. This looks helpful but often pollutes the current label with neighboring actions, reducing Qwen labeling accuracy on HomER.</p></article>
      <article class="concept-card"><h4>candidate selector</h4><p>Generate raw, ffmpeg, seed, rawprior, and related candidates for the same boundary; Qwen3.5-397B selects the best completed-action label. Current best Gemini-judged E2E F1 is 0.1542.</p></article>

      <h3 id="app-prod">D. EgoANT production pipeline (VITRA clarification)</h3>
      <div class="pipeline">
        <div class="step"><div class="n">01</div><div class="t">HaWoR</div><div class="d">hand reconstruction to wrist tracks</div></div>
        <div class="step"><div class="n">02</div><div class="t">Smooth</div><div class="d">filter wrist speed</div></div>
        <div class="step"><div class="n">03</div><div class="t">Cut</div><div class="d">speed minima plus short-span merge</div></div>
        <div class="step"><div class="n">04</div><div class="t">Caption</div><div class="d">raw frames inside each segment</div></div>
        <div class="step"><div class="n">05</div><div class="t">Merge</div><div class="d">judge then rewrite</div></div>
      </div>
      <figure class="figure">
        <img src="assets/explain/wrist_speed_oversegmentation.svg" alt="Wrist-speed minima segmentation schematic" />
        <figcaption>The production default first reconstructs left/right wrist tracks with HaWoR, smooths wrist speed, and cuts at speed valleys. The signal is useful, but pauses, adjustments, release, and hand retraction can also look like valleys, creating too many segments.</figcaption>
      </figure>
      <p>VITRA motivates the “motion/hand signal first, caption second” framing. EgoANT uses HaWoR wrist-speed signals for production segmentation; it does not use VITRA as a backend model. Its main failure mode is <strong>over-segmentation</strong>: hesitation and small adjustments often look like boundaries in the speed curve. A later merge judge can repair some of this, but the WGO IoU metric still penalizes fragmented boundaries.</p>

      <h3 id="app-visual">E. Visual input comparison</h3>
      <figure class="figure">
        <img src="assets/explain/visual_input_taxonomy.svg" alt="Visual input taxonomy" />
        <figcaption>These inputs serve different purposes: contact sheets expose the timeline for boundary finding; raw frames, proxy overlays, hand crops, and collages compare visual evidence after the boundary is fixed.</figcaption>
      </figure>
      <table><thead><tr><th>Name</th><th>What the model sees</th><th>Typical use</th><th>HomER result</th></tr></thead><tbody>
        <tr><td>contact sheet</td><td>timestamped frame grid</td><td>segmentation</td><td>main path</td></tr>
        <tr><td>raw frames</td><td>uniform frames inside the segment</td><td>default labeling</td><td>Gemini Acc 55.7% (27B) / 50.2% (397B)</td></tr>
        <tr><td>proxy overlay</td><td>raw frames with optical-flow / heuristic marks, not hand reconstruction</td><td>labeling ablation</td><td>Gemini Acc 50.6% (27B) / 48.5% (397B)</td></tr>
        <tr><td>temporal collage</td><td>past/current/future full-frame grids</td><td>labeling ablation</td><td>Gemini Acc 52.8% (27B) / 45.1% (397B)</td></tr>
        <tr><td>neighbor sheet</td><td>previous/current/next segment sheets</td><td>labeling ablation</td><td>Gemini Acc 39.6–40.0% (397B)</td></tr>
        <tr><td>HaWoR-reconstructed wrist-guided crop</td><td>crop around HaWoR-estimated wrist tracks</td><td>label candidate</td><td>Gemini Acc 50.9%</td></tr>
      </tbody></table>

      <h3 id="app-prompts">F. Prompt originals (English)</h3>
      <p>Full English prompts are shown once in the walkthrough folds; downloads remain here.</p>
      <ul>
        <li><a href="#walk-2">GEPA-searched segmentation rules</a> · <a href="prompts/gepa_completed_events_duration_prior_v1.md" download>download</a></li>
        <li><a href="#walk-3">S2 full-cover</a> · <a href="prompts/s2_fullcover_refine.md" download>download</a></li>
        <li><a href="#walk-4">Labeling</a> · <a href="prompts/labeling_fixed_boundary.md" download>download</a></li>
        <li><a href="#walk-5">Judge / Selector</a> · <a href="prompts/judge_semantic_match.md" download>judge</a> · <a href="prompts/candidate_selector.md" download>selector</a></li>
      </ul>

      <h3 id="app-cost">G. Cost: estimates and published numbers</h3>
      <p>Macrodata reports about $2.64/video-hour for batch end-to-end seeded relabeling and about $0.43/h for segmentation-only batch. This page keeps Qwen-stack token numbers as engineering estimates; the added Gemini judge rescore is reported separately. The public version removes internal machines, paths, and service-state details.</p>

      <h3 id="audit">H. Validity notes</h3>
      <table><thead><tr><th>Item</th><th>Observation</th><th>Treatment</th></tr></thead><tbody>
        <tr><td>Copied prediction folders</td><td>Close file timestamps are not evidence of a fresh relabel run</td><td>Only traceable experiment outputs are reported</td></tr>
        <tr><td>proxy overlay</td><td>Optical-flow or center-box proxies are not hand reconstruction</td><td>Reported separately from HaWoR-reconstructed wrist-guided crop</td></tr>
        <tr><td>neighbor sheet</td><td>Adding timestamps did not recover accuracy</td><td>The context design itself appears to pollute the current action description</td></tr>
      </tbody></table>
    `
  };

  function renderAppendix(lang) {
    const el = document.getElementById("appendix");
    if (el) el.innerHTML = APPENDIX_HTML[lang === "en" ? "en" : "zh"];
  }

  function t(key, lang) {
    const L = I18N[lang] || I18N.zh;
    return (L[key] != null ? L[key] : (I18N.zh[key] || key));
  }

  function applyI18n(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    renderAppendix(lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = t(key, lang);
      if (el.tagName === "TITLE") {
        document.title = val.replace(/<[^>]+>/g, "");
        return;
      }
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(key, lang));
    });
    const banner = document.querySelector("#en-body-note");
    if (banner) {
      const msg = t("en.banner", lang);
      banner.hidden = !msg;
      banner.textContent = msg;
    }
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("egoant_lang", lang); } catch (e) {}
    window.__LANG__ = lang;
    if (typeof window.__rerenderCostI18n === "function") window.__rerenderCostI18n();
    if (typeof window.__rerenderHeroI18n === "function") window.__rerenderHeroI18n();
    if (typeof window.__rerenderTablesI18n === "function") window.__rerenderTablesI18n();
    if (typeof window.__rerenderBoundaryI18n === "function") window.__rerenderBoundaryI18n();
  }

  function initI18n() {
    let lang = "zh";
    try { lang = localStorage.getItem("egoant_lang") || "zh"; } catch (e) {}
    try {
      const qLang = new URLSearchParams(window.location.search).get("lang");
      if (qLang === "en" || qLang === "zh") lang = qLang;
    } catch (e) {}
    if (lang !== "en" && lang !== "zh") lang = "zh";
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyI18n(btn.getAttribute("data-lang")));
    });
    applyI18n(lang);
  }

  window.EgoANT_I18N = { I18N, t, applyI18n, initI18n };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initI18n);
  else initI18n();
})();
