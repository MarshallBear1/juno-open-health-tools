import assert from "node:assert/strict";

const endpoint = process.argv[2];
if (!endpoint) throw new Error("Usage: node scripts/check_mcp_endpoint.mjs <https://host/mcp>");

async function rpc(id, method, params = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "mcp-protocol-version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  assert.equal(response.status, 200, `${method} returned HTTP ${response.status}`);
  const text = await response.text();
  const dataLine = text.split("\n").find((line) => line.startsWith("data: "));
  return dataLine ? JSON.parse(dataLine.slice(6)) : JSON.parse(text);
}

const initialized = await rpc(1, "initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "juno-submission-audit", version: "1.0.0" },
});
assert.equal(initialized.result.serverInfo.name, "Juno Health Tools");
assert.match(initialized.result.instructions, /explicit agreement/i);
assert.match(initialized.result.instructions, /protected health information \(PHI\)/i);

const listed = await rpc(2, "tools/list");
const tools = listed.result.tools;
assert.equal(tools.length, 5);
for (const tool of tools) {
  assert.ok(typeof tool.title === "string" && tool.title.trim(), `${tool.name} is missing title`);
  assert.ok(tool.name.length <= 64, `${tool.name} exceeds the 64-character tool-name limit`);
  assert.ok(
    typeof tool.description === "string" && tool.description.trim(),
    `${tool.name} is missing description`,
  );
  assert.deepEqual(tool.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  });
  assert.ok(tool.outputSchema, `${tool.name} is missing outputSchema`);
  assert.ok(tool.inputSchema.required.includes("consentConfirmed"), `${tool.name} does not require consentConfirmed`);
  assert.equal(tool.inputSchema.properties.consentConfirmed.const, true);
}

const denied = await rpc(3, "tools/call", {
  name: "find_symptom_words",
  arguments: { description: "synthetic warm prickling feeling" },
});
assert.equal(denied.result.isError, true, "tool call without consent was not rejected");

const allowed = await rpc(4, "tools/call", {
  name: "find_symptom_words",
  arguments: {
    consentConfirmed: true,
    description: "synthetic warm prickling feeling",
    timing: "after a walk",
  },
});
assert.notEqual(allowed.result.isError, true);
assert.ok(allowed.result.structuredContent.prompts.sensation.length);

console.log(JSON.stringify({
  endpoint,
  serverVersion: initialized.result.serverInfo.version,
  tools: tools.map((tool) => tool.name),
  consentGate: "verified",
  titlesAndDescriptions: "verified",
  outputSchemas: "verified",
  annotations: "verified",
}, null, 2));
