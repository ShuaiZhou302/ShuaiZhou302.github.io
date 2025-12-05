---
title: G1 Humanoid Whole-Body Controller
date: 2025-10-26
links:
  - type: site
    url: https://human2bots.github.io/egox/
tags:
  - Robotics
  - Control
  - Reinforcement Learning
  - Imitation Learning
---

A two-stage learning pipeline for humanoid robot locomotion: Teacher Policy (RL) trained with privileged information in simulation, and Student Policy (IL) distilled from teacher using only proprioceptive observations.

<!--more-->

## Overview

This project implements a comprehensive learning pipeline for humanoid robot locomotion control:

- **Teacher Policy (RL)**: Trained with privileged information in simulation
- **Student Policy (IL)**: Distilled from teacher using only proprioceptive observations
- **Upper-body Motion Retargeting**: Integration with AMASS dataset for natural movements
- **Real Robot Deployment**: Robust control on physical G1 humanoid

## Simulation at IsaacSym

{{< youtube tAnz9FzyQI8 >}}

## Real-world Robot Deployment

{{< youtube d3DPm1t-zJM >}}

## Preview: Stable Manipulation

{{< youtube m4jfw-I9Ir0 >}}

## Technical Details

### 1. Teacher Training (Reinforcement Learning)

**Input:**
- **Proprioceptive observations** (Proprio_t):
  - Angular velocity (3), projected gravity (3)
  - Joint positions (29), joint velocities (29)
  - Last actions (29)
- **Command** (Comd_t): Linear velocity (x, y), angular velocity (z), height, body orientation (roll, pitch, yaw)
- **Privileged information** (Priv_t):
  - Feet contact (2), linear velocity (3)
  - Height scan from ray casting

**Output:**
- Lower-body actions (a_t^tea): Target joint positions for 29 DOF (legs + waist + arms)

**Training:**
- Algorithm: PPO (Proximal Policy Optimization)
- Environment: Isaac Sim with terrain curriculum
- Reward: Track AMASS upper-body motions while maintaining stable locomotion

### 2. Upper-body Motion Retargeting

**AMASS Dataset:**
- Human motion capture data retargeted to robot skeleton
- Provides natural upper-body movements (q_t^upper)

**Integration:**
- Teacher policy controls lower-body (legs + waist)
- AMASS motions control upper-body (arms)
- Combined for realistic humanoid behavior

### 3. Student Training (Imitation Learning)

**Input:**
- Current observation (O_t): Same as teacher (without privileged info)
- History (O_{t-1}): Previous observation for temporal context
- Total input: 116 dims (2 × 58)

**Output:**
- Lower-body actions (a_t^stu): Target joint positions for 15 DOF (legs + waist only)

**Training Methods:**
- BC (Behavioral Cloning): Supervised learning from teacher demonstrations
- DAgger: Interactive learning with teacher corrections

**Architecture:**
- MLP: 116 → 512 → 256 → 128 → 15
- Activation: ELU

### 4. Deployment Pipeline

**Real Robot Communication:**
1. **State feedback**: Robot publishes joint positions, velocities, IMU data via SDK2
2. **Observation construction**: Build 58-dim proprioceptive state + command
3. **Student inference**: Run JIT-compiled policy (20ms control loop)
4. **Command execution**: Send target positions with PD gains (kp/kd) to motors

**Key Features:**
- History buffer: 2 steps for temporal awareness
- JIT compilation: Fast inference on robot
- PD control: Position tracking with tuned gains