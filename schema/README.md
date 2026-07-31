# Open symptom diary format

Version 1.0 describes a portable observation record. It is deliberately non-diagnostic: a row says what a person noticed, when they noticed it, and how it affected them.

Required fields are `recorded_at` and `description`. Optional fields cover intensity, duration, context, possible triggers, function, medication notes, free-text notes, and tags.

## Privacy guidance

- Keep the file private unless you have a clear reason to share it.
- Remove names, precise locations, contact details, and identifiers before sharing.
- Do not publish row-level health data as an open dataset.
- Obtain appropriate consent and ethics review for research use.

The JSON Schema is in `symptom-diary.schema.json`; a matching CSV header and synthetic sample are also included.

