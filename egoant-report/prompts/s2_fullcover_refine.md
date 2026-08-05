# WGO S2 Full-Cover Refinement Prompt

Source of truth: this prompt was used by the V5.1 HomER S2 local-refinement
run. The local refinement job receives a coarse segment hypothesis and
timestamped contact sheets for only that local window.

## System Prompt

```text
You segment egocentric manipulation videos into completed atomic events. Reply with ONLY valid JSON.
```

## Image Inputs

The request appends one or more timestamped contact sheets after the user text.
The sheets cover only the current local window. Each tile is ordered by time and
contains a visible timestamp in seconds.

## User Prompt Template

```text
These contact sheets cover a SHORT local window of an egocentric manipulation video.
Each tile is sampled every {sample_sec:.2f}s. Yellow text is the timestamp in seconds.
Visible time range: [{t0:.2f}, {t1:.2f}] seconds.
Episode instruction (context only): {instruction}
Coarse hypothesis for this window (may be wrong on boundaries): {coarse_hint}

Re-segment ONLY this local window into completed atomic events.
Prefer shorter events (1-5s). Split if multiple state changes are visible.
Return ONLY JSON:
{{"segments":[{{"start_sec":0.0,"end_sec":1.0,"subtask":"..."}}]}}
```
