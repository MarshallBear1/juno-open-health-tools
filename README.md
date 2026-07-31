# Juno Open Health Tools

Free, privacy-conscious tools for turning messy symptom notes into a clearer appointment conversation.

This repository includes:

- an open JSON Schema and CSV format for a portable symptom diary;
- synthetic examples (no real patient data);
- an importable Notion appointment-preparation workspace;
- a printable, Canva-importable appointment-preparation pack;
- a Chrome/Edge quick-note extension source link;
- a Juno Health Tools MCP app for ChatGPT and Codex;
- methods and citation guidance for researchers and patient organisations.

## Safety and privacy

These materials help people organise information. They do not diagnose, recommend treatment, replace a clinician, or provide emergency care. The examples are synthetic. The MCP tools process submitted text in memory and do not intentionally persist it. Avoid adding information you would not want handled by the service or workspace where you use a template.

If symptoms may be urgent or life-threatening, contact local emergency services or an appropriate clinician.

## Quick starts

### Notion

Import the CSV files in [`templates/notion`](templates/notion) into a new private Notion page, then follow the included setup guide.

### Printable / Canva

Use the PDF in `output/pdf/` as-is, or upload it to Canva to make a personal editable copy. The source generator is in `scripts/`.

### MCP app

The public endpoint is documented in [`app/README.md`](app/README.md). Local development:

```bash
cd app
npm install
npm test
npm run dev
```

## Open symptom diary standard

The schema is intentionally small and patient-controlled. It captures observations rather than asserting diagnoses or causal relationships. See [`schema/README.md`](schema/README.md).

## Citation

If you use or adapt these resources in research, education, or community support, cite the versioned Zenodo release listed in [`CITATION.cff`](CITATION.cff).

## About Juno

[Juno](https://junocompanion.com/?utm_source=github&utm_medium=referral&utm_campaign=open-health-tools) helps people living with chronic illness capture symptoms, find clearer language for hard-to-describe experiences, and prepare for appointments. This open repository is usable without a Juno account.

## Contributing

Small, evidence-aware contributions are welcome. Do not submit personal health information, real patient records, or clinical claims without appropriate evidence and review.

## License

MIT. See [`LICENSE`](LICENSE).

