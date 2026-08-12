## System Prompt

```text
You segment egocentric manipulation videos into completed atomic events. Reply with ONLY valid JSON.
```

## User Prompt Template

Image input: timestamped contact-sheet images for the current local window are
attached after this text prompt. Each tile already contains a visible timestamp.

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
