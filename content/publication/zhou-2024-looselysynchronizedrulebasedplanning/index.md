---
title: Loosely Synchronized Rule-Based Planning for Multi-Agent Path Finding with
  Asynchronous Actions
authors:
- Shuai Zhou
- Shizhe Zhao
- Zhongqiang Ren
date: '2025-02-27'
publishDate: '2025-02-27T15:46:30.699711Z'
publication_types: ['paper-conference']

publication: '*In Proceedings of the 39th AAAI Conference on Artificial Intelligence*'
publication_short: In *AAAI 2025*

abstract: Multi-Agent Path Finding (MAPF) seeks collision-free paths for multiple agents from their respective starting locations to their respective goal locations while minimizing path costs. Although many MAPF algorithms were developed and can handle up to thousands of agents, they usually rely on the assumption that each action of the agent takes a time unit, and the actions of all agents are synchronized in a sense that the actions of agents start at the same discrete time step, which may limit their use in practice. Only a few algorithms were developed to address asynchronous actions, and they all lie on one end of the spectrum, focusing on finding optimal solutions with limited scalability. This paper develops new planners that lie on the other end of the spectrum, trading off solution quality for scalability, by finding an unbounded suboptimal solution for many agents. Our method leverages both search methods (LSS) in handling asynchronous actions and rule-based planning methods (PIBT) for MAPF. We analyze the properties of our method and test it against several baselines with up to 1000 agents in various maps. Given a runtime limit, our method can handle an order of magnitude more agents than the baselines with about 25% longer makespan.

tags:
  - Path Planning
  - Multi agent system
  - Robotics

featured: true

links:
- name: arXiv
  url: https://arxiv.org/abs/2412.11678
- name: Post
  url: https://rap-lab.github.io/research/mapfaa 

url_pdf: 'https://doi.org/10.1609/aaai.v39i14.33618'
url_code: 'https://github.com/rap-lab-org/public_LSRP'
url_poster: 'https://drive.google.com/file/d/1-gxuRvtTx6Nygspj91f4_VbNmsnvPaUO/view?usp=sharing'


image:
  caption: 'Brief illustration'
  focal_point: ''
  preview_only: false
 

# projects:
#   - example 

# slides: 

#   - example
---
