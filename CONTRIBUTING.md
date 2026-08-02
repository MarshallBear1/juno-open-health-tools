# Contributing to Juno Open Health Tools

Thank you for helping improve these open, privacy-conscious appointment-preparation tools.

## Before you start

- Use synthetic examples only. Never submit personal health information, patient records, credentials, or production secrets.
- Keep the tools non-diagnostic. Do not add treatment recommendations, causal claims, or clinical-effectiveness claims without an appropriate evidence and review process.
- Preserve explicit consent and data-minimisation boundaries in the MCP tools.
- For a suspected vulnerability, follow [`SECURITY.md`](SECURITY.md) instead of opening a public issue.
- Follow the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Development setup

Use Node.js 22 or a compatible newer LTS release and the npm version bundled with it.

Install the MCP app dependencies from the repository root:

```bash
npm ci --prefix app
```

Run the repository checks:

```bash
node --test extension/test/*.test.mjs
npm test --prefix app
npm run build --prefix app
```

The extension has no third-party runtime dependencies. See [`extension/README.md`](extension/README.md) for local loading and packaging instructions. See [`app/README.md`](app/README.md) for MCP development and data-handling constraints.

## Proposing a change

1. Search existing issues and pull requests before starting overlapping work.
2. Keep each pull request focused and explain the user impact.
3. Add or update tests for executable behavior.
4. Use synthetic data in fixtures, screenshots, examples, and reviewer instructions.
5. Document privacy, consent, compatibility, and safety implications where relevant.
6. Ensure the checks above pass before requesting review.

Maintainers may ask for narrower scope, additional tests, or factual sourcing before merging. A contribution may be declined when it creates medical, privacy, security, maintenance, or brand risk even if the code works as written.
