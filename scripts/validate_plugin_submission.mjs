import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = path.join(root, "plugins", "juno-health-tools");
const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const allowedCategories = new Set([
  "Productivity",
  "Creativity",
  "Developer Tools",
  "Business & Operations",
  "Data & Analytics",
  "Communication",
  "Education & Research",
  "Security",
  "Finance",
  "Healthcare",
  "Travel",
  "Entertainment",
  "Other",
]);

assert.match(manifest.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.name, path.basename(pluginRoot));
assert.ok(manifest.author?.name);
assert.ok(manifest.interface?.displayName);
assert.ok(manifest.interface.displayName.length <= 30, "displayName exceeds final directory limit");
assert.ok(manifest.interface.shortDescription.length <= 30, "shortDescription exceeds final directory limit");
assert.ok(manifest.interface.longDescription.length <= 4000);
assert.ok(allowedCategories.has(manifest.interface.category), "unsupported directory category");

for (const key of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL", "supportURL"]) {
  const value = manifest.interface[key];
  assert.ok(value, `${key} is required for an MCP-backed plugin`);
  const parsed = new URL(value);
  assert.equal(parsed.protocol, "https:", `${key} must use HTTPS`);
  assert.ok(value.length <= 1024, `${key} exceeds final directory limit`);
}

const prompts = Array.isArray(manifest.interface.defaultPrompt)
  ? manifest.interface.defaultPrompt
  : [manifest.interface.defaultPrompt];
assert.ok(prompts.length >= 1 && prompts.length <= 3);
prompts.forEach((prompt) => {
  assert.ok(prompt.length <= 128, "starter prompt exceeds final directory limit");
  assert.ok(!prompt.includes("\n"), "starter prompt must fit on one line");
});

for (const key of ["composerIcon", "logo"]) {
  const relative = manifest.interface[key];
  assert.ok(relative?.startsWith("./"), `${key} must be a relative plugin path`);
  await access(path.join(pluginRoot, relative));
}

await access(path.join(pluginRoot, manifest.skills));
await access(path.join(pluginRoot, manifest.mcpServers));

console.log(JSON.stringify({
  plugin: manifest.name,
  version: manifest.version,
  category: manifest.interface.category,
  listingURLs: ["websiteURL", "privacyPolicyURL", "termsOfServiceURL", "supportURL"],
  starterPrompts: prompts.length,
  status: "valid",
}, null, 2));
