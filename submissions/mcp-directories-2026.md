# MCP directory listings — Juno Health Tools

Prepared 12 October 2026. Paste-ready copy for third-party MCP directories. Every listing should link to the junocompanion.com overview page, so each one also points back to the main Juno site. Submission routes were checked on 12 October 2026 by fetching each site; routes marked **Unverified** could not be confirmed and must be checked in a browser before use.

Nothing in this file has been submitted. Several routes need an account, a paid tier, or a public GitHub issue. Only an authorised Juno representative should complete them.

## Shared copy

| Field | Value |
|---|---|
| Name | Juno Health Tools |
| Repository name | `juno-open-health-tools` |
| Official MCP Registry name | `io.github.MarshallBear1/juno-open-health-tools` |
| One-line description | Consent-gated tools that turn user health notes into non-diagnostic appointment-prep materials. |
| Website | https://junocompanion.com/health-tools |
| MCP server URL | `https://juno-health-tools.vercel.app/api/mcp` |
| Transport | Streamable HTTP (remote) |
| Authentication | None; no account or API key |
| Repository | https://github.com/MarshallBear1/juno-open-health-tools |
| Privacy | https://junocompanion.com/health-tools/privacy |
| Terms | https://junocompanion.com/health-tools/terms |
| Support | https://junocompanion.com/health-tools/support |
| Permanent archive | https://doi.org/10.5281/zenodo.21730086 |
| License | MIT |
| Logo, 512×512 PNG | `plugins/juno-health-tools/assets/juno-plugin-icon-512.png` |
| Logo, 400×400 PNG | `submissions/assets/mcp-directories/juno-health-tools-icon-400.png` |

**Long description**

Juno Health Tools helps people turn brief, non-identifying health notes into clearer language and appointment-preparation materials. It can suggest neutral symptom vocabulary, organise dated observations into a factual timeline, structure before/during/after flare notes, and create or render a concise appointment brief.

The tools do not diagnose, recommend treatment, provide clinical decision support, or replace urgent or professional care. Each tool requires explicit consent (`consentConfirmed: true`) before transient processing. No account is required, and the application does not intentionally retain tool inputs or outputs. Learn more at https://junocompanion.com/health-tools.

**Tools** (all read-only, closed-world, non-destructive, with output schemas)

- `find_symptom_words` — neutral sensation, timing, pattern, and impact vocabulary for a non-identifying description.
- `build_health_timeline` — sorts user-authored observations into a factual chronology while preserving uncertainty.
- `prepare_appointment_brief` — structures a main goal, changes, impacts, user-stated medicines, and questions into a concise brief.
- `reflect_on_flare` — structures before, during, and after observations without causal claims.
- `render_appointment_brief` — renders a completed brief as an accessible card.

**Categories:** use the closest available labels to Health & Wellness, Productivity, and Accessibility. Do not invent a category.

**Tags:** appointment preparation, symptom notes, health timeline, chronic illness, privacy, consent, non-diagnostic

**Client configuration**

```json
{
  "mcpServers": {
    "juno-health-tools": {
      "url": "https://juno-health-tools.vercel.app/api/mcp"
    }
  }
}
```

## Directories

### mcp.so

- **Status:** not listed (search for "juno" returned no match).
- **Route:** https://mcp.so/submit — **Verified.** A web form with tabs for MCP Server, Remote Server, MCP Client, and AI Agent. Use the **Remote Server** tab with the name and MCP server URL above, or the MCP Server tab with the repository URL.
- **Cost:** the form offers a paid option ($39 one-time, "Pay and submit automatically"). The site FAQ also describes a free route: open an issue in mcp.so's GitHub repository. The repository and its issue template are **Unverified**. Do not pay without a decision.
- **Paste:** name, repository URL, MCP server URL, one-line description. Put the website URL in any description or homepage field the form shows.

### PulseMCP

- **Status:** not listed.
- **Route:** https://www.pulsemcp.com/submit — **Verified** (fetched 12 October 2026). Submissions are paused. The page says it will pick up servers from the Official MCP Registry automatically once it reopens.
- **Action:** none beyond publishing `server.json` 1.2.0 to the Official MCP Registry, which adds `websiteUrl: https://junocompanion.com/health-tools`. Recheck the page later.

### Smithery

- **Status:** **Unverified.** The expected listing pages (`smithery.ai/servers/MarshallBear1/juno-open-health-tools`) return only the site shell or a sign-in redirect, and a web search found no public Smithery page. Check in a signed-in browser whether the listing exists and who owns it.
- **Route (documented):** https://smithery.ai/docs/build/publish — **Verified.** Publish from https://smithery.ai/new (redirects to Smithery sign-in) by entering the public HTTPS MCP URL, or with the Smithery CLI (`smithery mcp publish "<url>" -n @org/server`). Smithery reads metadata from a static server card at `/.well-known/mcp/server-card.json`; Juno's endpoint does not serve one today (HTTP 404).
- **What to update if the listing exists:** set the homepage or website to https://junocompanion.com/health-tools, replace the description with the long description above, upload the 512×512 logo, and confirm the server URL is the Streamable HTTP endpoint above. Smithery's docs do not describe how to edit these fields on an existing listing; use the server's settings page.
- **Note:** the site banner says Smithery is now part of Arcade.dev.

### MCP Market (mcpmarket.com)

- **Status:** listed at https://mcpmarket.com/server/juno-health-tools — **Verified.** The listing is unclaimed ("Claim this listing" is shown). It links the GitHub repository but shows no website or remote URL. Current tags: Content Management, Productivity & Workflow, API Development.
- **Action:** use **Claim this listing** on the listing page (needs an MCP Market sign-in), then add the website URL, long description, and MCP server URL. Suggested categories: Productivity & Workflow, Other.
- **New-listing route (not needed):** https://mcpmarket.com/submit — **Verified.** It accepts a GitHub repository or Remote MCP. The free queue takes about 4–6 weeks; a $29 option lists within 24 hours.

### Cursor Directory (cursor.directory)

- **Status and live site:** **Unverified.** cursor.directory returned HTTP 429 to every request on 12 October 2026.
- **Route (from the cursor/community-plugins README, not the live site):** https://cursor.directory/plugins/new. Sign in with GitHub or Google, paste a GitHub repository URL, and submit. Components are auto-detected under the Open Plugins standard; MCP servers are detected from `.mcp.json`. A Cursor agent then auto-reviews the submission.
- **Fit:** this repository's `.mcp.json` lives in `plugins/juno-health-tools/`, not at the repository root. Whether auto-detection finds it, or whether a standalone remote MCP server can be listed, is **Unverified**. If the form allows a subdirectory or a remote URL, use the MCP server URL above.

### LobeHub

- **Status:** not checked (the marketplace search needs the CLI or JavaScript).
- **Route:** **Verified** from https://lobehub.com/publish-mcp/skill.md (linked from https://lobehub.com/mcp). Repository owners publish with the LobeHub Market CLI (`npx -y @lobehub/market-cli`): `login` and `github connect` need a person in a browser, then `plugin init --url https://juno-health-tools.vercel.app/api/mcp` generates `lhm.plugin.json`, and `plugin publish https://github.com/MarshallBear1/juno-open-health-tools` creates the listing. If the server is already listed, `plugin claim <identifier>` then `plugin update`. Non-owners use the **Submit MCP** button at https://lobehub.com/mcp.
- **Paste:** set the manifest homepage or website field to https://junocompanion.com/health-tools and use the long description above. Review the generated `lhm.plugin.json` before publishing; do not commit LobeHub credentials.

### Cline MCP Marketplace

- **Status:** no submission found (issue search for "juno" returned nothing).
- **Route:** a GitHub issue using the **MCP Server Submission** template at https://github.com/cline/mcp-marketplace/issues/new?template=mcp-server-submission.yml — **Verified** from the template file. Do not open it until the steps below are done.
- **Fields:** GitHub Repository URL (required): `https://github.com/MarshallBear1/juno-open-health-tools`. Logo Image (required, 400×400 PNG): `submissions/assets/mcp-directories/juno-health-tools-icon-400.png`. Two required confirmations: that Cline can set up the server using only `README.md` and/or `llms-install.md`, and that the server is stable. Additional Information (optional): the one-line description, the website URL, and the note that it is a remote Streamable HTTP server needing no credentials.
- **Before submitting:** Cline installs from the repository's README. The README's MCP section documents the remote URL, but test it in Cline first. If Cline needs more guidance, add an `llms-install.md` at the repository root containing the client configuration above and the consent and no-PHI rules.
- **Review criteria (README):** community adoption, developer credibility, project maturity, and security.

## Already listed elsewhere

These listings come from the Official MCP Registry or GitHub. Claim them where offered and add the website URL:

- Glama: https://glama.ai/mcp/servers/MarshallBear1/juno-open-health-tools (shows a Claim button) — **Verified**.
- PluginBench, agent-ready-directory, and MCPpedia also have pages, seen in search results only. The MCPpedia page shows outdated stdio install details and "4 tools".

## Official MCP Registry

The registry currently serves version 1.1.0 with no `websiteUrl`. Version 1.2.0 in `server.json` adds `websiteUrl: https://junocompanion.com/health-tools`. Directories that ingest the registry, as PulseMCP says it will once it reopens, can pick up the website link from there.
