---
title: 'LSRP*: Scalable and Anytime Planning for Multi-Agent Path Finding with Asynchronous
  Actions'
authors:
- Shuai Zhou
- Shizhe Zhao
- Zhongqiang Ren
date: '2025-05-17'
publishDate: '2025-06-07T12:38:28.487715Z'
publication_types: ['paper-conference']

publication: '*International Symposium on Combinatorial Search (SoCS)*'
publication_short: In *SoCS 2025*

abstract: Multi-Agent Path Finding (MAPF) seeks collision-free paths for multiple agents from their respective starting locations to their respective goal locations while minimizing path costs. Although many MAPF algorithms were developed, most of them rely on a common assumption on synchronized actions, where the actions of all agents start at the same time and always take a time unit. This assumption may limit use of MAPF planners in practice. To get rid of this assumption, recently, an algorithm called Loosely Synchronized Rule-Based Planning (LSRP) is proposed, which can find sub-optimal solutions for many agents. However, LSRP often finds poor quality solutions due to its unbounded sub-optimality. This paper develops a new anytime planner called LSRP* that can keep improving solution quality after the initial solution is obtained until the runtime budget depletes. We analyze the properties of LSPR* and test it against several baselines with up to 1000 agents in various maps. LSRP* can handle up to 25% more agents than LSRP and can reduce up to 40% of the solution cost found by LSRP

tags:
  - Large-Scale Planning
  - Multi-Robot corrdination
  - Optimization

featured: true

url_pdf: 'https://doi.org/10.1609/socs.v18i1.36016'
url_poster: 'https://drive.google.com/file/d/12uBf5DxsSL3Yo5pITBcm4GZrfgPRJ4OG/view?usp=sharing'


image:
  caption: 'Search tree'
  focal_point: ''
  preview_only: false  

---
