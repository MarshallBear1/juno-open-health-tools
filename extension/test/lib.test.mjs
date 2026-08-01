import assert from "node:assert/strict";
import test from "node:test";

import { buildPlan, formatAppointmentDate, normalizeState, noteCountLabel } from "../lib.js";

test("normalizeState keeps supported, bounded notes", () => {
  const result = normalizeState({
    appointmentDate: "2026-08-19-extra",
    clinician: `  ${"x".repeat(90)}  `,
    goal: "  Prepare questions  ",
    notes: [
      { id: 1, category: "change", text: "  Headaches became more frequent  ", createdAt: 12 },
      { id: 2, category: "unknown", text: "drop me" },
      null,
    ],
  });

  assert.equal(result.appointmentDate, "2026-08-19");
  assert.equal(result.clinician.length, 80);
  assert.equal(result.goal, "Prepare questions");
  assert.deepEqual(result.notes, [
    { id: "1", category: "change", text: "Headaches became more frequent", createdAt: 12 },
  ]);
});

test("buildPlan groups notes and includes the safety footer", () => {
  const plan = buildPlan({
    appointmentDate: "2026-08-19",
    clinician: "Neurology",
    goal: "Agree the next step",
    notes: [
      { id: "a", category: "question", text: "What should I track?", createdAt: 1 },
      { id: "b", category: "impact", text: "Needed breaks after short walks", createdAt: 2 },
    ],
  });

  assert.match(plan, /19 August 2026/);
  assert.match(plan, /QUESTION\n1\. What should I track\?/);
  assert.match(plan, /IMPACT\n1\. Needed breaks after short walks/);
  assert.match(plan, /not medical advice/);
});

test("date and count labels handle empty and singular states", () => {
  assert.equal(formatAppointmentDate(""), "Not set");
  assert.equal(noteCountLabel(0), "0 notes");
  assert.equal(noteCountLabel(1), "1 note");
  assert.equal(noteCountLabel(2), "2 notes");
});
