---
title: 'Bridging Planning and Execution: Multi-Agent Path Finding Under Real-World
  Deadlines'
authors:
authors:
- "[Jingtian Yan*](https://jingtianyan.github.io/)"
# - Jingtian Yan*
- Shuai Zhou*
- Stephen F. Smith
- Jiaoyang Li
date: '2025-11-25'
publishDate: '2025-12-01T03:00:11.682662Z'
publication_types:
- manuscript

publication: '*Under Review*'
publication_short: '*Under Review*'

abstract: The Multi-Agent Path Finding (MAPF) problem aims to find collision-free paths for multiple agents while optimizing objectives such as the sum of costs or makespan. MAPF has wide applications in domains like automated warehouses, manufacturing systems, and airport logistics. However, most MAPF formulations assume a simplified robot model for planning, which overlooks execution-time factors such as kinodynamic constraints, communication latency, and controller variability. This gap between planning and execution is problematic for timesensitive applications. To bridge this gap, we propose REMAP, an execution-informed MAPF planning framework that can be combined with leading search-based MAPF planners with minor changes. Our framework integrates the proposed ExecTimeNet to accurately estimate execution time based on planned paths. We demonstrate our method for solving MAPF with Realworld Deadlines (MAPF-RD) problem, where agents must reach their goals before a predefined wall-clock time. We integrate our framework with two popular MAPF methods, MAPF-LNS and CBS. Experiments show that REMAP achieves up to 20% improvement in solution quality over baseline methods (e.g.,constant execution speed estimators) on benchmark maps with up to 300 agents.

tags:
  - Learning for Planning
  - Multi-Robot corrdination
  - Heuristic Search

featured: true

links:
- name: arXiv
  url: https://arxiv.org/abs/2511.21886


image:
  caption: 'Framework structure'
  focal_point: ''
  preview_only: false
---
