---
name: build-health-timeline
description: Organise dated health observations, tests, appointments, medication changes, and functional changes into a concise timeline. Use when someone needs chronology for a clinician, benefits form, care handoff, or their own records without asking Codex to infer a diagnosis.
---

# Build a health timeline

## Privacy gate

Before sending text to the Juno Health Tools MCP server, disclose that it will be processed transiently without intentional application storage and ask whether the user wants to continue. Invoke the tool only after explicit agreement and set `consentConfirmed` to `true`. Ask only for brief, user-authored, non-identifying observations. Do not request or accept PHI, names, contact details, record or insurance numbers, credentials, provider documents, or text copied from a clinical system.

1. Keep dates exactly as supplied; use “date uncertain” when needed.
2. Separate observations, reported diagnoses, tests, treatments, and user-suspected triggers.
3. Sort chronologically and merge only true duplicates.
4. Highlight first onset, material worsening or improvement, medication changes, and changes in function.
5. Produce a short “what changed overall” summary that states facts and uncertainty.

Never convert correlation into causation. Attribute clinical statements, for example “user reports clinician diagnosed …”. Do not fill missing dates or results from memory.
