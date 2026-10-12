import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { widgetHtml } from "../lib/widget.js";
import { prepareAppointmentBrief } from "../lib/health-tools.js";
import { toolResult } from "../lib/tool-result.js";

function loadWidget() {
  const elements = Object.fromEntries(["grid", "goal", "note", "copy"].map(id => [id, { textContent: "", innerHTML: "" }]));
  const listeners = {}, messages = [], copied = [];
  const parent = { postMessage: message => messages.push(message) };
  const window = { parent, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const document = { getElementById: id => elements[id], body: { getBoundingClientRect: () => ({ height: 400 }) } };
  const source = widgetHtml.match(/<script>([\s\S]*)<\/script>/i)[1];
  vm.runInNewContext(source, { window, document, navigator: { clipboard: { writeText: async text => copied.push(text) } } });
  const receive = (data, source = parent) => listeners.message({ source, data });
  return { elements, messages, copied, receive };
}

const brief = prepareAppointmentBrief({
  mainGoal: "Explain the last month clearly",
  changes: ["Fatigue is less predictable", "<script>not markup</script>"],
  impacts: ["More breaks"], medicines: [],
  questions: ["What should I track?"], detailsToBring: ["A dated timeline"]
});

test("text-only MCP clients receive the complete brief, including added questions", () => {
  const response = toolResult(brief, "Brief prepared.");
  const decoded = JSON.parse(response.content[1].text);
  assert.deepEqual(decoded, response.structuredContent);
  assert.equal(decoded.questions.length, 3);
});

test("embedded script loads, completes the host handshake and renders the actual result", async () => {
  const widget = loadWidget();
  const init = widget.messages[0];
  assert.equal(init.method, "ui/initialize");
  assert.equal(init.params.protocolVersion, "2026-01-26");
  widget.receive({ jsonrpc: "2.0", id: init.id, result: {} });
  assert.equal(widget.messages[1].method, "ui/notifications/initialized");
  assert.equal(widget.messages[2].method, "ui/notifications/size-changed");
  widget.receive({ jsonrpc: "2.0", method: "ui/notifications/tool-result", params: toolResult(brief, "Brief prepared.") });
  assert.equal(widget.elements.goal.textContent, brief.mainGoal);
  assert.equal(widget.elements.note.textContent, brief.disclaimer);
  assert.ok(widget.elements.grid.innerHTML.includes(brief.questions[2]));
  assert.ok(widget.elements.grid.innerHTML.includes("&lt;script&gt;not markup&lt;/script&gt;"));
  assert.ok(!widget.elements.grid.innerHTML.includes("<script>"));
  await widget.elements.copy.onclick();
  assert.ok(widget.copied[0].includes("MAIN GOAL\nExplain the last month clearly"));
  assert.ok(widget.copied[0].includes(brief.questions[2]));
});

test("widget ignores non-parent messages and supports a text-only result fallback", () => {
  const widget = loadWidget();
  const result = { jsonrpc: "2.0", method: "ui/notifications/tool-result", params: { content: [{ type: "text", text: JSON.stringify(brief) }] } };
  widget.receive(result, {});
  assert.equal(widget.elements.goal.textContent, "Appointment brief");
  widget.receive(result);
  assert.equal(widget.elements.goal.textContent, brief.mainGoal);
});
