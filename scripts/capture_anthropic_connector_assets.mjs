import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const endpoint = process.argv[2] ?? "https://juno-health-tools.vercel.app/api/mcp";
const assetDirectory = path.join(
  root,
  "submissions",
  "assets",
  "anthropic-connectors-directory",
);
const protocolVersion = "2025-06-18";

const captures = [
  {
    asset: "01-find-symptom-words.png",
    title: "Find symptom words",
    name: "find_symptom_words",
    arguments: {
      consentConfirmed: true,
      description: "a heavy feeling behind my eyes",
      timing: "after screen time",
      impact: "harder to concentrate",
    },
  },
  {
    asset: "02-build-health-timeline.png",
    title: "Build health timeline",
    name: "build_health_timeline",
    arguments: {
      consentConfirmed: true,
      observations: [
        {
          date: "12 Jul",
          observation: "Energy dropped after errands",
          impact: "Needed an earlier rest",
        },
        { date: "14 Jul", observation: "Rested most of the day" },
        { date: "18 Jul", observation: "Energy was closer to baseline" },
      ],
    },
  },
  {
    asset: "03-prepare-appointment-brief.png",
    title: "Prepare appointment brief",
    name: "prepare_appointment_brief",
    arguments: {
      consentConfirmed: true,
      mainGoal: "Explain the last month clearly",
      changes: [
        "Fatigue has become less predictable",
        "Screen time is followed by a heavy feeling behind my eyes",
      ],
      impacts: ["More breaks during routine tasks"],
      medicines: [],
      questions: ["What should I track before the next appointment?"],
      detailsToBring: ["A short dated timeline"],
    },
  },
  {
    asset: "04-reflect-on-flare.png",
    title: "Reflect on a flare",
    name: "reflect_on_flare",
    arguments: {
      consentConfirmed: true,
      baselineBefore: ["Busy weekend"],
      during: ["More fatigue", "Light sensitivity"],
      recoveryAfter: ["Gradual improvement over three quiet days"],
      possiblePatterns: ["a busy weekend"],
    },
  },
];

async function rpc(id, method, params = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "mcp-protocol-version": protocolVersion,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  assert.equal(response.status, 200, `${method} returned HTTP ${response.status}`);
  const text = await response.text();
  const dataLine = text.split("\n").find((line) => line.startsWith("data: "));
  return dataLine ? JSON.parse(dataLine.slice(6)) : JSON.parse(text);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function label(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function renderArray(values) {
  if (!values.length) return '<p class="empty">None supplied</p>';
  if (values.every((value) => typeof value === "object" && value !== null)) {
    return `<div class="timeline">${values
      .map(
        (value) => `<article class="timeline-row">
          <strong>${escapeHtml(value.date || "Date not supplied")}</strong>
          <div><b>${escapeHtml(value.observation || "")}</b>
          ${value.impact ? `<span>${escapeHtml(value.impact)}</span>` : ""}
          ${value.uncertainty ? `<span>${escapeHtml(value.uncertainty)}</span>` : ""}</div>
        </article>`,
      )
      .join("")}</div>`;
  }
  return `<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`;
}

function renderSections(structuredContent) {
  return Object.entries(structuredContent)
    .filter(([key]) => key !== "disclaimer" && key !== "originalDescription")
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `<section class="card ${key === "timeline" ? "wide" : ""}">
          <h2>${escapeHtml(label(key))}</h2>${renderArray(value)}
        </section>`;
      }
      if (value && typeof value === "object") {
        return Object.entries(value)
          .map(
            ([nestedKey, nestedValue]) => `<section class="card">
              <h2>${escapeHtml(label(nestedKey))}</h2>${renderArray(nestedValue)}
            </section>`,
          )
          .join("");
      }
      return `<section class="card wide"><h2>${escapeHtml(label(key))}</h2><p>${escapeHtml(value)}</p></section>`;
    })
    .join("");
}

function page(capture) {
  const structuredContent = capture.result.structuredContent;
  const original = structuredContent.originalDescription
    ? `<p class="original"><b>Supplied description</b> ${escapeHtml(structuredContent.originalDescription)}</p>`
    : "";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 1000px; overflow: hidden; }
body { background: #eef8f5; color: #16302d; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 28px; }
.shell { height: 944px; background: #fff; border: 2px solid #b9dcd5; border-radius: 28px; overflow: hidden; box-shadow: 0 14px 40px rgba(15,118,110,.10); display: flex; flex-direction: column; }
header { background: #0f766e; color: #fff; padding: 25px 34px 22px; display: flex; align-items: flex-start; justify-content: space-between; }
.brand { color: #bff7ed; font-size: 17px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
h1 { margin: 7px 0 0; font-size: 38px; line-height: 1.05; letter-spacing: -.025em; }
.badge { background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.45); border-radius: 999px; padding: 10px 14px; font-size: 15px; font-weight: 700; }
main { padding: 24px 34px 18px; flex: 1; display: flex; flex-direction: column; min-height: 0; }
.tool { color: #0f766e; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 17px; font-weight: 750; margin-bottom: 13px; }
.original { background: #d7f5ef; border-radius: 12px; margin: 0 0 15px; padding: 11px 14px; font-size: 17px; }
.original b { color: #0f766e; margin-right: 8px; }
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; align-content: start; flex: 1; min-height: 0; }
.card { border: 1px solid #c8e1dc; border-radius: 17px; padding: 15px 17px; background: #fbfefd; min-width: 0; }
.card.wide { grid-column: 1 / -1; }
h2 { color: #0f766e; font-size: 15px; letter-spacing: .075em; margin: 0 0 9px; text-transform: uppercase; }
p, ul { font-size: 17px; line-height: 1.34; margin: 0; }
ul { padding-left: 20px; }
li { margin: 3px 0; }
.empty { color: #65807b; font-style: italic; }
.timeline { display: grid; gap: 8px; }
.timeline-row { display: grid; grid-template-columns: 105px 1fr; gap: 15px; background: #eff8f6; border-radius: 11px; padding: 10px 12px; font-size: 17px; }
.timeline-row strong { color: #0f766e; }
.timeline-row span { color: #516a66; display: block; margin-top: 3px; }
footer { border-top: 1px solid #d8e9e5; color: #4d6662; font-size: 15px; line-height: 1.35; padding: 12px 34px 14px; }
footer b { color: #0f766e; }
</style></head><body><div class="shell">
<header><div><div class="brand">Juno Health Tools</div><h1>${escapeHtml(capture.title)}</h1></div><div class="badge">Live MCP response</div></header>
<main><div class="tool">${escapeHtml(capture.name)}</div>${original}<div class="grid">${renderSections(structuredContent)}</div></main>
<footer><b>Captured from the public endpoint.</b> ${escapeHtml(structuredContent.disclaimer || "Structured output returned without modification.")}</footer>
</div></body></html>`;
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  assert.ok(found, "Chrome or Chromium was not found; set CHROME_PATH");
  return found;
}

function pngDimensions(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

let rpcId = 1;
const initialized = await rpc(rpcId++, "initialize", {
  protocolVersion,
  capabilities: {},
  clientInfo: { name: "juno-anthropic-asset-capture", version: "1.0.0" },
});
assert.equal(initialized.result.serverInfo.name, "Juno Health Tools");

for (const capture of captures) {
  const response = await rpc(rpcId++, "tools/call", {
    name: capture.name,
    arguments: capture.arguments,
  });
  assert.notEqual(response.result.isError, true, `${capture.name} returned a tool error`);
  capture.result = response.result;
}

const preparedBrief = captures.find((capture) => capture.name === "prepare_appointment_brief");
const rendered = await rpc(rpcId++, "tools/call", {
  name: "render_appointment_brief",
  arguments: { consentConfirmed: true, ...preparedBrief.result.structuredContent },
});
assert.notEqual(rendered.result.isError, true, "render_appointment_brief returned a tool error");
captures.push({
  asset: "05-render-appointment-brief.png",
  title: "Render appointment brief",
  name: "render_appointment_brief",
  arguments: { consentConfirmed: true, ...preparedBrief.result.structuredContent },
  result: rendered.result,
});

fs.mkdirSync(assetDirectory, { recursive: true });
const browser = findBrowser();
const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "juno-anthropic-capture-"));
try {
  for (const capture of captures) {
    const htmlFile = path.join(temporaryDirectory, capture.asset.replace(/\.png$/u, ".html"));
    const imageFile = path.join(assetDirectory, capture.asset);
    fs.writeFileSync(htmlFile, page(capture));
    const run = spawnSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,1000",
        `--screenshot=${imageFile}`,
        pathToFileURL(htmlFile).href,
      ],
      { encoding: "utf8" },
    );
    assert.equal(run.status, 0, run.stderr || `Chrome failed to capture ${capture.asset}`);
    assert.deepEqual(pngDimensions(imageFile), { width: 1200, height: 1000 });
  }
} finally {
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
}

const evidence = {
  endpoint,
  protocolVersion,
  serverInfo: initialized.result.serverInfo,
  captures: captures.map(({ asset, title, name, arguments: input, result }) => ({
    asset,
    title,
    tool: name,
    input,
    response: result,
  })),
};
fs.writeFileSync(
  path.join(assetDirectory, "responses.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
);

for (const capture of captures) {
  const imageFile = path.join(assetDirectory, capture.asset);
  const digest = crypto.createHash("sha256").update(fs.readFileSync(imageFile)).digest("hex");
  console.log(`${capture.asset}  ${digest}`);
}
