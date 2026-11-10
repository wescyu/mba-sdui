# Screen contract, version 1

A screen is a JSON object:

```json
{ "schemaVersion": 1, "id": "home", "blocks": [ ... ] }
```

Each block has a `type`. The app draws blocks top to bottom.

| type | fields | what it draws |
| --- | --- | --- |
| `header` | `title`, `eyebrow?`, `subtitle?` | Screen title |
| `text` | `text` | A paragraph |
| `rule` | `text` | The one rule to remember |
| `card` | `title`, `eyebrow?`, `body?`, `action?` | A tappable card |
| `button` | `label`, `action` | A primary button |
| `quiz` | `questions[]`, `next?` | A question game with XP and streaks |

A quiz question: `{ "prompt", "options": [{ "label", "hint?" }], "answer": <index>, "why" }`.
`next` is `{ "label", "action" }`, shown when the quiz is finished.

An action: `{ "type": "navigate", "to": "<screen id>" }`.

## Rules for changing the contract

1. Adding a new block type or an optional field is safe. Old apps skip blocks they don't know.
2. Removing or renaming a field breaks old apps. Bump `schemaVersion` instead.
