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
    design:
      css_class: dark
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
          filename: background.png
          filters:
            brightness: 0.3
          size: cover
          position: center
          parallax: false
  - block: markdown
    content:
      title: '🤖 My Research'
      subtitle: ''
      text: |-
        My research interests lie at the intersection of multi-agent systems and motion planning in robotics. During my undergraduate studies, I have focused primarily on Multi-Agent Path Finding (MAPF)—an NP-hard problem that poses significant challenges due to the curse of dimensionality. MAPF has important real-world applications, particularly in warehouse logistics systems such as those used by [Amazon](https://www.aboutamazon.com/news/tag/robotics) and [Symbotic](https://www.symbotic.com/). My work aims to bridge the gap between abstract planning and real-world execution by developing MAPF algorithms that account for practical constraints. These include handling agents with heterogeneous speeds (MAPF with Asynchronous Actions), meeting time-sensitive requirements (MAPF with Deadlines), and incorporating kinematic constraints (Execution-Aware MAPF). I am open to collaborations in the MAPF domain, as well as in extending its techniques to other areas of robotics. 

        My previous and ongoing projects have all focused on search-based methods. While I value the theoretical guarantees and interpretability these approaches provide, I am also eager to explore the potential of learning-based methods. For instance, I am particularly interested in using learning techniques—such as reinforcement learning or imitation learning—as heuristics to guide decision-making in high dimension planning problems. At the same time, I am actively broadening my knowledge in areas such as multi-agent motion planning, multi-robot arm coordination, and emerging paradigms like diffusion models. I am curious whether insights from search-based MAPF methods could inspire new ideas or serve as strong priors in these related domains. I am always open to discussion and collaboration across these intersections.

        I am seeking a Ph.D. position starting in Fall 2026 and plan to apply to programs in Robotics, Computer Science, Electrical Engineering, Mechanical Engineering, or Aerospace Engineering. Some of the above are questions I would like to explore during my PhD.
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 1
  - block: collection
    id: news
    content:
      title: Recent News
      subtitle: ''
      text: ''
      # Page type to display. E.g. post, talk, publication...
      page_type: post
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
  - block: collection
    content:
      title: Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
  # - block: collection
  #   id: talks
  #   content:
  #     title: Recent & Upcoming Talks
  #     filters:
  #       folders:
  #         - event
  #   design:
  #     view: article-grid
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
