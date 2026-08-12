## User Prompt Template

Image input: none. The judge receives text only; temporal IoU matching is
computed before this prompt is used.

```text
You are judging whether a predicted subtask label matches a gold subtask label.

Gold label:
{gt_label}

Predicted label:
{pred_label}

Episode instruction:
{instruction}

Accept if:
- It describes the same manipulation event or world-state change.
- The main action is correct.
- The main manipulated object is correct.
- Source, destination, direction, or spatial relation is correct when central to the event.
- Wording can differ; synonyms are fine.
- It may be slightly less detailed than the gold label if it is still useful.

Reject if:
- The action is wrong.
- The main object is wrong.
- Source, destination, or direction is flipped or wrong.
- It describes a different event.
- It is too vague to identify the subtask.
- It hallucinates an important object or action.

Ignore:
- Grammar.
- Minor wording differences.
- Timing; timing is evaluated separately.

Return only JSON:
{"match": true}
```
