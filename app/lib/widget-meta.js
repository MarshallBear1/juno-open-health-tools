import { createHash } from "node:crypto";

const publicEndpoint = "https://juno-health-tools.vercel.app/api/mcp";
const claudeDomain = `${createHash("sha256").update(publicEndpoint).digest("hex").slice(0, 32)}.claudemcpcontent.com`;

export function widgetMeta(request) {
  const isClaude = /claude|anthropic/i.test(request?.headers.get("user-agent") || "");
  const ui = { prefersBorder: true, csp: { connectDomains: [], resourceDomains: [] } };
  // Hosts validate different sandbox formats. Claude also reads the legacy
  // OpenAI field, so never send that URL-shaped value to Claude.
  return isClaude
    ? { ui: { ...ui, domain: claudeDomain } }
    : { ui, "openai/widgetDomain": new URL(publicEndpoint).origin };
}
