---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
      headings:              
        about: ''
        education: ''
        interests: ''
    design:
    # Use the new Gradient Mesh which automatically adapts to the selected theme colors
      background:
        gradient_mesh:
          enable: true
      # css_class: dark
      # background:
      #   color: black
      #   image:
      #     # Add your image background to `assets/media/`.
      #     filename: background.png
      #     filters:
      #       brightness: 0.1
      #     size: cover
      #     position: center
      #     parallax: false
      avatar:                
        size: medium
        shape: circle
  - block: markdown
    content:
      title: '🤖 Research'
      subtitle: ''
      text: |-

        <p style="font-size:0.9rem;color:#6b7280;font-style:italic;margin:8px 0;">Note: Due to space constraints, the following is a condensed summary. For detailed insights from past projects and comprehensive future research plans (envisioned to span 5+ years with flexibility to adapt), please contact me for my full application package or Statement of Purpose.</p>
        
        <figure style="text-align: center; margin: 18px 0;">
          <img src="uploads/EgoX.png" alt="Projects diagram" style="max-width:100%;height:auto;display:inline-block;box-shadow:0 6px 18px rgba(0,0,0,0.25);border-radius:6px;" />
          <figcaption style="margin-top:8px;font-size:0.9rem;color:var(--text-muted,#9aa0a6);">Ongoing Robot Manipulation Project</figcaption>
        </figure>

        Short Summary: My research goal is to develop next-generation decision-making frameworks that unify planning with learning world abstractions. Building on it, I aim to enable multi-robot collaboration on tasks beyond single-robot capabilities and, ultimately, integrate safe human-robot interaction to deploy such systems as assistive robots for people with disabilities. This vision was gradually formed during my undergraduate research, which involved four projects that I led or co-led at four labs. Roughly, they are structured into three components: Planning, Robot Learning and Multi-Robot Systems. 

        <figure style="text-align: center; margin: 18px 0;">
          <img src="uploads/Colla.png" alt="Projects diagram" style="max-width:100%;height:auto;display:inline-block;box-shadow:0 6px 18px rgba(0,0,0,0.25);border-radius:6px;" />
          <figcaption style="margin-top:8px;font-size:0.9rem;color:var(--text-muted,#9aa0a6);">Ongoing Multi-Robot Collaboration Project</figcaption>
        </figure>

        Previous Experience: My ongoing projects respectively focus on learning generalizable manipulation policies across diverse robotic embodiments like G1 Humanoids, Go1 Quadrupeds and bimanual robot arms (CMU Safe AI Lab) , and designing collaborative Multi-robot Task and Motion Planning (TAMP) with flow-matching (CMU ARCS Lab). My previous projects were about heuristic search and multi-robot motion planning (SJTU RAP Lab & UCI IDM Lab), bridging the gap between planning and real-world execution with algorithms that account for practical constraints (CMU ARCS Lab). Some of my works on handling robots with heterogeneous speeds are published (AAAI 2025, SoCS 2025), and others on solving time-sensitive task allocation with kinematic constraints are under review. 

        <figure style="text-align: center; margin: 18px 0;">
          <img src="uploads/Planning.png" alt="Planning diagram" style="max-width:100%;height:auto;display:inline-block;box-shadow:0 6px 18px rgba(0,0,0,0.25);border-radius:6px;" />
          <figcaption style="margin-top:8px;font-size:0.9rem;color:var(--text-muted,#9aa0a6);">Credit: Keisuke Okumura (twitter)</figcaption>
        </figure>
        
        Looking Forward: I like how planning explores the state space with human-prior intelligence, as well as the learning strategies for their efficiency in indescribable modeling. However, they respectively fail in certain scenarios, such as handling unknown worlds, long-term task decomposition and reasoning, and synchronized collaboration across embodiments. This encourages me to unify them. Following my long-standing personal interest and conviction that robots should exist naturally in our daily lives, I envision extending these capabilities toward human-robot interaction. When robots possess sufficient general competence, they should intelligently reason about implicit human values and preferences, going beyond merely collision-free safety to achieve truly empathetic and context-aware interaction. My ultimate aspiration is to develop assistive robots that seamlessly integrate into our lives, bringing warmth and support to people, much like Baymax. To achieve this, I plan to draw upon prior work in planning, multi-agent systems, robot learning, cognitive science, and human–robot interaction. I'm not an expert on everything, but I'm always excited to learn. Please drop me an email if you're interested, we could collaborate on some exciting projects!


    design:
      columns: '2'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publications
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    id: projects
    content:
      title: Projects
      subtitle: 'I had some fun doing them.'
      filters:
        folders:
          - projects
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: Publications (* equal contribution)
      text: ""
      filters:
        folders:
          - publications
        exclude_featured: false
    design:
      view: citation
  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      # Page type to display. E.g. post, talk, publication...
      page_type: blog
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: date-title-summary
      # Reduce spacing
      spacing:
        padding: [0, 0, 0, 0]
  # - block: collection
  #   id: talks
  #   content:
  #     title: Recent & Upcoming Talks
  #     filters:
  #       folders:
  #         - events
  #   design:
  #     view: card
  #     columns: 1
  # - block: collection
  #   id: news
  #   content:
  #     title: Recent News
  #     subtitle: ''
  #     text: ''
  #     # Page type to display. E.g. post, talk, publication...
  #     page_type: post
  #     # Choose how many pages you would like to display (0 = all pages)
  #     count: 5
  #     # Filter on criteria
  #     filters:
  #       author: ""
  #       category: ""
  #       tag: ""
  #       exclude_featured: false
  #       exclude_future: false
  #       exclude_past: false
  #       publication_type: ""
  #     # Choose how many pages you would like to offset by
  #     offset: 0
  #     # Page order: descending (desc) or ascending (asc) date.
  #     order: desc
  #   design:
  #     # Choose a layout view
  #     view: date-title-summary
  #     # Reduce spacing
  #     spacing:
  #       padding: [0, 0, 0, 0]
  - block: markdown
    content:
      title: '🌏 Visitor'
      text: |-
        <div style="text-align: center; margin: 20px auto;">
          <a href="https://mapmyvisitors.com/web/1bz6a" title="Visit tracker"><img src="https://mapmyvisitors.com/map.png?cl=ffffff&w=700&t=tt&d=ogNlizHBKR3qP5XFYl7x9CxhF9oZW8XuAaqkdd80ahE" /></a>
        </div>
    design:
      columns: '1'
  - block: cta-card
    demo: true # Only display this section in the Hugo Blox Builder demo site
    content:
      title: 👉 Build your own academic website like this
      text: |-
        This site is generated by Hugo Blox Builder - the FREE, Hugo-based open source website builder trusted by 250,000+ academics like you.

        <a class="github-button" href="https://github.com/HugoBlox/hugo-blox-builder" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star HugoBlox/hugo-blox-builder on GitHub">Star</a>

        Easily build anything with blocks - no-code required!
        
        From landing pages, second brains, and courses to academic resumés, conferences, and tech blogs.
      button:
        text: Get Started
        url: https://hugoblox.com/templates/
    design:
      card:
        # Card background color (CSS class)
        css_class: "bg-primary-700"
        css_style: ""
---