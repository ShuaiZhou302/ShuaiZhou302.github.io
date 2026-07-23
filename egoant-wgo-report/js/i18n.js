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
      "hero.lede": "我们在公开 WGO-Bench HomER 子集上评测 EgoANT（Egovideo ANnoTate）。Qwen 栈分段 F1 达 0.2031，对照 Macrodata HomER-only Gemini ≈0.227；Gemini judge 端到端 F1 为 0.1542。",
      "en.banner": "",
      "intro.h2": "导读：为什么要给第一视角人手视频做子任务标注",
      "intro.p1": "Egocentric human data（第一视角人手数据）用头戴或胸挂相机记录人如何操作物体：画面晃、手挡、动作密，和桌面第三人称机器人演示很不一样。要把长程演示变成可学习的监督信号，通常需要切成可执行的原子子任务，并写成短指令。",
      "intro.p2": "子任务边界与文案正在成为 VLA / 链式推理 / 奖励建模等管线的核心输入。人工逐小时标注无法跟上数据规模，因此需要可复现的自动标注管线。",
      "intro.h3": "已有公开工作（地图）",
      "intro.li0": "Egocentric 数据族：<a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">EgoVerse</a> / <a href=\"https://github.com/apple/ml-egodex\" target=\"_blank\" rel=\"noopener\">EgoDex</a> / <a href=\"https://arxiv.org/abs/2604.23570\" target=\"_blank\" rel=\"noopener\">EgoLive</a> 等第一人称人手操作演示，面向规模化 human-to-robot 数据。",
      "intro.li1": "HomER：<a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a> 里的 egocentric human 子集；本报告固定评测 HomER 25 / 470 gold 段。",
      "intro.li2": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a>：把真实人手视频转成 VLA 训练信号的公开工作，启发「先运动/手部信号，再写 caption」的思路；EgoANT 生产线用 HaWoR 腕速实现切段，而非直接跑 VITRA 模型。",
      "intro.li3": "WGO-Bench / <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata 博客</a>：公开「切段 + 短句」评测协议与 Gemini 参考分，以及约 $2.64/视频小时（batch）的端到端开销。",
      "intro.li4": "Scale Labs dense video captioning：在已切好的 clip 上做稠密描述；不做 raw episode 的切段问题。",
      "intro.p3": "本页报告 EgoANT 在 HomER 上、对标 WGO 协议的可复现消融：什么涨分、什么失败、成本如何与公开数字对照。名词解释见后文背景章。",
      "intro.scope": "评测范围：本页分数与推荐配置均锚定 HomER。WGO-Bench 中的 robot 视角子集，以及其他 egocentric 库上的同协议结果尚未在本页报告，留待后续扩展。",
      "tldr.h2": "结论速览",
      "tldr.seg": "整集粗分 + 局部再切（窗口不外扩、盖住完整动作）· Qwen3.6-27B",
      "tldr.label": "raw 27B（Gemini judge 当前最高）/ raw 397B / HaWoR true hand-crop",
      "tldr.e2e": "锁分段边界 + 397B 多候选 selector",
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
      "cost.row.prod": "EgoANT 生产默认路径",
      "cost.row.prod_scope": "同一 HomER 子集上的内部工程估计",
      "cost.row.prod_num": "仅保留聚合调用量级；不公开内部机器、路径或服务状态",
      "cost.recipe.h3": "WGO 两条标注路径（估计 tokens）",
      "cost.th.item": "项",
      "cost.th.raw": "单路 raw（E2E 0.1414）",
      "cost.th.sel": "候选+selector（E2E 0.1542）",
      "cost.dyn.summary": "HomER {n} 集合计 {min} 分钟（均长约 {mean}s）。WGO token 为工程估计；API 次数为产物计数。{extra}",
      "cost.dyn.extra": "",
      "cost.dyn.prod_h3": "生产默认路径：聚合成本说明",
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
      "world.h2": "1. 背景：这些名字分别是什么",
      "world.h3.md": "Macrodata 公开报告在谈什么",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata · Annotating Robot Video Subtasks</a> 把「长视频 → 可执行子任务 + 短句」做成公开问题：发布数据集 <strong>WGO-Bench</strong>、三种分数（分段 / 固定边界标注 / 端到端），以及 Gemini 等参考分。本报告在同一评测协议上，给出 <strong>EgoANT</strong> 的可复现消融：涨分项、失败配置与推荐路径。",
      "world.h3.ego": "Egocentric 数据与 WGO-Bench",
      "world.p.ego": "规模化第一人称人手数据常见族系包括 <strong>EgoVerse / EgoDex / EgoLive</strong> 等；它们提供长程 human 演示，但「如何切成可执行子任务 + 短指令」仍需标注协议与评测。<strong>WGO-Bench</strong> 把这一问题做成公开基准（约 100 个 episode），其中 <strong>HomER</strong> 是第一视角人类操作子集——画面晃、手挡、动作密，通常比桌面第三人称更难。本报告固定评测：<strong>HomER 25 集 / 470 个 gold 子任务段</strong>。Macrodata 全量 100 集 Segment F1≈0.306 是 Gemini 主线 headline；HomER-only 更公平的对照约 0.227。不宜与全量 100 集 headline（0.306）直接对比。同协议下其他子集的结果见导读范围声明。",
      "world.h3.egoant": "EgoANT：生产默认 vs 本报告实验线",
      "world.p.egoant": "<strong>EgoANT</strong> 是我们的 egocentric 人手视频自动标注系统。它有两条需要分清的路径：",
      "world.li.prod": "<strong>生产默认管线</strong>（日常批标）：HaWoR 手重建 → 腕速平滑与 minima 切段 → 段内 raw 抽帧写短句 → merge judge / rewrite。细节见 <a href=\"#app-prod\">附录 D</a>。启发来自 Vitra 一类「先运动再 caption」工作流，但<strong>切段后端是 HaWoR 腕速，不是 Vitra 模型</strong>。",
      "world.li.wgo": "<strong>本报告 WGO 实验线</strong>（对标 Macrodata）：contact sheet + Qwen 视觉语言模型切段 → 锁边界后标注 / 多候选 selector。正文消融主要讲这条线。",
      "world.p.models": "模型栈以 <strong>Qwen</strong> 为主：分段用 <strong>Qwen3.6-27B</strong>（快、便宜、可复现），标注 / judge / selector 用 <strong>Qwen3.5-397B</strong>（句子质量与选优）。相对 Gemini 参考栈，同一套权重与 prompt 可在不同机器上复跑，消融结论可核对。",
      "world.h3.gepa": "GEPA 在本文里指什么",
      "world.gepa.1": "<strong>GEPA 本身</strong>：一种 reflective prompt evolution 方法。Macrodata 博客中说明，他们用 GEPA 在独立验证集上搜索更好的分段 prompt。",
      "world.gepa.2": "<strong>我们实际复用的东西</strong>：搜索结果沉淀下来的<strong>切段规则清单</strong>（英文 prompt；内部名 <code>completed_events_duration_prior_v1</code>）。",
      "world.gepa.3": "<strong>因此本文不把 GEPA 当作运行时模块</strong>：我们没有重新跑 GEPA，也没有把 GEPA 当模型或后处理脚本；只是把那组规则写进 VLM 请求文本。",
      "world.gepa.4": "<strong>怎么用</strong>：整集 contact sheet 图像 + 这段英文规则 → 一次粗分。规则要求只标完成事件、偏好约 2–10 秒、忽略靠近/微调/收回等非完成事件。样例 Step 02 折叠区为英文全文；概念与实现见 <a href=\"#app-seg\">附录 B</a>，原文下载见 <a href=\"#app-prompts\">附录 F</a>。",
      "world.h3.terms": "后面会反复出现的几个词",
      "world.term.1": "<strong>时间窗口</strong>：视频时间轴上的一段连续区间（例如 84–94 秒），不是软件 UI 窗口。",
      "world.term.2": "<strong>第一遍加密切（S1）</strong>：提高切段密度以抬召回（容易切碎）。详见 <a href=\"#app-seg\">附录 B</a>。",
      "world.term.3": "<strong>第二遍局部精修（S2）</strong>：在粗边界附近的一小段时间里再切一次。",
      "world.term.4": "<strong>窗口不外扩（pad=0）</strong>：精修时只看粗边界这段，不向两侧多「偷看」几秒。",
      "world.term.5": "<strong>盖住完整动作（full-cover）</strong>：这段里看得见的完成事件都要切到，别切成摆弄碎片。",
      "world.term.6": "<strong>selector / judge</strong>：selector 从多条候选标签里选一句定稿；judge 只用于打分，判断预测句与 gold 是否同一完成事件。",
      "world.term.7": "<strong>HaWoR</strong>：手部重建，用来得到真手腕轨迹再做 hand-crop（贵；默认标注仍可用 raw 帧）。",
      "world.term.8": "<strong>Qwen3.6-27B</strong>：分段主模型（日志有时写作 28B endpoint，同一服务）；<strong>Qwen3.5-397B</strong>：标注 / judge / selector。",
      "world.callout": "<strong>易混淆的视觉输入：</strong> contact sheet（分段用时间戳拼图）≠ 整帧 temporal collage ≠ L1 邻段 sheet ≠ L2 YOLO/proxy hand-collage ≠ HaWoR true hand-crop。",
      "metrics.h2": "2. 怎么打分（三句话 + 一个玩具例子）",
      "metrics.lead": "完整公式与直觉见 <a href=\"#app-metrics\">附录 A</a>。正文只记定义与玩具例。",
      "metrics.li1": "<strong>Segment F1</strong>：只评时间切分（刀工）；IoU≥0.75 一对一配对。",
      "metrics.li2": "<strong>固定边界 Label Acc</strong>：时间用 gold，只评句子是否同一完成事件（文案）。",
      "metrics.li3": "<strong>Semantic E2E F1</strong>：先时间配对，再对配对成功的 pair 做语义 judge；刀工与文案都过才算。",
      "metrics.toy": "F1 越大越好，上限 1.0。玩具例子（与 scorer 一致）：",
      "metrics.figcap": "本地图示：先用 IoU 判断 pred/gold 时间段是否重叠足够，再用 match 数计算 precision、recall 和 F1。",
      "legend.gold": "Gold / 人工标注",
      "legend.pred": "Pred / 模型预测",
      "legend.coarse": "Whole-episode coarse",
      "legend.contact": "Contact-sheet prediction",
      "contact.h2": "3. Contact sheet：模型实际在「看」什么",
      "contact.p": "我们不把整段 MP4 作为视觉输入直接提交给模型，而是每隔 <strong>0.5 秒</strong>抽一帧，缩到约 <strong>224×144</strong>，每张 sheet <strong>20 格（5×4）</strong>，格子上画<strong>黄色时间戳</strong>。一张 sheet 大约覆盖 10 秒；一集长视频会拆成多张 sheet。",
      "contact.cap1": "同参数生成的一张 sheet（前 ~10 秒）。全片与局部时间窗口都用这一套 layout。",
      "contact.cap2": "局部时间窗口示例：版式相同，只换时间范围（第二遍精修看这种图）。",
      "contact.taxonomy.cap": "本地图示：raw、多帧 overlay、temporal collage、邻段 sheet、hand crop 是不同视觉输入；它们在实验中不可互相代称。",
      "contact.taxonomy.explain": "<strong>读图：</strong>contact sheet 用来找边界；raw 是固定边界标注的最朴素输入；proxy overlay 是在原帧上叠加光流/启发式提示，<em>不是</em>真手部重建；temporal collage 与 neighbor sheet 给前后文；true hand-crop 则依赖可靠腕轨。Gemini 重评显示：更多视觉上下文不一定更好，overlay、邻段和整帧 collage 往往把别的动作带进当前句子。",
      "walk.h2": "4. 样例：跟着 homer_4 走读 selector 路径",
      "walk.lead": "下列走读为 <strong>selector 路径</strong>（宽屏 1080p、擦桌子动作清楚）；生产可在同边界下改用单路 raw。任务：用布擦桌面 / 柜面。折叠内 Prompt 为英文原文。",
      "story.h2": "6. 消融故事：我们怎样走到 0.1542",
      "story.lead": "按时间线叙述；主表与图跟在后面。实验细节（做法卡、窗口外扩消融）默认折叠。",
      "story.h3.seg": "6.1 分段：从假切点到「盖住完整动作」",
      "story.h3.label": "6.2 标注：复杂视觉输入不一定提高准确率",
      "story.h3.e2e": "6.3 E2E：锁边界，涨分靠大模型多候选",
      "recipe.h2": "7. 推荐配置",
      "appendix.h2": "8. 附录：概念、公式、实现与成本记账",
      "tldr.k.label": "Label Acc（固定边界）",
      "intro.vs": "<strong>Qwen 栈接近 Gemini 参考（HomER 口径）：</strong>EgoANT 分段 F1 <strong>0.2031</strong>，对照 Macrodata HomER-only Gemini ≈<strong>0.227</strong>（同一子集；不要拿全量 0.306 硬比）。端到端本页 <strong>0.1542</strong>（公开 blog 全量 E2E≈0.168 为不同子集，只作量级对照）。固定边界标注 Qwen 栈 Gemini judge 下 raw 27B 为 55.7%，raw 397B / HaWoR hand-crop 约 50.2–50.9% vs Macrodata 公开 ≈61%——句子质量仍有差距。<em>结论：最难 egocentric 子集上，我们的切段已接近 Gemini 参考；端到端与文案仍有空间。</em>",
      "walk.score": "<strong>本集成绩：</strong>gold 15 / pred 11；IoU≥0.75 匹配 4；语义匹配 3；本集 E2E≈0.231（全集 HomER micro 仍是 0.1542）。",
      "walk.task": "任务指令：",
      "walk.s0.t": "输入视频",
      "walk.s1.t": "生成 contact sheet",
      "walk.s1.p": "参数与上一节相同。模型后续只看这些带时间戳的拼图，而不是原始 MP4 字节流。",
      "walk.s1.note": "下方为首张 sheet 示例（同参数）。",
      "walk.s2.t": "粗分：整集一次 + 切段规则清单",
      "walk.s2.p": "把该集尽量多的 sheet 一次送给分段模型，并在请求文本里贴上<strong>切段规则清单</strong>（GEPA 搜索得到的英文规则：只标完成事件、偏好约 2–10 秒等——见下方折叠全文）。这样能消灭「分片接缝假切点」，但容易切太少（欠分割）。",
      "walk.s3.t": "局部再切一遍：窗口不外扩，盖住完整动作",
      "walk.s3.p": "在粗边界附近开一个<strong>短时间窗</strong>，用<strong>同一版式</strong>的 sheet 再切一次。<strong>窗口不外扩</strong>：只看粗边界这段，不向两侧多偷看几秒（技术名 pad=0）；<strong>盖住完整动作</strong>：窗内看得见的完成事件都要切到，别切成摆弄碎片（技术名 full-cover）。（整步技术名：S2 · pad=0 · full-cover）",
      "walk.s3.cap": "局部时间窗 contact sheet（第二遍精修输入）。",
      "walk.s3.diagram.cap": "本地图示：S2 只在粗分窗口内重切；pad=0 避免看进邻段，full-cover 要求窗口内完成动作都被覆盖。",
      "walk.s4.t": "多候选标注",
      "walk.s4.p": "边界锁死后，对每一段用多条路径各写一句：<strong>raw</strong>=默认读帧；<strong>ffmpeg</strong>=换解码抽帧路径；<strong>seed</strong>=带先验/种子标签的变体；<strong>rawprior</strong>=带 prior 的 raw。下表是本集一段真实候选：意见不一致时，selector 才有价值。",
      "walk.s5.t": "Candidate selector 定稿",
      "walk.s5.p": "用 Qwen3.5-397B 从候选里挑一句最像「完成操作」的短指令。",
      "walk.s6.t": "点选 pred 段：看视频 + 标注",
      "walk.s6.p": "这里只走 <strong>selector 预测轨</strong>（点色块或表格行 → 右侧播该段、左侧看标注）。与 gold / 整集粗分 / contact sheet 的<strong>多轨边界对照</strong>见上方 <a href=\"#boundary\">§3.5</a>，不再重复画 gold 时间轴。",
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
      "story.seg.2": "Contact sheet <strong>分片</strong>（max_sheets=3，每次最多送 3 张）：外形接近公开报告做法，但接缝处造假边界。",
      "story.seg.3": "<strong>整集一次</strong> + 旧版 prompt（尚无切段规则清单）：假切点没了，却欠分割。",
      "story.seg.4": "换成 <strong>切段规则清单</strong>（GEPA）：到 0.137，仍偏少。",
      "story.seg.5": "<strong>第一遍加密切（S1）</strong>：召回上升，但过分割。",
      "story.seg.6": "<strong>第二遍局部精修</strong>：方向对；最终 <strong>窗口不外扩 + 盖住完整动作</strong>（S2 · pad=0 · full-cover）到 <strong>0.2031</strong>。（另测过用算法补覆盖的后处理：不如把「盖住完整动作」写进 prompt。）",
      "story.seg.7": "相邻 merge 三种<strong>规则后处理</strong>（不是再调模型）：时间轴更好看，但 F1 全掉——不要默认 merge。",
      "story.chart.seg": "Segment F1（主路径）",
      "story.seg.legend": "表头：<strong>P（Precision）</strong>= match / pred（预测段里配对成功的比例）；<strong>R（Recall）</strong>= match / gold（gold 段被找回的比例）；<strong>match / pred / gold</strong>= 配对成功数 / 预测段数 / gold 段数（本子集 gold 恒为 470）。「模型」列若写<strong>规则后处理</strong>，表示在已有预测上做脚本合并，不再调用 LLM。",
      "story.seg.padnote": "窗口外扩秒数（旧称 pad）的消融未进入主决策路径；细节见折叠区。",
      "story.seg.fold": "展开：分段实验细节",
      "story.label.p": "固定 gold 边界后，Gemini judge 全量重判改变了排序：<strong>raw 27B 最高，为 55.7%</strong>；temporal collage 27B 为 52.8%，proxy overlay 27B 为 50.6%，HaWoR true hand-crop 397B 为 50.9%，raw 397B 为 50.2%。397B 上，overlay 48.5%、temporal collage 45.1%、neighbor / proxy hand-collage 约 39–40%。结论很朴素：在 HomER 这个子集上，复杂视觉输入常常污染当前动作描述；先固定 judge，再讨论输入设计。",
      "story.label.cap1": "<strong>读图（三栏）：</strong>左=原帧；中=启发式框（画面中心偏下固定方框，<em>不是</em>手腕检测）；右=裁出后送给标注模型的图。这是失败的 proxy 路径示意。固定边界上这类输入低于 raw。详见 <a href=\"#app-visual\">附录 E</a>。",
      "story.label.cap2": "<strong>读图（三栏）：</strong>左=原帧；中=YOLO person 框（仍非 HaWoR 腕轨）；右=模型实际看到的 crop。HomER 早期无手重建时用此类 proxy；Gemini 重判后 HaWoR true hand-crop 为 50.9%，低于 raw 27B。",
      "story.label.fold": "展开：标注实验细节（做法卡）",
      "story.e2e.p": "分段锁在 0.2031 后，只改标注路径（时间 match 数不变，变的是语义 match）。<strong>27B 自标</strong>为 0.1234；<strong>27B raw 重标</strong>虽然固定边界 Label Acc 最高，但接到预测边界后 E2E 只有 0.1285；<strong>397B raw 重标</strong>到 0.1414；<strong>ffmpeg raw</strong>和<strong>397B-prior neighbor</strong>都到 0.1491；<strong>candidate selector</strong>从多路候选里选一句，Gemini E2E 最高，为 <strong>0.1542</strong>。",
      "story.e2e.fold": "展开：E2E 实验细节（做法卡）",
      "story.takeaway": "<strong>要点：</strong>分片 contact sheet 易在接缝造假切点；切段规则定「切什么」、局部精修（盖住完整动作）定「切多细」；规则 merge 改善观感但没有提升 F1；Gemini 重评后，raw 27B 是固定边界标注最高分，但端到端最高仍是 S2 边界 + 397B 多候选 selector；overlay、邻段和粗糙 hand-collage 目前都不该默认启用。",
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
      "recipe.p4.d": "397B 多候选 → Gemini E2E 0.1542",
      "recipe.th.stage": "阶段",
      "recipe.th.do": "推荐",
      "recipe.th.dont": "不要默认启用",
      "recipe.r1.a": "分段",
      "recipe.r1.b": "Qwen3.6-27B + 切段规则清单 + 局部精修（窗口不外扩、盖住完整动作）",
      "recipe.r1.c": "分片 max3；盲目规则 merge",
      "recipe.r2.a": "标注（省钱）",
      "recipe.r2.b": "固定 gold 边界文案优先：27B raw（Label Acc 55.7%）；预测边界 E2E 省钱线：397B raw（0.1414）",
      "recipe.r2.c": "proxy overlay / 邻段 / 整帧 collage / proxy hand-crop 默认启用",
      "recipe.r3.a": "标注（追分）",
      "recipe.r3.b": "同上边界 + 多候选 + 397B selector（Gemini E2E 0.1542）",
      "recipe.r3.c": "分段小模型自标当终稿",
      "recipe.r4.a": "对照",
      "recipe.r4.b": "HomER-only vs Macrodata HomER≈0.227",
      "recipe.r4.c": "用全量 0.306 headline 直接对比",
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
      "boundary.h2": "3.5 边界对照：同一段视频，三种切法",
      "boundary.lead": "对齐 Macrodata 博客的 Boundary comparison：上方视频，下方多轨时间轴；播放头随播放移动。悬停看完整标注，点击跳到该段。集号与样例走读一致（homer_4）。",
      "boundary.kicker": "边界对照",
      "boundary.caption": "模型常能叫出粗事件，却漏掉更细的子任务边界。同集 homer_4（与下方样例走读一致）对照：人工 gold、整集粗分、contact sheet 粗分。悬停色块可看完整标注。",
      "page.title": "标注第一视角人手数据 · EgoANT × HomER",
      "hero.title": "EgoANT<br />评测 HomER",
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
      "hero.lede": "We evaluate EgoANT (Egovideo ANnoTate) on the public WGO-Bench HomER subset. The Qwen stack reaches Segment F1 0.2031 vs Macrodata HomER-only Gemini ≈0.227; Gemini-judged end-to-end F1 is 0.1542.",
      "en.banner": "",
      "intro.h2": "Why annotate egocentric human video into subtasks",
      "intro.p1": "Egocentric human data records first-person hand–object interaction: shake, occlusion, and dense actions—quite unlike third-person robot demos. Turning long episodes into learnable supervision usually means cutting atomic executable subtasks and writing short imperative labels.",
      "intro.p2": "Subtask boundaries and labels are becoming central inputs for VLAs, chain-of-thought, and reward modeling. Hourly human labeling cannot keep up with scale, so we need reproducible automatic pipelines.",
      "intro.h3": "Related public work (a map)",
      "intro.li0": "Egocentric data families such as <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">EgoVerse</a>, <a href=\"https://github.com/apple/ml-egodex\" target=\"_blank\" rel=\"noopener\">EgoDex</a>, and <a href=\"https://arxiv.org/abs/2604.23570\" target=\"_blank\" rel=\"noopener\">EgoLive</a> provide first-person human manipulation demonstrations at scale.",
      "intro.li1": "HomER is the egocentric human subset inside <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a>; this report evaluates HomER 25 / 470 gold segments.",
      "intro.li2": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a> is a public line of work on turning real human-hand videos into VLA training signals; it motivates “motion/hand signal first, caption second,” but EgoANT does not use VITRA as the segmentation backend.",
      "intro.li3": "WGO-Bench / <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata blog</a>: public segment+label protocol, Gemini reference scores, and ~$2.64/video-hour (batch) end-to-end cost.",
      "intro.li4": "Scale Labs dense video captioning: captions on already-cut clips—not raw-episode segmentation.",
      "intro.p3": "This page reports EgoANT ablations on HomER under the WGO protocol: what lifts scores, what fails, and how cost compares to the published numbers. Glossary follows in Background.",
      "intro.scope": "Scope: scores and recipes on this page are HomER-anchored. Same-protocol results on WGO robot-view subsets and other egocentric corpora are not reported here yet.",
      "tldr.h2": "Key results",
      "tldr.seg": "Whole-episode coarse + local re-cut (no pad-out, cover full actions) · Qwen3.6-27B",
      "tldr.label": "raw 27B (Gemini judge best) / raw 397B / HaWoR true hand-crop",
      "tldr.e2e": "Locked boundaries + 397B multi-candidate selector",
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
      "world.h2": "1. Background: names you’ll see",
      "world.h3.md": "What Macrodata’s public report covers",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata · Annotating Robot Video Subtasks</a> frames “long video → executable subtasks + short labels” as a public problem: the <strong>WGO-Bench</strong> dataset, three scores (segmentation / fixed-boundary labeling / end-to-end), and Gemini reference numbers. On the same protocol we report reproducible <strong>EgoANT</strong> ablations: what lifts scores, what fails, and recommended paths.",
      "world.h3.ego": "Egocentric data and WGO-Bench",
      "world.p.ego": "Large-scale first-person hand data families include <strong>EgoVerse / EgoDex / EgoLive</strong>: long human demos, but cutting executable subtasks + short instructions still needs a labeling protocol and a benchmark. <strong>WGO-Bench</strong> makes that public (~100 episodes). <strong>HomER</strong> is the egocentric human subset—shake, occlusion, dense actions—usually harder than third-person tabletop. This report fixes eval to <strong>HomER 25 episodes / 470 gold segments</strong>. Macrodata’s full-100 Segment F1≈0.306 is a Gemini headline; HomER-only ≈0.227 is the fairer reference. Do not compare directly to 0.306. Same-protocol results on other subsets: see the scope note in Intro.",
      "world.h3.egoant": "EgoANT: production default vs this report’s WGO line",
      "world.p.egoant": "<strong>EgoANT</strong> is our automatic egocentric hand-video annotation system. Keep two paths separate:",
      "world.li.prod": "<strong>Production default</strong> (batch labeling): HaWoR hand recon → wrist-speed smoothing + minima cuts → raw-frame captions → merge judge / rewrite. Details in <a href=\"#app-prod\">Appendix D</a>. Inspired by Vitra-style “motion then caption,” but the <strong>cut backend is HaWoR wrist speed, not the Vitra model</strong>.",
      "world.li.wgo": "<strong>This report’s WGO experimental line</strong> (aligned to Macrodata): contact sheets + open VLM segmentation → locked-boundary labeling / multi-candidate selector. Body ablations mainly cover this line.",
      "world.p.models": "The stack is <strong>Qwen</strong>: segmentation with <strong>Qwen3.6-27B</strong> (fast, cheap, reproducible); labeling / judge / selector with <strong>Qwen3.5-397B</strong> (sentence quality + selection). Compared with the Gemini reference stack, the same weights and prompts can be re-run elsewhere to audit ablation claims.",
      "world.h3.gepa": "What GEPA is (definition)",
      "world.gepa.1": "<strong>GEPA itself</strong>: Macrodata’s method for <strong>automatically searching better prompts</strong>. We did <strong>not</strong> re-run GEPA at inference for this report.",
      "world.gepa.2": "<strong>What we actually use</strong>: a distilled <strong>segmentation rule list</strong> (English prompt; internal name <code>completed_events_duration_prior_v1</code>).",
      "world.gepa.3": "<strong>In practice</strong>: hard rules inside the VLM <strong>text prompt</strong>—cut only completed manipulation events, prefer ~2–10s segments, avoid approach/adjust/retract fake events, don’t merge distinct pick/place events. <em>Not a new model, not a post-processing script.</em>",
      "world.gepa.4": "<strong>How we use it</strong>: whole-episode contact sheets + these English rules → one coarse pass. Walkthrough Step 02 folds the English prompt; concepts in <a href=\"#app-seg\">Appendix B</a>, downloads in <a href=\"#app-prompts\">Appendix F</a>.",
      "world.h3.terms": "Terms that recur",
      "world.term.1": "<strong>Time window</strong>: a contiguous interval on the video timeline (e.g. 84–94s)—not a UI window.",
      "world.term.2": "<strong>Pass-1 denser cuts (S1)</strong>: raise cut density to lift recall (easy to over-cut). See <a href=\"#app-seg\">Appendix B</a>.",
      "world.term.3": "<strong>Pass-2 local refine (S2)</strong>: re-cut once inside a short window near coarse bounds.",
      "world.term.4": "<strong>No pad-out (pad=0)</strong>: refine only inside the coarse span—do not peek extra seconds on either side.",
      "world.term.5": "<strong>Cover full actions (full-cover)</strong>: cut every completed event visible in the window; do not shred into fiddle fragments.",
      "world.term.6": "<strong>selector / judge</strong>: selector picks one final label among candidates; judge only scores whether pred and gold are the same completed event.",
      "world.term.7": "<strong>HaWoR</strong>: hand reconstruction for true wrist tracks / hand-crop (expensive; default labeling can still use raw frames).",
      "world.term.8": "<strong>Qwen3.6-27B</strong>: main segmentation model (logs sometimes say 28B endpoint—same service); <strong>Qwen3.5-397B</strong>: labeling / judge / selector.",
      "world.callout": "<strong>Easy-to-confuse visual inputs:</strong> contact sheet (timestamp collage for segmentation) ≠ whole-frame temporal collage ≠ L1 neighbor sheets ≠ L2 YOLO/proxy hand-collage ≠ HaWoR true hand-crop.",
      "metrics.h2": "2. Scoring (three lines + a toy example)",
      "metrics.lead": "Full formulas live in <a href=\"#app-metrics\">Appendix A</a>. Here: definitions + a toy case.",
      "metrics.li1": "<strong>Segment F1</strong>: time cuts only; IoU≥0.75 one-to-one matching.",
      "metrics.li2": "<strong>Fixed-boundary Label Acc</strong>: gold times; judge whether sentences describe the same completed event.",
      "metrics.li3": "<strong>Semantic E2E F1</strong>: time match first, then semantic judge on matched pairs; both must pass.",
      "metrics.toy": "Higher F1 is better (max 1.0). Toy example (matches the scorer):",
      "metrics.figcap": "Local diagram: IoU first checks whether pred/gold time intervals overlap enough; match counts then become precision, recall, and F1.",
      "legend.gold": "Gold / human annotation",
      "legend.pred": "Pred / model prediction",
      "legend.coarse": "Whole-episode coarse",
      "legend.contact": "Contact-sheet prediction",
      "contact.h2": "3. Contact sheet: what the model actually sees",
      "contact.p": "We do not feed raw MP4 bytes as vision input. We sample a frame every <strong>0.5s</strong>, resize to ~<strong>224×144</strong>, pack <strong>20 tiles (5×4)</strong> per sheet with <strong>yellow timestamps</strong>. One sheet ≈10s; long episodes become many sheets.",
      "contact.cap1": "One sheet with the same params (first ~10s). Whole-episode and local windows share this layout.",
      "contact.cap2": "Local time-window example: same layout, different range (what pass-2 refine sees).",
      "contact.taxonomy.cap": "Local diagram: raw frames, proxy overlays, temporal collages, neighbor sheets, and hand crops are distinct visual inputs and should not be used interchangeably.",
      "contact.taxonomy.explain": "<strong>How to read it:</strong> contact sheets expose the timeline for boundary finding. Raw frames are the simplest fixed-boundary labeling input. Proxy overlay means raw frames with optical-flow or heuristic marks, <em>not</em> true hand reconstruction. Temporal collages and neighbor sheets add context. True hand-crop needs reliable wrist tracks. The Gemini rescore shows that richer context is not automatically better: overlay, neighbor sheets, and full-frame collages often import the wrong action into the current label.",
      "walk.h2": "4. Walkthrough: homer_4 along the selector path",
      "walk.lead": "This walkthrough is the <strong>selector path</strong> (widescreen 1080p, clear wipe motion); production can use raw-only on the same bounds. Task: wipe tables / cabinet surfaces with a cloth. Folded prompts stay English originals.",
      "story.h2": "6. Ablation story: how we reached 0.1542",
      "story.lead": "Told in timeline order; main tables/plots follow. Method cards and pad-out ablations stay folded by default.",
      "story.h3.seg": "6.1 Segmentation: from fake cuts to “cover full actions”",
      "story.h3.label": "6.2 Labeling: many “smarter-looking” visuals hurt",
      "story.h3.e2e": "6.3 E2E: lock boundaries; gains from multi-candidate large models",
      "recipe.h2": "7. Recommended recipe",
      "appendix.h2": "8. Appendix: concepts, formulas, implementation, cost accounting",
      "tldr.k.label": "Label Acc (fixed boundaries)",
      "intro.vs": "<strong>Qwen stack approaches the Gemini reference on HomER:</strong> EgoANT Segment F1 <strong>0.2031</strong> vs Macrodata HomER-only Gemini ≈<strong>0.227</strong> (same subset—do not hard-compare to full-100 0.306). This page’s Gemini-judged E2E is <strong>0.1542</strong> (public blog full-set E2E≈0.168 is a different scope—magnitude only). Fixed-boundary labels now use the same Gemini judge: raw 27B reaches <strong>55.7%</strong>, while raw 397B / HaWoR hand-crop are about 50.2–50.9%, vs Macrodata public ≈61%. <em>Takeaway: on the hardest egocentric subset, boundary detection is close to the Gemini reference; E2E and wording still have room.</em>",
      "walk.score": "<strong>Episode score:</strong> gold 15 / pred 11; IoU≥0.75 matches 4; semantic matches 3; episode E2E≈0.231 (HomER micro overall stays 0.1542).",
      "walk.task": "Task instruction:",
      "walk.s0.t": "Input video",
      "walk.s1.t": "Build contact sheets",
      "walk.s1.p": "Same parameters as above. The model only sees these timestamped collages—not raw MP4 bytes.",
      "walk.s1.note": "First sheet example below (same params).",
      "walk.s2.t": "Coarse cut: whole episode + segmentation rule list",
      "walk.s2.p": "Send as many sheets as practical in one call, with a <strong>segmentation rule list</strong> in the text (GEPA-searched English rules: completed events only, prefer ~2–10s—see folded full text). That removes fake cuts at chunk seams, but can under-segment.",
      "walk.s3.t": "Local re-cut: no pad-out, cover full actions",
      "walk.s3.p": "Open a <strong>short window</strong> near coarse bounds and re-cut with the <strong>same sheet layout</strong>. <strong>No pad-out</strong>: stay inside the coarse span (tech: pad=0). <strong>Cover full actions</strong>: include completed events visible in-window; don’t shred into fiddle fragments (tech: full-cover). (Step tech name: S2 · pad=0 · full-cover)",
      "walk.s3.cap": "Local-window contact sheet (pass-2 refine input).",
      "walk.s3.diagram.cap": "Local diagram: S2 re-cuts only inside the coarse window; pad=0 avoids neighboring actions, and full-cover asks the model to cover every completed action inside the window.",
      "walk.s4.t": "Multi-candidate labeling",
      "walk.s4.p": "With bounds locked, write one label per path: <strong>raw</strong>=default frames; <strong>ffmpeg</strong>=alternate decode/sample; <strong>seed</strong>=seeded/prior variant; <strong>rawprior</strong>=raw with prior. Table below is a real divergent segment—selector matters when paths disagree.",
      "walk.s5.t": "Candidate selector picks the final line",
      "walk.s5.p": "Qwen3.5-397B picks the short instruction that best names a completed manipulation.",
      "walk.s6.t": "Pick a pred segment: video + label",
      "walk.s6.p": "This step is the <strong>selector pred track only</strong> (click a bar or row → clip on the right, label on the left). Multi-track gold / whole-episode / contact-sheet comparison lives in <a href=\"#boundary\">§3.5</a>—no duplicate gold timeline here.",
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
      "story.seg.2": "Contact sheet <strong>chunking</strong> (max_sheets=3): looks like the public recipe, but invents fake boundaries at seams.",
      "story.seg.3": "<strong>Whole-episode</strong> + legacy prompt (no rule list): fake cuts gone, but under-segments.",
      "story.seg.4": "Swap in the <strong>segmentation rule list</strong> (GEPA): ~0.137, still too few cuts.",
      "story.seg.5": "<strong>Pass-1 denser cuts (S1)</strong>: recall up, over-segmentation.",
      "story.seg.6": "<strong>Pass-2 local refine</strong>: right direction; final <strong>no pad-out + cover full actions</strong> (S2 · pad=0 · full-cover) reaches <strong>0.2031</strong>. (Algorithmic cover postprocess was worse than writing cover into the prompt.)",
      "story.seg.7": "Three <strong>rule merges</strong> on adjacent preds (no extra LLM): prettier timelines, but F1 drops—don’t enable by default.",
      "story.chart.seg": "Segment F1 (main path)",
      "story.seg.legend": "Headers: <strong>P (Precision)</strong>= match / pred; <strong>R (Recall)</strong>= match / gold; <strong>match / pred / gold</strong>= counts (gold fixed at 470 here). If the model column says <strong>rule postprocess</strong>, it means scripted merges on existing preds—no LLM call.",
      "story.seg.padnote": "Pad-out second ablations are not on the main decision path; details stay folded.",
      "story.seg.fold": "Expand: segmentation details",
      "story.label.p": "With gold boundaries fixed, the full Gemini rescore changes the ranking: <strong>raw 27B is best at 55.7%</strong>; temporal collage 27B reaches 52.8%, proxy overlay 27B 50.6%, HaWoR true hand-crop 397B 50.9%, and raw 397B 50.2%. On 397B, overlay drops to 48.5%, temporal collage to 45.1%, and neighbor / proxy hand-collage stays around 39–40%. The lesson is simple: on HomER, richer visual inputs often pollute the current-action label; fix the judge before judging input design.",
      "story.label.cap1": "<strong>How to read (3 panels):</strong> left=raw frame; middle=heuristic box (fixed lower-center square, <em>not</em> wrist detection); right=crop fed to the labeler. Failed proxy path—below raw on fixed bounds. See <a href=\"#app-visual\">Appendix E</a>.",
      "story.label.cap2": "<strong>How to read (3 panels):</strong> left=raw; middle=YOLO person box (still not HaWoR wrists); right=crop the model sees. Early HomER used such proxies; Gemini-rescored HaWoR true hand-crop is 50.9%.",
      "story.label.fold": "Expand: labeling method cards",
      "story.e2e.p": "After locking segmentation at 0.2031, only the labeling path changes (time matches stay fixed; semantic matches move). <strong>27B self-label</strong> gives 0.1234. <strong>27B raw relabel</strong> wins fixed-boundary Label Acc, but reaches only 0.1285 E2E on predicted S2 bounds. <strong>397B raw relabel</strong> reaches 0.1414; <strong>ffmpeg raw</strong> and <strong>397B-prior neighbor</strong> both reach 0.1491. <strong>Candidate selector</strong> picks one label from multiple candidates and remains best at <strong>0.1542</strong>.",
      "story.e2e.fold": "Expand: E2E method cards",
      "story.takeaway": "<strong>Takeaways:</strong> chunked contact sheets invent seam cuts; the rule list decides what to cut, local refine (cover full actions) decides how fine; rule merges look nicer but don’t lift F1. After the Gemini rescore, raw 27B is the best fixed-boundary labeler, but the best end-to-end recipe is still S2 bounds + 397B multi-candidate selector. Overlay, neighbor sheets, and crude hand-collages should not be default paths.",
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
      "recipe.p4.d": "397B multi-cand → Gemini E2E 0.1542",
      "recipe.th.stage": "Stage",
      "recipe.th.do": "Do",
      "recipe.th.dont": "Don’t enable by default",
      "recipe.r1.a": "Segmentation",
      "recipe.r1.b": "Qwen3.6-27B + rule list + local refine (no pad-out, cover full actions)",
      "recipe.r1.c": "Chunked max3; blind rule merge",
      "recipe.r2.a": "Labeling (cheap)",
      "recipe.r2.b": "For fixed gold-boundary wording: 27B raw (Label Acc 55.7%); for predicted-boundary E2E on a budget: 397B raw (0.1414)",
      "recipe.r2.c": "Proxy overlay / neighbor sheets / whole-frame collage / proxy hand-crop as defaults",
      "recipe.r3.a": "Labeling (max score)",
      "recipe.r3.b": "Same bounds + multi-cand + 397B selector (Gemini E2E 0.1542)",
      "recipe.r3.c": "Treat seg-model self-labels as final",
      "recipe.r4.a": "Comparison",
      "recipe.r4.b": "HomER-only vs Macrodata HomER≈0.227",
      "recipe.r4.c": "Hard-compare to full-100 0.306 headline",
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
      "boundary.h2": "3.5 Boundary comparison: one clip, three cuts",
      "boundary.lead": "Macrodata-style boundary comparison: video on top, multi-track timeline below; the playhead follows playback. Hover for the full label, click to seek. Episode matches the walkthrough (homer_4).",
      "boundary.kicker": "BOUNDARY COMPARISON",
      "boundary.caption": "Models often name the broad event while missing finer subtask boundaries. Same episode homer_4 (matches the walkthrough below) vs gold, whole-episode coarse cut, and contact-sheet cut. Hover a block for the full label.",
      "page.title": "EgoANT evaluated on WGO-Bench HomER",
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

      <h4>A.2 固定边界 Label Acc（只评文案）</h4>
      <p>时间边界直接使用 gold，只考模型能否把这段动作写成同一个完成事件。</p>
      <pre class="formula">Acc = n_semantically_correct / n_gold</pre>

      <h4>A.3 Semantic E2E F1（时间 + 文案）</h4>
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
      <article class="concept-card"><h4>raw relabel</h4><p>边界锁死后，用 397B 看当前段 raw 帧重写一句 subtask。S2 边界 + 单路 raw 的 E2E F1 为 0.1414。</p></article>
      <article class="concept-card"><h4>ffmpeg raw relabel</h4><p>边界相同，只把默认解码/抽帧实现换成 ffmpeg 路径。它不是新的标注策略，而是同一段视频的另一种候选文案来源；实验中略高于默认 raw，因此进入 selector 候选池。</p></article>
      <article class="concept-card"><h4>neighbor relabel</h4><p>给当前段时同时给上一/当前/下一段的帧。这个想法看似能提供上下文，但在 Qwen 上常把邻段动作写进当前句，因此降低标注准确率。</p></article>
      <article class="concept-card"><h4>candidate selector</h4><p>对同一边界生成 raw、ffmpeg、seed、rawprior 等候选，再让 397B 选最像完成操作的一句；当前 Gemini judge 最高 E2E F1 为 0.1542。</p></article>

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
        <tr><td>HaWoR true hand-crop</td><td>按腕轨裁手部</td><td>标注候选</td><td>Gemini Acc 50.9%</td></tr>
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
        <tr><td>proxy overlay</td><td>光流/中心框不是真手部重建</td><td>与 HaWoR true hand-crop 分开汇报</td></tr>
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
        <tr><td>proxy overlay</td><td>raw frames with optical-flow / heuristic marks, not true hand reconstruction</td><td>labeling ablation</td><td>Gemini Acc 50.6% (27B) / 48.5% (397B)</td></tr>
        <tr><td>temporal collage</td><td>past/current/future full-frame grids</td><td>labeling ablation</td><td>Gemini Acc 52.8% (27B) / 45.1% (397B)</td></tr>
        <tr><td>neighbor sheet</td><td>previous/current/next segment sheets</td><td>labeling ablation</td><td>Gemini Acc 39.6–40.0% (397B)</td></tr>
        <tr><td>HaWoR true hand-crop</td><td>crop around wrist tracks</td><td>label candidate</td><td>Gemini Acc 50.9%</td></tr>
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
        <tr><td>proxy overlay</td><td>Optical-flow or center-box proxies are not true hand reconstruction</td><td>Reported separately from HaWoR true hand-crop</td></tr>
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
