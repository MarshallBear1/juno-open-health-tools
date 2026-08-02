# Juno Open Health Tools

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21730086.svg)](https://doi.org/10.5281/zenodo.21730086)

Free, privacy-conscious tools for turning messy symptom notes into a clearer appointment conversation.

This repository includes:

- an open JSON Schema and CSV format for a portable symptom diary;
- synthetic examples (no real patient data);
- an importable Notion appointment-preparation workspace;
- a printable, Canva-importable appointment-preparation pack;
- a local-first Chrome/Edge appointment-prep extension;
- a Juno Health Tools MCP app for ChatGPT and Codex;
- a combined four-skill and five-tool OpenAI plugin package with explicit consent and privacy boundaries.
- a production-derived React Native Skia tutorial for compressing images to a strict byte budget.

## Safety and privacy

These materials help people organise information. They do not diagnose, recommend treatment, replace a clinician, or provide emergency care. The examples are synthetic. The MCP tools process submitted text in memory and do not intentionally persist it. Avoid adding information you would not want handled by the service or workspace where you use a template.

If symptoms may be urgent or life-threatening, contact local emergency services or an appropriate clinician.

## Quick starts

### Notion

Duplicate the [free public Juno Appointment Prep template](https://inquisitive-slug-0e4.notion.site/Juno-Appointment-Prep-Free-Template-3ae65ef19af080219b65fc887aa0c280), or import the files in [`templates/notion`](templates/notion) into a new private Notion page.

### Printable / Canva

Use the PDF in `output/pdf/` as-is, or upload the layered PowerPoint in [`templates/canva`](templates/canva) to Canva for a more editable personal copy. The source generators are in `scripts/`.

### Chrome / Edge extension

Use the source in [`extension`](extension), or download the store-ready ZIP from the latest GitHub release. It saves short changes, timeline points, daily-life impacts, and questions in local browser storage, then creates a copyable appointment plan. It makes no remote requests and requires only the browser `storage` permission.

### MCP app

Try the [public Juno Health Tools app](https://juno-health-tools.vercel.app), or read the endpoint documentation in [`app/README.md`](app/README.md). Local development:

```bash
cd app
npm install
npm test
npm run dev
```

The public plugin source is in [`plugins/juno-health-tools`](plugins/juno-health-tools), with submission and reviewer materials in [`submissions/openai-plugin-2026.md`](submissions/openai-plugin-2026.md).

The remote server is published as [`io.github.MarshallBear1/juno-open-health-tools`](https://registry.modelcontextprotocol.io/?q=io.github.MarshallBear1%2Fjuno-open-health-tools) in the official MCP Registry.

## Open symptom diary standard

The schema is intentionally small and patient-controlled. It captures observations rather than asserting diagnoses or causal relationships. See [`schema/README.md`](schema/README.md).

## Engineering tutorials

- [Compressing a React Native image to a strict byte budget with Skia](tutorials/react-native-skia-image-byte-budget.md) includes a reusable TypeScript implementation, exact Base64 byte accounting, explicit native-object cleanup, and production caveats.

## Citation

If you use or adapt these resources in research, education, or community support, cite the versioned Zenodo release listed in [`CITATION.cff`](CITATION.cff).

Version 1.3.0 is permanently archived at [doi:10.5281/zenodo.21730086](https://doi.org/10.5281/zenodo.21730086). Earlier releases remain available in the [Zenodo version history](https://doi.org/10.5281/zenodo.21729518).

The public source history is independently preserved by Software Heritage as [`swh:1:snp:dff7fdc223846efafa269f3dbf17e7d3fecf78bf`](https://archive.softwareheritage.org/swh:1:snp:dff7fdc223846efafa269f3dbf17e7d3fecf78bf/).

Machine-readable software metadata is available in [`codemeta.json`](codemeta.json) for research catalogues and automated indexing systems.

## Further reading

The Medium guide, [“A better way to prepare for a health appointment when your symptoms are messy”](https://medium.com/@Marsh30/a-better-way-to-prepare-for-a-health-appointment-when-your-symptoms-are-messy-df9e62d83f5a), explains the patient problem these resources are designed to address.

## About Juno

[Juno](https://junocompanion.com/?utm_source=github&utm_medium=referral&utm_campaign=open-health-tools) helps people living with chronic illness capture symptoms, find clearer language for hard-to-describe experiences, and prepare for appointments. This open repository is usable without a Juno account.

## Contributing

Small, evidence-aware contributions are welcome. Do not submit personal health information, real patient records, or clinical claims without appropriate evidence and review.

## License

MIT. See [`LICENSE`](LICENSE).
