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
      title: 'A Board for 🤖'
      subtitle: ''
      text: |-
        <div style="max-width:1200px;margin:0 auto;">

        After wrapping up my ongoing projects at CMU around March 2nd, I am looking for internships focused on robot foundation models or any direction that may lead toward general-purpose robotics.
 
        I was a robot planning guys and once drawn to combining neuro-symbolic planning with foundation models for long-horizon tasks, but ran into difficulties fitting classical TAMP structures into a framework that could hierarchically learn symbolic concepts while handling uncertainty and partial observability. If you know of work addressing this, or are interested in exploring it together, please reach out. More recently, I have been shifting my focus to purely learning-based approaches, such as VLAs or world models, to see how well they handle long-horizon reasoning and manipulation, and whether classical planning and control ideas at the high level can offer new perspectives.

        <figure style="text-align: center; margin: 18px 0;">
          <img src="uploads/EgoX.png" alt="Projects diagram" style="max-width:100%;height:auto;display:inline-block;box-shadow:0 6px 18px rgba(0,0,0,0.25);border-radius:6px;" />
          <figcaption style="margin-top:8px;font-size:0.9rem;color:var(--text-muted,#9aa0a6);">Cross-Embodiment Manipulation</figcaption>
        </figure>

        Currently I am at CMU working on projects that with the two paradiam i mentioned ahead. One is pure learning-based manipulation for humanoid manipulation, or later cross-embodiment manipulation. And hierachical planning with learning policies, a multi-robot pushing manipulation with flow-matching sampler. Earlier, I developed algorithms for warehouse robot coordination. 

        <figure style="text-align: center; margin: 18px 0;">
          <img src="uploads/Colla.png" alt="Projects diagram" style="max-width:100%;height:auto;display:inline-block;box-shadow:0 6px 18px rgba(0,0,0,0.25);border-radius:6px;" />
          <figcaption style="margin-top:8px;font-size:0.9rem;color:var(--text-muted,#9aa0a6);">Planning Multi-Robot Collaboration with learned manipulation policy</figcaption>
        </figure>

        I will be back at CMU Robotics Institute this Fall as an MSR, working on the direction that I mentioned above.

        </div>


  #   design:
  #     columns: '1'
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