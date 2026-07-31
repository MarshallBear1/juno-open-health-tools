import test from "node:test";
import assert from "node:assert/strict";
import { buildHealthTimeline, findSymptomWords, prepareAppointmentBrief, reflectOnFlare } from "../lib/health-tools.js";

test("symptom word helper preserves the user's wording", () => {
  const result = findSymptomWords({ description: "strange leg feeling", bodyArea: "left calf" });
  assert.equal(result.originalDescription, "strange leg feeling");
  assert.match(result.starterSentence, /left calf/);
  assert.ok(result.prompts.sensation.includes("burning"));
});

test("timeline sorts parseable dates without inventing missing dates", () => {
  const result = buildHealthTimeline({ observations: [
    { date: "2026-02-02", observation: "Second" },
    { date: "2026-01-01", observation: "First" },
    { observation: "Date not known" }
  ] });
  assert.equal(result.timeline[0].observation, "First");
  assert.equal(result.timeline[2].date, "Date uncertain");
});

test("appointment brief caps changes and adds neutral questions", () => {
  const result = prepareAppointmentBrief({ mainGoal: "Understand next steps", changes: ["a", "b", "c", "d"], impacts: [], medicines: [], questions: [], detailsToBring: [] });
  assert.equal(result.changes.length, 3);
  assert.equal(result.questions.length, 2);
  assert.match(result.disclaimer, /not medical advice/i);
});

test("flare patterns remain questions rather than causes", () => {
  const result = reflectOnFlare({ baselineBefore: [], during: [], recoveryAfter: [], possiblePatterns: ["a long meeting"] });
  assert.match(result.possiblePatternsToObserve[0], /Could .* worth tracking/);
  assert.match(result.possiblePatternsToObserve[0], /rather than assuming/);
});
