import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/mcp/route.js";
import { WIDGET_URI } from "../lib/widget.js";

async function readCard(userAgent) {
  const response = await POST(new Request("https://juno-health-tools.vercel.app/api/mcp", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "user-agent": userAgent },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "resources/read", params: { uri: WIDGET_URI } })
  }));
  assert.equal(response.status, 200);
  const text = await response.text();
  const payload = text.split("\n").find(line => line.startsWith("data: "));
  const result = payload ? JSON.parse(payload.slice(6)) : JSON.parse(text);
  assert.ok(!result.error, JSON.stringify(result.error));
  return result.result.contents[0];
}

test("Claude receives its endpoint-derived sandbox domain through the real HTTP handler", async () => {
  const card = await readCard("Claude-User");
  assert.equal(card._meta.ui.domain, "bb52b1875c37568aefc8be2b9b8a05bb.claudemcpcontent.com");
  assert.equal(card._meta["openai/widgetDomain"], undefined);
  assert.deepEqual(card._meta.ui.csp, { connectDomains: [], resourceDomains: [] });
  assert.equal(card.mimeType, "text/html;profile=mcp-app");
});

test("other clients retain the ChatGPT domain without a Claude domain override", async () => {
  const card = await readCard("ChatGPT-User");
  assert.equal(card._meta["openai/widgetDomain"], "https://juno-health-tools.vercel.app");
  assert.equal(card._meta.ui.domain, undefined);
  assert.equal(card.uri, WIDGET_URI);
});
