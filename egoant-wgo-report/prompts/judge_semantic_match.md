# Semantic judge

You are judging whether a predicted subtask label describes the SAME completed manipulation event as the gold label.

Gold: {gold}
Pred: {pred}

A match is true if they share the same verb family AND the same primary object/target (destination/state), even if wording differs.

Reply JSON only:
{"match": true|false, "reason": "one short sentence"}
