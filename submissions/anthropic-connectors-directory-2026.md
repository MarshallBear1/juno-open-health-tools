# Anthropic Connectors Directory submission — Juno Health Tools

Prepared 2 August 2026. This is a reviewer-ready source of truth for an authorised Juno representative. It is not evidence that Anthropic has accepted or published the connector.

## Submission gate

Remote connector submissions now happen in the Claude.ai organisation admin portal. The submitter must be an Owner or Primary owner of a Claude Team or Enterprise organisation, or have an Enterprise role with Directory management or Libraries permission.

Submitting also accepts Anthropic's Software Directory Terms on behalf of the publisher. Only a person authorised to make that representation for SharedGenes, Inc. should complete the portal. Do not use the older public Google Form, email the review escalation address as a substitute, or claim a submission before the portal displays confirmation.

Official guidance:

- https://claude.com/docs/connectors/building/submission
- https://claude.com/docs/connectors/building/review-criteria
- https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy
- https://support.claude.com/en/articles/13145338-anthropic-software-directory-terms

## Connection

| Field | Value |
|---|---|
| Server URL | `https://juno-health-tools.vercel.app/api/mcp` |
| Transport | Streamable HTTP |
| URL model | Every user connects to the same URL |
| Authentication | None |
| Account required | No |
| Public MCP Registry name | `io.github.MarshallBear1/juno-open-health-tools` |
| Public source | https://github.com/MarshallBear1/juno-open-health-tools |
| Documentation | https://github.com/MarshallBear1/juno-open-health-tools/blob/main/app/README.md |
| Privacy policy | https://juno-health-tools.vercel.app/privacy |
| Terms | https://juno-health-tools.vercel.app/terms |
| Support | https://juno-health-tools.vercel.app/support |

## Listing

**Name**

Juno Health Tools

**Permanent slug**

`juno-health-tools`

**Tagline**

Organise health notes for clearer appointments

**Description**

Juno Health Tools helps people turn brief, non-identifying health notes into clearer language and appointment-preparation materials. It can suggest neutral symptom vocabulary, organise dated observations into a factual timeline, structure before/during/after flare notes, and create or render a concise appointment brief.

The tools do not diagnose, recommend treatment, provide clinical decision support, or replace urgent or professional care. Each tool requires explicit consent before transient processing. No account is required, and the application does not intentionally retain tool inputs or outputs.

**Categories**

Select the closest available portal categories to `Health & Wellness`, `Productivity`, and `Accessibility`. Do not invent a category if the portal uses different labels.

**Company**

- Company: SharedGenes, Inc., operating as Juno
- Product name: Juno
- Website: https://junocompanion.com/
- Support email: `team@juno-chat.com`

**Icon**

Use `app/public/juno-plugin-icon-512.png` from the public repository. Verify the rendered portal preview before submission.

## Primary use cases

1. Find neutral, ordinary-language descriptors for a hard-to-name sensation without inferring a condition or cause.
2. Organise user-supplied dated observations into a factual chronology while preserving uncertainty and missing information.
3. Turn brief goals, changes, functional impacts, user-stated medicines, and questions into a concise appointment brief.
4. Structure a flare as before, during, and after observations without turning a suspected pattern into causation.
5. Render a completed appointment brief as an accessible in-chat card.

Users need no account or paid plan. Before any tool call, they must explicitly agree to transient processing and provide only brief, non-identifying, user-authored notes. The tools must not receive PHI, names, contact details, record or insurance numbers, credentials, provider documents, or text copied from a clinical system.

## Example prompts

1. `Help me find neutral words for a heavy feeling behind my eyes after screen time. Do not guess a cause.`
2. `Organise these synthetic observations into a factual timeline: 12 Jul energy dropped after errands; 14 Jul rested most of the day; 18 Jul energy was closer to baseline.`
3. `Create a concise appointment brief. My main concern is unpredictable fatigue, and my goal is to explain the last month clearly while keeping my questions visible.`
4. `Structure this synthetic flare without assuming a cause: before, a busy weekend; during, more fatigue and light sensitivity; after, gradual improvement over three quiet days.`
5. `Render the appointment brief as a readable card with priorities, timeline, impacts, and unanswered questions.`

## Data handling — answer exactly

**Does the connector handle personal health data?**

Yes. User-authored symptom descriptions and appointment notes can be sensitive personal health data even when the product prohibits PHI and direct identifiers. Do not answer `No` merely because the server requests non-identifying text.

**What happens to submitted text?**

The first-party Juno Health Tools endpoint processes the fields approved for the selected tool in memory for the request and response. The application does not require an account and does not intentionally retain tool inputs or outputs in an application database, use them for advertising, sell them, build profiles from them, or send them to the main Juno product. The chosen AI product or MCP client, hosting provider, and network infrastructure may process request content and limited security metadata under their own terms and retention practices.

**Sponsored content?**

No.

**Financial transactions or transfers?**

No.

**AI-generated image, video, or audio?**

No. The render tool formats structured text as an accessible card.

**Conversation history, memory, or user files collected?**

No. Each tool receives only the narrow fields the user expressly supplies for that call.

**API ownership**

The endpoint and public application are operated for Juno. The tools do not proxy an unrelated third-party API.

## Authentication and reviewer access

Choose `No authentication`. No test credentials are required because the endpoint and tools do not use accounts. Tell the reviewer to use the synthetic prompts above, explicitly confirm consent, and set `consentConfirmed` to `true` for successful calls. Also test once without consent to verify the expected refusal.

## Tool inventory

| Tool | Title | Access | Purpose |
|---|---|---|---|
| `find_symptom_words` | Find symptom words | Read-only | Organises a non-identifying description into neutral sensation, timing, pattern, and impact vocabulary. |
| `build_health_timeline` | Build health timeline | Read-only | Sorts user-authored observations into a factual chronology. |
| `prepare_appointment_brief` | Prepare appointment brief | Read-only | Structures minimal appointment goals, changes, impacts, user-stated medicines, and questions. |
| `reflect_on_flare` | Reflect on a flare | Read-only | Structures before, during, and after observations without causal claims. |
| `render_appointment_brief` | Render appointment brief | Read-only | Renders a completed brief as an accessible card. |

All five tools currently expose `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`, an output schema, a human-readable title, a narrow description, and an input schema that requires `consentConfirmed: true`.

## Carousel assets and paired prompts

The prepared PNGs are cropped to the Juno Health Tools response only and are at least 1,000 pixels wide:

| Asset | Paired prompt |
|---|---|
| `assets/anthropic-connectors-directory/01-find-symptom-words.png` | `Help me find neutral words for a heavy feeling behind my eyes after screen time. Do not guess a cause.` |
| `assets/anthropic-connectors-directory/02-build-health-timeline.png` | `Organise these synthetic observations into a factual timeline: 12 Jul energy dropped after errands; 14 Jul rested most of the day; 18 Jul energy was closer to baseline.` |
| `assets/anthropic-connectors-directory/03-prepare-appointment-brief.png` | `Create a concise appointment brief. My main concern is unpredictable fatigue, and my goal is to explain the last month clearly while keeping my questions visible.` |
| `assets/anthropic-connectors-directory/04-reflect-on-flare.png` | `Structure this synthetic flare without assuming a cause: before, a busy weekend; during, more fatigue and light sensitivity; after, gradual improvement over three quiet days.` |
| `assets/anthropic-connectors-directory/05-render-appointment-brief.png` | `Render the appointment brief as a readable card with priorities, timeline, impacts, and unanswered questions.` |

Preview every uploaded crop in the portal. If Anthropic requires screenshots captured inside Claude rather than response-only product crops, replace these assets with fresh in-Claude screenshots while keeping the paired prompts unchanged.

## Verification

Run from the repository root:

```bash
cd app && npm test
cd .. && node scripts/check_mcp_endpoint.mjs https://juno-health-tools.vercel.app/api/mcp
```

The endpoint verifier checks server identity, consent and PHI instructions, five-tool inventory, titles, tool-name length, descriptions, read-only annotations, output schemas, the required consent field, refusal without consent, and a successful synthetic tool call.

## Final authorised handoff

1. Merge and deploy this branch so the privacy notice is platform-neutral.
2. Re-run the endpoint verifier against production and open all documentation, privacy, terms, support, and icon URLs.
3. Sign in to the owning Claude Team or Enterprise organisation as an authorised directory manager.
4. Complete the remote connector portal with the exact factual answers above.
5. Review the permanent slug and legal acknowledgements carefully, then submit.
6. Record the portal confirmation and status in the off-site authority tracker. Do not claim a directory listing until Anthropic publishes it.
