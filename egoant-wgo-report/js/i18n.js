/* EgoANT report i18n — splash / demos / narrative sections */
(function () {
  const I18N = {
    zh: {
      "nav.intro": "导读",
      "nav.tldr": "结论速览",
      "nav.world": "相关工作",
      "nav.evaluate": "如何评估",
      "nav.contact": "Contact sheet",
      "nav.walk": "样例",
      "nav.cost": "成本",
      "nav.story": "消融",
      "nav.recipe": "推荐配置",
      "nav.appendix": "附录",
      "nav.references": "参考文献",
      "toc.label": "目录",
      "tag.ego": "第一视角人手数据",
      "tag.human": "人手数据",
      "tag.subtask": "子任务标注",
      "tag.wgo": "WGO-Bench",
      "tag.egoant": "EgoANT",
      "hero.link.blog": "Macrodata blog",
      "hero.link.app": "附录细节",
      "hero.eyebrow": "用开源视觉语言模型对第一视角人类视频进行分段与标注",
      "hero.lede": "",
      "en.banner": "",
      "intro.h2": "导读：为什么要给第一视角人类视频做子任务标注",
      "intro.ego": "第一视角（egocentric）人类视频指由佩戴在头部的相机记录的、以第一人称视角拍下的人类日常操作过程：一个人在真实厨房里切菜、在工位上装配零件、在超市里整理货架。相机跟着头动，双手在画面中央干活，物体、光照、失败与重试都来自真实环境而不是实验室布景。近两年 EgoVerse<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egoverse\">8</a></sup>、EgoDex<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egodex\">7</a></sup>、EgoLive<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egolive\">9</a></sup> 等公开数据集把这类视频推到了千小时以上的规模。",
      "intro.value": "这类数据对机器人学习有用，前提是它<strong>能迁移</strong>：人手和机器人末端的形态不同，但「看到什么 → 该做什么」这一层的操作语义是共享的，因此人类视频可以先撑起视觉-语言-动作（VLA）模型的预训练，再用少量真机数据把动作空间对齐到具体本体上<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-pi05\">1</a></sup>。这个前提成立之后，它的另外两个属性才开始起作用：一是<strong>覆盖面</strong>——真实人类视频里的场景、物体和技能远比遥操作采集的机器人数据多样，这正是策略在没见过的环境里仍然能工作（分布外泛化）的来源；二是<strong>采集成本</strong>——不需要机器人本体、不需要遥操作员，一个头戴相机就能在真实环境里长时间、并行地产出数据，覆盖面才有可能真的堆起来。",
      "intro.why": "原始视频当然也能直接拿来训练：它可以喂给视频预测或世界模型，配上手部重建得到的腕部轨迹，还能充当一种弱动作监督。但这类监督只回答「画面接下来会变成什么样」，不回答<strong>「现在在做哪一件事、这件事做完了没有」</strong>。",
      "intro.task": "而后者恰恰是现在主流机器人策略需要的东西。VLA 的训练样本是「观测 + 语言指令 + 动作」的三元组，指令必须和时间段对齐；π<sub>0.5</sub> 这类层级模型更是先预测一条高层子任务指令，再以它为条件生成低层动作<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-pi05\">1</a></sup>，训练高层那一段靠的就是子任务标签。分段边界本身也有用：它定义了「一次完整操作从哪里开始、到哪里算做完」，这是成功判定、奖励模型和技能检索的前提，也是预训练语料做筛选与配比时的基本单位。所以要把长视频变成可用的监督信号，必须回答两个问题：<strong>每个动作在什么时候开始和结束</strong>，以及<strong>这一段在做什么</strong>——这两个问题合起来就是本文的任务：子任务分段与语义标注。",
      "intro.hard": "这件事并不容易：画面随头部晃动，手经常挡住被操作的物体，动作之间没有明显停顿，细粒度操作一个接一个。人工逐小时标注显然覆盖不了千小时量级的语料，因此需要一条<strong>可审计、可复现、成本可控的自动标注管线</strong>。",
      "intro.p3": "EgoANT 是我们针对这些缺口做的一套面向第一视角人类操作视频的自动标注管线：把长视频划分为动作级片段，并为每个片段生成简洁的操作描述。在 HomER 的 25 个视频 / 470 个参考片段上，最佳分段配置取得 Segment F1 <strong>0.2031</strong>；固定参考边界下的纯标注 Label Acc 达 <strong>55.7%</strong>；只以视频为输入的端到端方案取得 Semantic E2E F1 <strong>0.1542</strong>。据此形成了一套相对廉价、完全基于开源视觉语言模型的第一视角子任务自动标注系统。",
      "intro.scope": "<strong>评测范围：</strong>本页所有分数与推荐配置都锚定 HomER 的 25 个视频 / 470 个参考片段。Macrodata 报告的完整 WGO-Bench Segment F1 约 0.306 覆盖全部约 100 个 episode，不宜与本页数字直接比较；同范围的 HomER-only Gemini 参考约 <strong>0.227</strong>，才是本文合适的对照。",
      "tldr.h2": "结论速览（TL;DR）",
      "tldr.scope": "以下结论都限定在同一个设定下：评测集是 WGO-Bench 的第一视角人类子集 HomER（25 个视频、470 个人工标注片段）；生成侧只使用开源 Qwen 视觉语言模型——分段用 Qwen3.6-27B，候选描述与选优用 Qwen3.5-397B；语义是否正确由 Gemini-3.5-Flash 作为离线评判给出。三类分数的定义见 <a href=\"#evaluate\">§1</a>。换一个数据子集或换一代模型，下面的相对关系不保证仍然成立。",
      "tldr.pt1": "<strong>模型本身的代际差，比视觉输入上的技巧更能决定分数。</strong>在固定人工边界、只考语义描述的设置下，最朴素的输入——按片段均匀抽原始帧——配 Qwen3.6-27B 得到 55.7% 的 Label Acc，而四种更复杂的视觉输入都低于它（39.2%–52.8%）：在原帧上叠加启发式提示（proxy overlay）、把一段时间的多帧拼成一张图（temporal collage）、把相邻片段一起交给模型（邻段 sheet）、按估计的手部位置裁剪（hand crop）。分段一侧也一样：同一套 contact-sheet 输入、同一段 prompt，Qwen3.6-27B 的 Segment F1 为 0.1278，上一代更大的 Qwen3.5-397B 只有 0.0952。换句话说，预算允许换更强的模型时，那通常比在弱模型上叠视觉技巧更划算。本文刻意站在相反的约束里：只用便宜的开源模型，看这些技巧最远能把开源栈推到离闭源模型多近。",
      "tldr.pt2": "<strong>模型固定时，改变视频的表示方式确实能缩小与闭源模型的差距。</strong>把整段视频渲染成带时间戳的图片网格（contact sheet），再采用「整集先粗切、每个粗边界附近局部重切」的两遍策略，Segment F1 从我们此前基于腕部速度的规则基线 0.0953 提高到 <strong>0.2031</strong>。同一 recipe 下，Macrodata 公开报告中非 Gemini 模型为 0.11–0.14，而 Gemini 在同一 HomER 范围的参考值为 0.227——表示方式与搜索策略把开源栈与它的差距从约一倍压到了 0.024。",
      "tldr.pt3": "<strong>contact sheet 的收益集中在分段，对固定边界下的语义标注没有帮助。</strong>时间戳网格让模型在一次调用里看到十秒量级的时间结构，这正是判断「一个动作在哪里完成」所需要的信息。但当边界已经给定、只需要描述这一段时，模型需要的是这段里手与物体的细节，额外的时间上下文反而会带进相邻动作——人工检查错误样本时可以直接看到邻段动作被写进当前描述。这也解释了上一条中那些复杂视觉输入为什么反而掉分。",
      "tldr.pt4": "<strong>端到端分数的瓶颈是时间边界，不是描述质量。</strong>使用人工边界时，语义描述的准确率为 55.7%；换成模型预测的边界后，端到端分数（时间与语义都要判对）只剩 0.1542。由于端到端要求先完成时间配对，分段的 0.2031 就是端到端分数的上限——在这条管线上，继续打磨句子的收益远小于继续改进边界。",
      "tldr.pt5": "<strong>多路生成候选、再选一条定稿，是目前观察到的最好端到端配置，代价是额外调用。</strong>固定同一套预测边界后只改标注路径：分段模型顺手写下的标签为 0.1234，各种单次重标为 0.1285–0.1491，而让 Qwen3.5-397B 从多条候选中挑一条定稿得到 <strong>0.1542</strong>。这一增益（约 +0.005–0.03）需要与多出来的候选生成与一次选择调用一起衡量，成本见 <a href=\"#cost\">§5</a>。",
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
      "cost.row.prod": "EgoANT 腕速基线",
      "cost.row.prod_scope": "同一 HomER 子集上的内部工程估计",
      "cost.row.prod_num": "仅保留聚合调用量级；不公开内部机器、路径或服务状态",
      "cost.recipe.h3": "WGO 两条标注路径（估计 tokens）",
      "cost.th.item": "项",
      "cost.th.raw": "单路 raw（E2E 0.1414）",
      "cost.th.sel": "候选+selector（E2E 0.1542）",
      "cost.dyn.summary": "HomER {n} 集合计 {min} 分钟（均长约 {mean}s）。WGO token 为工程估计；API 次数为产物计数。{extra}",
      "cost.dyn.extra": "",
      "cost.dyn.prod_h3": "腕速基线：聚合成本说明",
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
      "splash.cta": "进入报告",
      "demos.h2": "Egocentric human subtasks",
      "demos.lede": "HomER 25 集各取一段第一人称人手动作（5×5）；字幕为自动标注短指令示意。",
      "load.error": "无法加载数据文件。请在本报告目录启动静态服务器后打开（例如 <code>python3 serve_report.py --port 8765</code>；需支持 HTTP Range 才能跳播视频片段），不要直接用受限的 <code>file://</code>。",
      "world.h2": "2. 相关工作与实验设置",
      "world.p.lead": "在我们之前，已经有几条把长视频变成子任务标注的公开路线。它们各自解决了问题的一部分，也各自留下了空白；这些空白决定了本文选择往哪些方向尝试。",
      "world.h3.rule": "Rule-based 分段：VITRA 与固定时长切分",
      "world.p.rule": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-vitra\">5</a></sup> 把单目第一视角视频处理成三维手部与相机运动、原子动作片段和语言指令，它的切段依据是手部运动信号——取腕部速度的局部极小值当作动作边界。另一类更简单的做法直接按固定时长切。我们把这两类统称为 <strong>rule-based 分段</strong>。它们共同的问题是<strong>过分割</strong>：一个动作内部的停顿、重新抓握、手腕微调都会产生速度低谷，于是「把胡萝卜放进碗里」被切成五六段。EgoANT 最早的一版分段也尝试过这条路线（HaWoR 腕速 + 低谷切段 + 相邻合并），本文把它保留为对照基线：在 HomER 上它切出 810 段，而参考只有 470 段，Segment F1 只有 <strong>0.0953</strong>。后面的 contact-sheet 方案正是为了替换掉这一版。",
      "world.h3.md": "Macrodata / WGO-Bench：把子任务标注变成一个可以打分的公开问题",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata · Annotating Robot Video Subtasks</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-macrodata\">2</a></sup> 是目前最系统的公开工作：它把「长视频 → 动作级片段 + 短语义描述」定义成可打分的公开问题，发布了 WGO-Bench 与三类分数（分段、固定边界标注、端到端都有报告），给出了 contact sheet 一类的视觉输入设计和用 GEPA 搜索得到的分段 prompt，并在多个闭源与开源模型上做了对照。它留下的空白与我们直接相关：各种 trick 的收益主要是在强模型（Gemini）上测出来的，报告没有回答<strong>预算有限、只能用开源模型时应该加哪些 trick</strong>——而这恰恰是我们要标几千小时视频时的真实约束。本文可以看作在这个约束下对它的一次补充。",
      "world.h3.scale": "Scale Labs：已切好的 clip 上的稠密描述",
      "world.p.scale": "Scale Labs 的 <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">The Path to Large Scale Dense Video Captioning</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-scale\">4</a></sup> 讨论的是在<strong>已经切分好的 clip</strong> 上写稠密描述，以及拼贴、时间戳、稳定抽帧这些具体工程做法。它对我们的视觉输入设计有直接启发，但它的设定默认边界已经给定，不涉及「从原始长视频里预测边界」这一步——而分段恰恰是后面会看到的端到端瓶颈。",
      "world.h3.egoant": "EgoANT 的两条管线",
      "world.p.egoant": "EgoANT 是我们面向第一视角人类操作视频的自动标注系统。本文涉及它的两条管线：",
      "world.li.prod": "<strong>腕速基线（EgoANT 的第一版）</strong>：HaWoR 手部运动重建 → 腕部速度平滑与低谷候选边界 → 段内抽原始帧写短句 → 相邻片段合并与重写。它借鉴了 VITRA 一类「先运动、后描述」的思路，但切段依据是 HaWoR 的腕部运动信号，并没有使用 VITRA 模型。细节见 <a href=\"#app-prod\">附录 D</a>；本文只把它当作对照基线。",
      "world.li.wgo": "<strong>contact-sheet 管线（本文的实验对象）</strong>：带时间戳的 contact sheets → Qwen3.6-27B 分段 → 固定预测边界后的语义标注与多候选选择。正文的实验都针对这条管线。",
      "world.p.models": "三个模型的分工是：Qwen3.6-27B 负责分段，也可以顺带生成一部分标注候选；Qwen3.5-397B 负责生成候选描述并从中选出定稿；Gemini-3.5-Flash 只在离线评测时充当语义评判，不参与生成标签，也不参与选择候选。早期用 Qwen 做评判的结果只作为评判敏感性检查，不计入主分数。",
      "role.th.role": "角色",
      "role.th.model": "模型",
      "role.th.use": "在本文中的作用",
      "role.segmenter": "分段模型",
      "role.captioner": "描述生成模型",
      "role.selector": "候选选择器（selector）",
      "role.judge": "语义评判模型（judge）",
      "role.segmenter.use": "预测片段的时间边界",
      "role.captioner.use": "为每个片段生成候选描述",
      "role.selector.use": "从多条候选描述中选出定稿",
      "role.judge.use": "离线计算 Label Acc 与 Semantic E2E F1",
      "world.h3.gepa": "「GEPA-derived prompt」在本文里指什么",
      "world.gepa.1": "<strong>GEPA 本身</strong>是一种用反馈自动改写 prompt 的方法<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-gepa\">3</a></sup>。Macrodata 用它在另外 15 个 episode 的验证集上搜索更贴合标注规范的分段规则。",
      "world.gepa.2": "<strong>我们复用的是搜索的结果</strong>，也就是他们公开的那段英文分段规则（<code>completed_events_duration_prior_v1</code>）：只切已经完成的操作事件，片段长度偏好 2–10 秒，靠近、微调、收回这类动作不单独成段。",
      "world.gepa.3": "<strong>我们没有重新跑 GEPA。</strong>后文写「GEPA-derived prompt」时，指的只是这段规则文本——它既不是模型，也不是后处理脚本，而是请求里的一段文字。",
      "world.gepa.4": "<strong>怎么用：</strong>整集的 contact sheets 加上这段规则，一次调用完成粗分。相比不带规则的旧 prompt，它把 Segment F1 从 0.1230 提到 0.1369。英文全文见样例 Step 02 的折叠区；概念与实现见 <a href=\"#app-seg\">附录 B</a>，原文下载见 <a href=\"#app-prompts\">附录 F</a>。",
      "world.h3.terms": "常用术语",
      "world.terms.figcap": "同一段 40 秒视频的四种切法：人工参考、整集粗分、S1 加密切、S2 局部精修。绿色虚线框就是「时间窗口」，S2 只在框内重切。",
      "world.term.1": "<strong>时间窗口</strong>：视频时间轴上的一段连续区间（例如 84–94 秒），不是软件界面里的窗口。",
      "world.term.2": "<strong>第一遍加密切（S1）</strong>：把切段密度调高，让更多真实边界被覆盖到，代价是容易切碎。详见 <a href=\"#app-seg\">附录 B</a>。",
      "world.term.3": "<strong>第二遍局部精修（S2）</strong>：只在粗分边界附近的一小段时间里重切一次。",
      "world.term.4": "<strong>窗口不外扩（pad=0）</strong>：精修时只看窗口内部的画面，不把窗外的相邻动作纳入视野。",
      "world.term.5": "<strong>盖住完整动作（full-cover）</strong>：窗口里看得见的完成动作都要切到，同时不要把靠近、微调、收回单独切成碎片。",
      "world.term.6": "<strong>候选选择器（selector）</strong>：从多条候选描述里挑一条定稿，只在生成阶段使用。",
      "world.term.7": "<strong>语义评判（judge）</strong>：只在评测阶段使用，判断预测描述与参考描述说的是不是同一个完成动作。",
      "world.term.8": "<strong>HaWoR</strong><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-hawor\">6</a></sup>：从第一视角视频中重建手部运动的方法，用来估计腕部轨迹并裁出手部区域。它给出的是估计值，不是传感器真值。",
      "fig.src.segterms": "assets/explain/seg_terms_zh.svg",
      "fig.src.metric": "assets/explain/metric_iou_f1_zh.svg",
      "fig.src.s2": "assets/explain/s2_no_pad_full_cover_zh.svg",
      "fig.src.taxonomy": "assets/explain/visual_input_taxonomy_zh.svg",
      "world.h3.inputs": "五种容易混淆的视觉输入",
      "world.p.inputs": "后文反复出现 contact sheet、temporal collage、邻段 sheet、proxy overlay、手部裁剪这几个词，它们的差别只有看图才说得清。下面是同一段视频、同一个动作（homer_4 第 22.9–26.8 秒，「拉开床头柜抽屉」）分别渲染成五种输入的样子，参数与管线一致。",
      "world.zoo.raw": "<strong>raw 原始帧</strong>：在片段内均匀抽 3 帧，作为 3 张<em>独立</em>图片提交。固定边界标注的默认输入，也是本文准确率最高的一种（55.7%）。",
      "world.zoo.collage": "<strong>temporal collage 时间拼贴</strong>：同样几帧，但拼成<em>一张</em>图一次性给模型。省 token，画面里仍只有当前这一个动作。",
      "world.zoo.contact": "<strong>contact sheet</strong>：每 0.5 秒一帧、缩到 224×144、20 格一张，格子左上打<em>黄色时间戳</em>，一张覆盖约 10 秒。这是分段用的输入，也是本文收益最大的那处改动。",
      "world.zoo.neighbor": "<strong>邻段 sheet</strong>：把上一段（灰条）、当前段（绿条）、下一段（灰条）一起给模型。上下文更多，但模型经常把邻段的动作写进当前描述。",
      "world.zoo.proxy": "<strong>proxy overlay 与手部裁剪</strong>：左边在画面中心偏下画一个<em>固定</em>方框（启发式猜测，不是手部检测），右边是裁出后真正送进模型的图。真正依据 HaWoR 腕部轨迹的裁剪见 <a href=\"#app-visual\">附录 E</a>。",
      "world.zoo.note": "以上五张按管线参数重新渲染，用于说明差别本身。在固定边界的标注实验里，除 contact sheet 只用于分段外，其余四种都低于 raw；数字见 <a href=\"#story\">§6.2</a>。",
      "metrics.h2": "1. 我们如何评估这条管线",
      "eval.lead": "要比较不同的标注方案，需要一个公开、可复现、并且和我们的任务同构的基准——它必须同时考核「切得对不对」和「写得对不对」。本文用的是 <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-wgo\">1</a></sup>。",
      "eval.h3.bench": "WGO-Bench 与 HomER 子集",
      "eval.p.bench": "WGO-Bench（What's Going On Benchmark）由 Macrodata 随其公开博客一同发布<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-macrodata\">2</a></sup>，把「长视频 → 动作级片段 + 一句话描述」定义成一个可以打分的公开任务。它包含约 100 个 episode，每个 episode 提供人工标注的子任务时间边界，以及每段对应的一句短描述。其中 <strong>HomER</strong> 是它的第一视角人类操作子集：画面随头动晃、手常挡住物体、动作连续且细，通常比第三人称桌面视频更难。本报告的所有分数固定在 <strong>HomER 的 25 个视频 / 470 个参考片段</strong>上。",
      "eval.h3.metrics": "三类分数分别在考什么",
      "metrics.lead": "完整公式与简化示例见 <a href=\"#app-metrics\">附录 A</a>。正文先给出三类分数的定义。",
      "metrics.li1": "<strong>Segment F1</strong>：仅衡量预测片段与参考片段之间的时间边界质量；时间 IoU≥0.75 时可形成一对一匹配。",
      "metrics.li2": "<strong>Fixed-boundary Label Acc</strong>：使用参考时间边界，仅评估预测描述是否表达了相同的完成动作。",
      "metrics.li3": "<strong>Semantic E2E F1</strong>：先进行时间匹配，再判断匹配片段的语义描述是否正确；只有时间和语义都正确才计入正确预测。",
      "metrics.toy": "下面用一个人造的小例子，把 Segment F1 完整走一遍。",
      "metrics.figcap": "评分分两步：先用时间 IoU 判断预测片段与参考片段是否重叠得够多，再由配对成功的数量算出 precision、recall 与 F1。",
      "toy.lane.gold": "参考（人工标注）",
      "toy.lane.pred": "预测（首尾对齐后）",
      "toy.lane.sum": "配对成功 {n} 个 · F1 ≈ {f1}",
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
      "appendix.lead": "正文讲「试了什么、分数怎么变」；本附录补清楚公式、术语和实现边界。目录： <a href=\"#app-metrics\">A 得分</a> · <a href=\"#app-seg\">B 分段概念</a> · <a href=\"#app-e2e\">C 标注/E2E 术语</a> · <a href=\"#app-prod\">D 腕速基线</a> · <a href=\"#app-visual\">E 视觉输入</a> · <a href=\"#app-prompts\">F Prompt</a> · <a href=\"#app-cost\">G 成本记账</a> · <a href=\"#audit\">H 效度</a>。",
      "metrics.toy.g": "参考片段（gold）：G0[0,3]、G1[3,6]、G2[6,10]；模型预测（pred）：P0[0.5,2.8]、P1[2.8,5.5]、P2[5.5,8]、P3[8,9.5]。",
      "metrics.toy.1": "先把首尾对齐到视频两端，避免开头结尾少切的几帧影响判定：P0 的起点归到 0，P3 的终点归到 10。",
      "metrics.toy.2": "逐对计算时间 IoU（交集 / 并集），只有 ≥0.75 才算配对成功：P0–G0≈0.933、P1–G1≈0.781 通过，P2 与 P3 和任何参考片段都不达标。",
      "metrics.toy.3": "配对成功 2 个 → 精确率 = 2/4 = 0.50，召回率 = 2/3 ≈ 0.67，F1 ≈ 0.571。",
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
      "page.title": "EgoANT",
      "hero.title": "EgoANT",
      "hero.grid.aria": "第一视角人手子任务视频墙",
      "nav.brand": "EgoANT",
      "references.h2": "参考文献",
      "references.pi05": "Physical Intelligence, Black, Kevin, Brown, Noah, Darpinian, James, Dhabalia, Karan, Driess, Danny, et al. (2025). <em>&pi;<sub>0.5</sub>: a Vision-Language-Action Model with Open-World Generalization</em>. arXiv. <a href=\"https://arxiv.org/abs/2504.16054\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2504.16054</a>",
      "references.wgo": "Macrodata Labs. (2026). <em>WGO-Bench: What's Going On Benchmark</em>. Hugging Face. <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">https://huggingface.co/datasets/macrodata/WGO-Bench</a>",
      "references.macrodata": "Macrodata Labs. (2026). <em>Segmenting Robot Video into Actionable Subtasks</em>. Macrodata Labs. <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">https://macrodata.co/blog/annotating-robot-video-subtasks</a>",
      "references.gepa": "Agrawal, Lakshya A., Tan, Shangyin, Soylu, Dilara, Ziems, Noah, Khare, Rishi, Opsahl-Ong, Krista, et al. (2026). <em>GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning</em>. arXiv. <a href=\"https://arxiv.org/abs/2507.19457\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2507.19457</a>",
      "references.scale": "Choghari, Jade, Sansone, Agustin, Pasqualis, Nicolas, Mader, Conrado, Tiupikov, Aleks, Sivapurapu, Mouli. (2026). <em>The Path to Large Scale Dense Video Captioning</em>. Scale Labs. <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning</a>",
      "references.vitra": "Li, Qixiu, Deng, Yu, Liang, Yaobo, Luo, Lin, Zhou, Lei, Yao, Chengtang, et al. (2025). <em>VITRA: Scalable Vision-Language-Action Model Pretraining for Robotic Manipulation with Real-Life Human Activity Videos</em>. Project page. <a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">https://microsoft.github.io/VITRA/</a>",
      "references.hawor": "Zhang, Jinglei, Deng, Jiankang, Ma, Chao, Potamias, Rolandos Alexandros. (2025). <em>HaWoR: World-Space Hand Motion Reconstruction from Egocentric Videos</em>. arXiv. <a href=\"https://arxiv.org/abs/2501.02973\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2501.02973</a>",
      "references.egodex": "Hoque, Ryan, Huang, Peide, Yoon, David J., Sivapurapu, Mouli, Zhang, Jian. (2025). <em>EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video</em>. arXiv. <a href=\"https://arxiv.org/abs/2505.11709\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2505.11709</a>",
      "references.egoverse": "EgoVerse Consortium. (2026). <em>EgoVerse: Egocentric Data for Robot Learning from Around the World</em>. Project website. <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">https://egoverse.ai/</a>",
      "references.egolive": "Li, Yihang, Wei, Xuelong, Luo, Jingzhou, Xiao, Yingjing, Bai, Yibo, Zhou, Guangyuan, Zou, Teng, et al. (2026). <em>EgoLive: A Large-Scale Egocentric Dataset from Real-World Human Tasks</em>. arXiv. <a href=\"https://doi.org/10.48550/arXiv.2604.23570\" target=\"_blank\" rel=\"noopener\">https://doi.org/10.48550/arXiv.2604.23570</a>",
      "footer.text": "EgoANT · Shuai Zhou, Jul 2026",
      "tag.pretrain": "预训练",
    },
    en: {
      "nav.intro": "Intro",
      "nav.tldr": "Key results",
      "nav.world": "Related work",
      "nav.evaluate": "Evaluation",
      "nav.contact": "Contact sheet",
      "nav.walk": "Walkthrough",
      "nav.cost": "Cost",
      "nav.story": "Ablations",
      "nav.recipe": "Recipe",
      "nav.appendix": "Appendix",
      "nav.references": "References",
      "toc.label": "On this page",
      "tag.ego": "Egocentric Human Data",
      "tag.human": "Human data",
      "tag.subtask": "Subtask Annotation",
      "tag.wgo": "WGO-Bench",
      "tag.egoant": "EgoANT",
      "hero.link.blog": "Macrodata blog",
      "hero.link.app": "Appendix",
      "hero.eyebrow": "Segmentation & Annotation for Egocentric Human Video with open-source VLM",
      "hero.lede": "",
      "en.banner": "",
      "intro.h2": "Introduction: why egocentric human video needs subtask annotation",
      "intro.ego": "Egocentric human video is first-person footage recorded by a head-mounted camera while someone performs everyday manipulation: chopping vegetables in a real kitchen, assembling parts at a workbench, restocking shelves in a store. The camera moves with the head, both hands work near the center of the frame, and the objects, lighting, failures, and retries all come from a real environment rather than a lab setup. Public datasets such as EgoVerse<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egoverse\">8</a></sup>, EgoDex<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egodex\">7</a></sup>, and EgoLive<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-egolive\">9</a></sup> have pushed this kind of footage past the thousand-hour scale.",
      "intro.value": "This data is useful for robot learning only because it <strong>transfers</strong>: human hands and robot end-effectors have different morphology, but the manipulation semantics at the \"what I see &rarr; what to do\" level are shared, so human video can carry the pretraining stage of a vision-language-action (VLA) model, with a small amount of on-robot data used afterwards to align the action space to a specific embodiment<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-pi05\">1</a></sup>. Once that holds, two other properties start to matter: <strong>coverage</strong> &mdash; real human video spans far more scenes, objects, and skills than teleoperated robot data, and that breadth is where out-of-distribution generalization comes from; and <strong>collection cost</strong> &mdash; recording needs no robot hardware and no teleoperator, so a head-mounted camera alone can produce data in real environments, in parallel, for hours at a time, which is what makes that coverage reachable at all.",
      "intro.why": "Raw video can of course be trained on directly: it feeds video-prediction and world models, and paired with wrist trajectories from hand reconstruction it even serves as weak action supervision. But that kind of supervision only answers \"what will the picture look like next\", not <strong>\"which action is being performed right now, and is it finished\"</strong>.",
      "intro.task": "The second question is exactly what today's robot policies need. A VLA training sample is an (observation, language instruction, action) triplet, and the instruction has to be aligned to a time span; hierarchical models such as &pi;<sub>0.5</sub> go further and predict a high-level subtask instruction before conditioning the low-level action on it<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-pi05\">1</a></sup> &mdash; training that high-level stage is precisely what subtask labels are for. The boundaries themselves are also useful: they define where one complete operation starts and where it counts as done, which is a prerequisite for success detection, reward models, and skill retrieval, and the natural unit for filtering and rebalancing a pretraining corpus. So turning long video into usable supervision means answering two questions: <strong>when does each action start and end</strong>, and <strong>what is happening in that span</strong> &mdash; together, the task of this report: subtask segmentation and semantic labeling.",
      "intro.hard": "None of this is easy: the frame shakes with the head, hands frequently occlude the manipulated object, there is no clear pause between actions, and fine-grained operations follow one another without gaps. Hour-by-hour human annotation cannot cover a thousand-hour corpus, so we need an <strong>auditable, reproducible, cost-controlled automatic annotation pipeline</strong>.",
      "intro.p3": "EgoANT is our answer to those gaps: an automatic annotation pipeline for egocentric human manipulation video that cuts long videos into action-level segments and writes a short operation label for each. On the 25 videos / 470 reference segments of HomER, the best segmentation setup reaches Segment F1 <strong>0.2031</strong>; under fixed reference boundaries, pure labeling reaches Label Acc <strong>55.7%</strong>; the video-only end-to-end pipeline reaches Semantic E2E F1 <strong>0.1542</strong>. Together this yields a relatively inexpensive subtask annotation system built entirely on open-source vision-language models.",
      "intro.scope": "<strong>Evaluation scope:</strong> every score and recommendation on this page is anchored to the 25 videos / 470 reference segments of HomER. The full WGO-Bench Segment F1 of about 0.306 reported by Macrodata covers all ~100 episodes and should not be compared directly with the numbers here; the same-scope HomER-only Gemini reference of about <strong>0.227</strong> is the appropriate comparison.",
      "tldr.h2": "Key results (TL;DR)",
      "tldr.scope": "Every conclusion below is bound to one setup: the evaluation set is HomER, the egocentric human subset of WGO-Bench (25 videos, 470 human-annotated segments); the generation side uses only open-source Qwen vision-language models &mdash; Qwen3.6-27B for segmentation, Qwen3.5-397B for candidate captions and selection; and semantic correctness is decided offline by Gemini-3.5-Flash as judge. The three scores are defined in <a href=\"#evaluate\">&sect;1</a>. On a different subset or a different model generation, the relative ordering below is not guaranteed to hold.",
      "tldr.pt1": "<strong>The generation gap between models decides more than any trick applied to the visual input.</strong> With boundaries fixed to the human annotation and only the description scored, the plainest input &mdash; raw frames sampled uniformly inside each segment &mdash; with Qwen3.6-27B reaches 55.7% Label Acc, while four richer visual inputs all score below it (39.2%&ndash;52.8%): heuristic hints drawn over the frame (proxy overlay), several frames tiled into one image (temporal collage), neighbouring segments handed to the model together (neighbor sheet), and crops around the estimated hand position (hand crop). Segmentation behaves the same way: with an identical contact-sheet input and identical prompt, Qwen3.6-27B reaches Segment F1 0.1278 while the larger previous-generation Qwen3.5-397B only reaches 0.0952. In other words, when the budget allows a stronger model, that usually pays off more than stacking visual tricks on a weaker one. This report deliberately takes the opposite constraint: only cheap open-source models, and the question is how close those tricks can push an open stack to a closed one.",
      "tldr.pt2": "<strong>With the model fixed, changing the video representation does narrow the gap to closed models.</strong> Rendering the episode as timestamped image grids (contact sheets) and running a two-pass strategy &mdash; one coarse cut over the whole episode, then a local re-cut around each coarse boundary &mdash; lifts Segment F1 from 0.0953, our earlier wrist-speed rule baseline, to <strong>0.2031</strong>. Under the same recipe, Macrodata reports 0.11&ndash;0.14 for non-Gemini models, while their Gemini reference on the same HomER scope is 0.227 &mdash; so representation plus search strategy closed the gap from roughly a factor of two down to 0.024.",
      "tldr.pt3": "<strong>The contact-sheet gain is concentrated in segmentation; it does nothing for labeling under fixed boundaries.</strong> A timestamped grid lets the model see ten seconds of temporal structure in a single call, which is exactly what deciding \"where does this action complete\" requires. Once the boundary is given and only the span has to be described, what the model needs is detail about hands and objects inside that span; extra temporal context instead drags in the neighbouring action &mdash; error inspection shows adjacent actions written into the current description. That is also why the richer visual inputs in the previous point lose accuracy.",
      "tldr.pt4": "<strong>The end-to-end bottleneck is the temporal boundary, not description quality.</strong> On human boundaries, description accuracy is 55.7%; on model-predicted boundaries the end-to-end score (both time and semantics must be judged correct) drops to 0.1542. Because end-to-end scoring requires a temporal match first, the segmentation score of 0.2031 is the ceiling for it &mdash; on this pipeline, further polishing of sentences buys far less than further work on boundaries.",
      "tldr.pt5": "<strong>Generating several candidates and picking one is the best end-to-end setup observed so far, at the cost of extra calls.</strong> Holding the same predicted boundaries and changing only the labeling path: labels written by the segmenter itself score 0.1234, single-pass relabels score 0.1285&ndash;0.1491, and letting Qwen3.5-397B pick one caption from several candidates reaches <strong>0.1542</strong>. That gain (roughly +0.005&ndash;0.03) has to be weighed against the extra candidate generation and one selection call; see <a href=\"#cost\">&sect;5</a> for cost.",
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
      "cost.row.prod": "EgoANT wrist-speed baseline",
      "cost.row.prod_scope": "Internal engineering estimate on the same HomER subset",
      "cost.row.prod_num": "Aggregated call scale only; no internal machines, paths, or service status disclosed",
      "cost.recipe.h3": "WGO labeling paths (estimated tokens)",
      "cost.th.item": "Item",
      "cost.th.raw": "Raw-only (E2E 0.1414)",
      "cost.th.sel": "Candidates+selector (E2E 0.1542)",
      "cost.dyn.summary": "HomER {n} episodes, {min} minutes total (mean ~{mean}s). WGO tokens are engineering estimates; API counts are artifact-counted. {extra}",
      "cost.dyn.extra": "",
      "cost.dyn.prod_h3": "Wrist-speed baseline: aggregated cost note",
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
      "splash.cta": "Enter report",
      "demos.h2": "Egocentric human subtasks",
      "demos.lede": "One first-person HomER clip per episode (5×5 = all 25); captions are short auto-annotation labels.",
      "load.error": "Could not load data files. Serve this folder with Range support (e.g. <code>python3 serve_report.py --port 8765</code>); do not open via restricted <code>file://</code>.",
      "world.h2": "2. Related pipelines and experimental setup",
      "world.p.lead": "Several public pipelines already turn long video into subtask annotations. Each solves part of the problem and leaves a gap open, and those gaps are what determined which directions this report explores.",
      "world.h3.rule": "Rule-based segmentation: VITRA and fixed-length cutting",
      "world.p.rule": "<a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">VITRA</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-vitra\">5</a></sup> turns monocular egocentric video into 3D hand and camera motion, atomic action segments, and language instructions; its cuts come from the hand motion signal, taking local minima of wrist speed as action boundaries. A simpler family of methods just cuts at fixed intervals. We refer to both as <strong>rule-based segmentation</strong>. They share one failure mode: <strong>over-segmentation</strong>. Pauses inside a single action, regrasps, and small wrist adjustments all produce speed minima, so \"put the carrot in the bowl\" gets cut into five or six pieces. EgoANT's first segmentation version also tried this route (HaWoR wrist speed + valley cuts + adjacent merge), and this report keeps it as a comparison baseline: on HomER it cuts 810 segments against 470 reference segments and reaches Segment F1 <strong>0.0953</strong>. The contact-sheet approach below exists to replace that version.",
      "world.h3.md": "Macrodata / WGO-Bench: turning subtask annotation into a scoreable public problem",
      "world.p.md": "<a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">Macrodata &middot; Annotating Robot Video Subtasks</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-macrodata\">2</a></sup> is the most systematic public treatment so far: it frames \"long video &rarr; action-level segments + short semantic descriptions\" as a scoreable public problem, releases WGO-Bench and the three scores (segmentation, fixed-boundary labeling, and end-to-end are all reported), presents visual-input designs such as contact sheets and a GEPA-searched segmentation prompt, and compares several closed and open models. The gap that matters for us: the reported gains from each trick were measured mostly on a strong model (Gemini), and the post does not answer <strong>which tricks to add when the budget only allows open-source models</strong> &mdash; which is exactly our constraint when labeling thousands of hours. This report can be read as a complement under that constraint.",
      "world.h3.scale": "Scale Labs: dense captioning on pre-cut clips",
      "world.p.scale": "Scale Labs' <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">The Path to Large Scale Dense Video Captioning</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-scale\">4</a></sup> covers dense descriptions over <strong>already-cut clips</strong>, together with concrete engineering choices such as tiling, timestamps, and stable frame sampling. It directly informed our visual-input design, but its setting assumes boundaries are already given and never covers predicting them from raw long video &mdash; and segmentation, as shown later, is the end-to-end bottleneck.",
      "world.h3.egoant": "The two EgoANT pipelines",
      "world.p.egoant": "EgoANT is our automatic annotation system for egocentric human manipulation video. Two of its pipelines appear in this report:",
      "world.li.prod": "<strong>Wrist-speed baseline (EgoANT's first version)</strong>: HaWoR hand-motion reconstruction → smoothed wrist-speed candidate boundaries → raw-frame segment captions → adjacent-segment merge and rewrite. It borrows the VITRA-style \"motion first, caption second\" idea, but the segmentation signal is HaWoR wrist motion and no VITRA model is used. Details are in <a href=\"#app-prod\">Appendix D</a>; here it serves only as a comparison baseline.",
      "world.li.wgo": "<strong>Contact-sheet pipeline (what this report experiments on)</strong>: timestamped contact sheets → Qwen3.6-27B segmentation → semantic labeling and multi-candidate selection under fixed predicted boundaries. Every experiment in the body targets this pipeline.",
      "world.p.models": "The three models divide up as follows: Qwen3.6-27B does the segmentation and can also produce some label candidates; Qwen3.5-397B generates candidate captions and picks the final one; Gemini-3.5-Flash acts as semantic judge during offline evaluation only, and never generates labels or selects candidates. Earlier Qwen-judge results are judge-sensitivity checks, not main scores.",
      "role.th.role": "Role",
      "role.th.model": "Model",
      "role.th.use": "Role in this report",
      "role.segmenter": "Segmenter",
      "role.segmenter.use": "Predicts segment time boundaries",
      "role.captioner": "Caption generator",
      "role.captioner.use": "Writes candidate descriptions per segment",
      "role.selector": "Candidate selector",
      "role.selector.use": "Picks the final caption from the candidates",
      "role.judge": "Semantic judge",
      "role.judge.use": "Computes Label Acc and Semantic E2E F1 offline",
      "world.h3.gepa": "What \"GEPA-derived prompt\" means here",
      "world.gepa.1": "<strong>GEPA itself</strong> is a method that rewrites prompts automatically from feedback<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-gepa\">3</a></sup>. Macrodata used it on a separate 15-episode validation set to search for segmentation rules that follow their annotation protocol more closely.",
      "world.gepa.2": "<strong>What we reuse is the result of that search</strong>: the English segmentation-rule text they published (<code>completed_events_duration_prior_v1</code>) &mdash; cut only completed manipulation events, prefer 2&ndash;10 second segments, and do not give approach, adjustment, or retraction segments of their own.",
      "world.gepa.3": "<strong>We never re-ran GEPA.</strong> Where the text below says \"GEPA-derived prompt\", it means only that rule text &mdash; not a model, not a post-processing script, just words in the request.",
      "world.gepa.4": "<strong>How it is used:</strong> whole-episode contact sheets plus that rule text, in a single coarse-segmentation call. Against the older prompt without the rules, it lifts Segment F1 from 0.1230 to 0.1369. The full English text is in the fold under Step 02 of the walkthrough; concepts and implementation are in <a href=\"#app-seg\">Appendix B</a> and the raw file in <a href=\"#app-prompts\">Appendix F</a>.",
      "world.h3.terms": "Recurring terms",
      "world.terms.figcap": "One 40-second episode cut four ways: human reference, whole-episode coarse pass, S1 denser cuts, S2 local refine. The dashed green box is the time window; S2 only re-cuts inside it.",
      "world.term.1": "<strong>Time window</strong>: a contiguous interval on the video timeline (e.g. 84&ndash;94s) &mdash; not a window in a user interface.",
      "world.term.2": "<strong>Pass-1 denser cuts (S1)</strong>: raise the cut density so more true boundaries get covered, at the cost of fragmenting segments. See <a href=\"#app-seg\">Appendix B</a>.",
      "world.term.3": "<strong>Pass-2 local refine (S2)</strong>: re-cut once, inside a short window near a coarse boundary.",
      "world.term.4": "<strong>No pad-out (pad=0)</strong>: refinement sees only what is inside the window, so neighbouring actions outside it stay out of view.",
      "world.term.5": "<strong>Cover full actions (full-cover)</strong>: every completed action visible in the window must be cut, without splitting approach, adjustment, or retraction into fragments of their own.",
      "world.term.6": "<strong>Candidate selector</strong>: picks one final caption from several candidates; used during generation only.",
      "world.term.7": "<strong>Semantic judge</strong>: used during evaluation only, deciding whether a predicted description and the reference describe the same completed action.",
      "world.term.8": "<strong>HaWoR</strong><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-hawor\">6</a></sup>: a method that reconstructs hand motion from egocentric video, used to estimate wrist trajectories and crop the hand region. It produces estimates, not sensor ground truth.",
      "fig.src.segterms": "assets/explain/seg_terms_en.svg",
      "fig.src.metric": "assets/explain/metric_iou_f1.svg",
      "fig.src.s2": "assets/explain/s2_no_pad_full_cover.svg",
      "fig.src.taxonomy": "assets/explain/visual_input_taxonomy.svg",
      "world.h3.inputs": "Five visual inputs that are easy to confuse",
      "world.p.inputs": "Contact sheet, temporal collage, neighbor sheet, proxy overlay, and hand crop recur throughout this report, and the differences only become clear in pictures. Below is one and the same moment &mdash; homer_4, 22.9&ndash;26.8s, \"open the nightstand drawer\" &mdash; rendered as each of the five inputs, with the pipeline\u2019s own parameters.",
      "world.zoo.raw": "<strong>raw frames</strong>: three frames sampled uniformly inside the segment and submitted as three <em>separate</em> images. The default input for fixed-boundary labeling, and the most accurate one in this report (55.7%).",
      "world.zoo.collage": "<strong>temporal collage</strong>: the same frames, tiled into a <em>single</em> image. Cheaper in tokens, and still shows only the current action.",
      "world.zoo.contact": "<strong>contact sheet</strong>: one frame every 0.5s, scaled to 224&times;144, 20 tiles per sheet, a <em>yellow timestamp</em> in each tile corner, about 10 seconds per sheet. This is the segmentation input and the single change that bought the most in this report.",
      "world.zoo.neighbor": "<strong>neighbor sheet</strong>: previous (grey bar), current (green bar), and next (grey bar) segment handed over together. More context, but the model often writes the neighbouring action into the current description.",
      "world.zoo.proxy": "<strong>proxy overlay and hand crop</strong>: on the left a <em>fixed</em> box below frame centre (a heuristic guess, not hand detection); on the right the crop actually sent to the model. Crops that really follow HaWoR wrist trajectories are in <a href=\"#app-visual\">Appendix E</a>.",
      "world.zoo.note": "These five are re-rendered with the pipeline parameters to show the difference itself. In the fixed-boundary labeling experiments, all but the contact sheet (which is only used for segmentation) score below raw; numbers are in <a href=\"#story\">&sect;6.2</a>.",
      "metrics.h2": "1. How we evaluate the pipeline",
      "eval.lead": "Comparing annotation designs needs a public, reproducible benchmark shaped like our own task &mdash; one that scores both where the cuts land and what the sentences say. We use <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">WGO-Bench</a><sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-wgo\">1</a></sup>.",
      "eval.h3.bench": "WGO-Bench and the HomER subset",
      "eval.p.bench": "WGO-Bench (What's Going On Benchmark) was released by Macrodata alongside their public blog post<sup class=\"cite\"><a class=\"cite-ref\" href=\"#ref-macrodata\">2</a></sup>, turning \"long video &rarr; action-level segments + one-sentence descriptions\" into a scoreable public task. It contains roughly 100 episodes, each with human-annotated subtask time boundaries and a short description per segment. <strong>HomER</strong> is its egocentric human manipulation subset: the frame shakes with the head, hands often occlude the object, and actions are continuous and fine-grained, which usually makes it harder than third-person tabletop video. Every score in this report is fixed to the <strong>25 videos / 470 reference segments of HomER</strong>.",
      "eval.h3.metrics": "What the three scores measure",
      "metrics.lead": "Full formulas and a simplified example are in <a href=\"#app-metrics\">Appendix A</a>. The body first defines the three scores.",
      "metrics.li1": "<strong>Segment F1</strong>: measures temporal boundary quality only; a predicted segment can form a one-to-one match with a reference segment when temporal IoU is at least 0.75.",
      "metrics.li2": "<strong>Fixed-boundary Label Acc</strong>: uses reference time boundaries and evaluates only whether the predicted description expresses the same completed action.",
      "metrics.li3": "<strong>Semantic E2E F1</strong>: first performs temporal matching, then judges the label for matched pairs; a prediction is correct only when both time and semantics are correct.",
      "metrics.toy": "A small synthetic example, walking Segment F1 end to end.",
      "metrics.figcap": "Scoring has two steps: temporal IoU first decides whether a predicted segment overlaps a reference segment enough, then the number of successful matches gives precision, recall, and F1.",
      "toy.lane.gold": "Reference (human)",
      "toy.lane.pred": "Prediction (after outer snap)",
      "toy.lane.sum": "{n} matches · F1 ≈ {f1}",
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
      "metrics.toy.g": "Reference (gold): G0[0,3], G1[3,6], G2[6,10]. Prediction (pred): P0[0.5,2.8], P1[2.8,5.5], P2[5.5,8], P3[8,9.5].",
      "metrics.toy.1": "First snap the outer ends to the episode bounds, so a few uncut frames at the start or end do not decide the match: P0.start goes to 0, P3.end goes to 10.",
      "metrics.toy.2": "Compute temporal IoU (intersection / union) pairwise; only ≥0.75 counts as a match: P0–G0≈0.933 and P1–G1≈0.781 pass, while P2 and P3 clear the threshold against no reference segment.",
      "metrics.toy.3": "Two matches → precision = 2/4 = 0.50, recall = 2/3 ≈ 0.67, F1 ≈ 0.571.",
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
      "page.title": "EgoANT",
      "hero.title": "EgoANT",
      "hero.grid.aria": "Egocentric human subtask video wall",
      "nav.brand": "EgoANT",
      "references.h2": "References",
      "references.pi05": "Physical Intelligence, Black, Kevin, Brown, Noah, Darpinian, James, Dhabalia, Karan, Driess, Danny, et al. (2025). <em>&pi;<sub>0.5</sub>: a Vision-Language-Action Model with Open-World Generalization</em>. arXiv. <a href=\"https://arxiv.org/abs/2504.16054\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2504.16054</a>",
      "references.wgo": "Macrodata Labs. (2026). <em>WGO-Bench: What's Going On Benchmark</em>. Hugging Face. <a href=\"https://huggingface.co/datasets/macrodata/WGO-Bench\" target=\"_blank\" rel=\"noopener\">https://huggingface.co/datasets/macrodata/WGO-Bench</a>",
      "references.macrodata": "Macrodata Labs. (2026). <em>Segmenting Robot Video into Actionable Subtasks</em>. Macrodata Labs. <a href=\"https://macrodata.co/blog/annotating-robot-video-subtasks\" target=\"_blank\" rel=\"noopener\">https://macrodata.co/blog/annotating-robot-video-subtasks</a>",
      "references.gepa": "Agrawal, Lakshya A., Tan, Shangyin, Soylu, Dilara, Ziems, Noah, Khare, Rishi, Opsahl-Ong, Krista, et al. (2026). <em>GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning</em>. arXiv. <a href=\"https://arxiv.org/abs/2507.19457\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2507.19457</a>",
      "references.scale": "Choghari, Jade, Sansone, Agustin, Pasqualis, Nicolas, Mader, Conrado, Tiupikov, Aleks, Sivapurapu, Mouli. (2026). <em>The Path to Large Scale Dense Video Captioning</em>. Scale Labs. <a href=\"https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning\" target=\"_blank\" rel=\"noopener\">https://labs.scale.com/blog/path-to-large-scale-dense-video-captioning</a>",
      "references.vitra": "Li, Qixiu, Deng, Yu, Liang, Yaobo, Luo, Lin, Zhou, Lei, Yao, Chengtang, et al. (2025). <em>VITRA: Scalable Vision-Language-Action Model Pretraining for Robotic Manipulation with Real-Life Human Activity Videos</em>. Project page. <a href=\"https://microsoft.github.io/VITRA/\" target=\"_blank\" rel=\"noopener\">https://microsoft.github.io/VITRA/</a>",
      "references.hawor": "Zhang, Jinglei, Deng, Jiankang, Ma, Chao, Potamias, Rolandos Alexandros. (2025). <em>HaWoR: World-Space Hand Motion Reconstruction from Egocentric Videos</em>. arXiv. <a href=\"https://arxiv.org/abs/2501.02973\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2501.02973</a>",
      "references.egodex": "Hoque, Ryan, Huang, Peide, Yoon, David J., Sivapurapu, Mouli, Zhang, Jian. (2025). <em>EgoDex: Learning Dexterous Manipulation from Large-Scale Egocentric Video</em>. arXiv. <a href=\"https://arxiv.org/abs/2505.11709\" target=\"_blank\" rel=\"noopener\">https://arxiv.org/abs/2505.11709</a>",
      "references.egoverse": "EgoVerse Consortium. (2026). <em>EgoVerse: Egocentric Data for Robot Learning from Around the World</em>. Project website. <a href=\"https://egoverse.ai/\" target=\"_blank\" rel=\"noopener\">https://egoverse.ai/</a>",
      "references.egolive": "Li, Yihang, Wei, Xuelong, Luo, Jingzhou, Xiao, Yingjing, Bai, Yibo, Zhou, Guangyuan, Zou, Teng, et al. (2026). <em>EgoLive: A Large-Scale Egocentric Dataset from Real-World Human Tasks</em>. arXiv. <a href=\"https://doi.org/10.48550/arXiv.2604.23570\" target=\"_blank\" rel=\"noopener\">https://doi.org/10.48550/arXiv.2604.23570</a>",
      "footer.text": "EgoANT · Shuai Zhou, Jul 2026",
      "tag.pretrain": "Pretraining",
    },
  };

  const APPENDIX_HTML = {
    zh: `
      <h2>8. 附录：概念、公式、实现与成本记账</h2>
      <p class="plain">正文讲“试了什么、分数怎么变”；附录补清楚公式、术语和实现边界。目录：
        <a href="#app-metrics">A 得分</a> · <a href="#app-seg">B 分段概念</a> ·
        <a href="#app-e2e">C 标注/E2E 术语</a> · <a href="#app-prod">D 腕速基线</a> ·
        <a href="#app-visual">E 视觉输入</a> · <a href="#app-prompts">F Prompt</a> ·
        <a href="#app-cost">G 成本</a> · <a href="#audit">H 效度</a>。</p>

      <h3 id="app-metrics">A. 得分方法：直觉 + 公式</h3>
      <figure class="figure">
        <img src="assets/explain/metric_iou_f1_zh.svg" alt="Temporal IoU and F1 scoring diagram" />
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
        <img src="assets/explain/s2_no_pad_full_cover_zh.svg" alt="S2 no-pad full-cover local refinement diagram" />
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

      <h3 id="app-prod">D. EgoANT 的腕速基线管线（并澄清与 VITRA 的关系）</h3>
      <div class="pipeline">
        <div class="step"><div class="n">01</div><div class="t">HaWoR</div><div class="d">手重建 → wrist 轨迹</div></div>
        <div class="step"><div class="n">02</div><div class="t">Smooth</div><div class="d">腕速滤波</div></div>
        <div class="step"><div class="n">03</div><div class="t">Cut</div><div class="d">速度 minima + 短段合并</div></div>
        <div class="step"><div class="n">04</div><div class="t">Caption</div><div class="d">段内 raw 抽帧写短句</div></div>
        <div class="step"><div class="n">05</div><div class="t">Merge</div><div class="d">judge → rewrite</div></div>
      </div>
      <figure class="figure">
        <img src="assets/explain/wrist_speed_oversegmentation_zh.svg" alt="Wrist-speed minima segmentation schematic" />
        <figcaption>这一版管线先用 HaWoR 重建左右手腕轨迹，再对腕速做平滑并在速度低谷切段。这个信号很有用，但停顿、微调、放手和收回也会形成低谷，所以容易把一个完成任务切成太多小段。</figcaption>
      </figure>
      <p>VITRA 启发的是“先手部/运动信号，再 caption”的问题设定；本系统在这一版里用 HaWoR 腕速作为切段信号，不把 VITRA 当作后端模型。它的主要失败模式是<strong>过分割</strong>：动作中途的犹豫或微调在速度曲线上也像边界，后续 merge judge 虽可合并一部分，但在 WGO 的 IoU 口径下仍会拉低 Segment F1。</p>

      <h3 id="app-visual">E. 视觉输入对照</h3>
      <figure class="figure">
        <img src="assets/explain/visual_input_taxonomy_zh.svg" alt="Visual input taxonomy" />
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
        <a href="#app-e2e">C labeling/E2E terms</a> · <a href="#app-prod">D wrist-speed baseline</a> ·
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

      <h3 id="app-prod">D. The EgoANT wrist-speed baseline (and how it relates to VITRA)</h3>
      <div class="pipeline">
        <div class="step"><div class="n">01</div><div class="t">HaWoR</div><div class="d">hand reconstruction to wrist tracks</div></div>
        <div class="step"><div class="n">02</div><div class="t">Smooth</div><div class="d">filter wrist speed</div></div>
        <div class="step"><div class="n">03</div><div class="t">Cut</div><div class="d">speed minima plus short-span merge</div></div>
        <div class="step"><div class="n">04</div><div class="t">Caption</div><div class="d">raw frames inside each segment</div></div>
        <div class="step"><div class="n">05</div><div class="t">Merge</div><div class="d">judge then rewrite</div></div>
      </div>
      <figure class="figure">
        <img src="assets/explain/wrist_speed_oversegmentation.svg" alt="Wrist-speed minima segmentation schematic" />
        <figcaption>This version of the pipeline first reconstructs left/right wrist tracks with HaWoR, smooths wrist speed, and cuts at speed valleys. The signal is useful, but pauses, adjustments, release, and hand retraction can also look like valleys, creating too many segments.</figcaption>
      </figure>
      <p>VITRA motivates the “motion/hand signal first, caption second” framing. EgoANT used HaWoR wrist-speed signals for this first segmentation version; it does not use VITRA as a backend model. Its main failure mode is <strong>over-segmentation</strong>: hesitation and small adjustments often look like boundaries in the speed curve. A later merge judge can repair some of this, but the WGO IoU metric still penalizes fragmented boundaries.</p>

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
    if (L[key] != null) return L[key];
    // Never fall back to Chinese when rendering EN.
    if (lang === "en") return key;
    return I18N.zh[key] || key;
  }

  // Number references by first appearance in the body, then reorder the
  // reference list to match, so [1] is whatever the text cites first.
  function renumberCitations() {
    const list = document.querySelector("#references .ref-list");
    if (!list) return;
    const items = new Map();
    list.querySelectorAll(":scope > li[id]").forEach((li) => items.set(li.id, li));

    const order = {};
    let n = 0;
    document.querySelectorAll("a.cite-ref[href^='#ref-']").forEach((a) => {
      if (list.contains(a)) return;
      const id = a.getAttribute("href").slice(1);
      if (!items.has(id) || order[id]) return;
      order[id] = ++n;
    });
    // Entries never cited in the body keep their relative order at the end.
    items.forEach((li, id) => { if (!order[id]) order[id] = ++n; });

    document.querySelectorAll("a.cite-ref[href^='#ref-']").forEach((a) => {
      const num = order[a.getAttribute("href").slice(1)];
      if (num) a.textContent = String(num);
    });
    Array.from(items.entries())
      .sort((a, b) => order[a[0]] - order[b[0]])
      .forEach((entry) => list.appendChild(entry[1]));
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
    // Diagrams carry their own text, so they ship as one file per language.
    document.querySelectorAll("[data-i18n-src]").forEach((el) => {
      const key = el.getAttribute("data-i18n-src");
      if (!key) return;
      const src = t(key, lang);
      if (src && src !== key && el.getAttribute("src") !== src) el.setAttribute("src", src);
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
    renumberCitations();
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
