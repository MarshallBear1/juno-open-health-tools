# Juno Health Tools MCP app

Public, no-account tools for organising health observations. The app does not diagnose, recommend treatment, or persist tool inputs in an application database.

## Tools

- `find_symptom_words`
- `build_health_timeline`
- `prepare_appointment_brief`
- `reflect_on_flare`
- `render_appointment_brief`

The first four return portable structured data. The render tool turns a completed brief into an accessible inline card.

## Local development

```bash
npm install
npm test
npm run dev
```

MCP endpoint: `http://localhost:3000/api/mcp`

## Data handling

Submitted content is processed in memory for the response. The app does not intentionally retain it or use it for advertising. Infrastructure providers may process request metadata according to their policies. See `/privacy` on the deployed app.

