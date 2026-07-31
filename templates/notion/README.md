# Juno Appointment Prep — Notion setup

This is a free, importable appointment-preparation system. It is designed for a private personal workspace, not as a clinical record system.

1. In Notion, create a private page named **Appointment Prep**.
2. Import `appointments.csv` as a database.
3. Import `symptom_observations.csv` as a second database.
4. Import `medications_and_questions.csv` as a third database.
5. Add the checklist from `appointment-checklist.md` above the databases.
6. Keep the synthetic example rows until you understand the structure, then delete them.

Suggested database views:

- **Next appointment:** filter appointments where `Status` is `Planning`.
- **Changes to mention:** filter observations where `Share at next appointment` is `Yes`.
- **Open questions:** filter questions where `Status` is `Open`.

## Privacy note

Notion is a general-purpose workspace. Decide whether it is appropriate for the sensitivity of information you plan to add, use a private page, review sharing permissions, and avoid unnecessary identifiers.

