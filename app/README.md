# Juno Health Tools MCP app

Public, no-account tools for organising health observations. The app does not diagnose, recommend treatment, or persist tool inputs in an application database.

## Tools

- `find_symptom_words`
- `build_health_timeline`
- `prepare_appointment_brief`
- `reflect_on_flare`
- `render_appointment_brief`

The first four return portable structured data. The render tool turns a completed brief into an accessible inline card. All tools have explicit input and output schemas plus read-only, closed-world, non-destructive annotations.

## Local development

```bash
npm install
npm test
npm run dev
```

MCP endpoint: `http://localhost:3000/api/mcp`

## Data handling

Before a tool call, the plugin must disclose its transient processing and obtain explicit agreement. Every tool requires `consentConfirmed: true`. The app accepts only brief, non-identifying, user-authored notes; it must not receive PHI, names, contact details, record or insurance numbers, credentials, provider documents, or text copied from a clinical system.

Submitted content is processed in memory for the response. The app does not intentionally retain it or use it for advertising. Infrastructure providers may process request content and security metadata according to their policies. See `/privacy` on the deployed app.

Public support is available at `/support`.

## Submission package

The combined four-skill and five-tool plugin is in `../plugins/juno-health-tools`. Build its upload ZIP from the repository root with:

```bash
./scripts/package_plugin.sh
```

The complete portal listing and reviewer tests are in `../submissions/openai-plugin-2026.md`.
