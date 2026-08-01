// Builds the layered appointment-preparation PowerPoint that Canva can import.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const OUT_DIR = path.join(REPO_ROOT, "templates", "canva");
const RENDER_DIR = path.join(REPO_ROOT, "output", "canva-template-rendered");
const FINAL_PPTX = `${OUT_DIR}/Juno Appointment Prep - Editable Canva Import.pptx`;

const C = {
  canvas: "#FFFFFF",
  ink: "#111111",
  muted: "#5F6670",
  panel: "#EDEDED",
  rule: "#B8BCC4",
  accent: "#6DCBF4",
  accentStrong: "#3D8DFF",
  accentSoft: "#D0EDFA",
};

const FONT = "Arial";

function addText(slide, name, value, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT,
    fontSize: style.fontSize ?? 20,
    color: style.color ?? C.ink,
    bold: style.bold ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
  };
  return shape;
}

function addRect(slide, name, position, fill = "none", lineFill = C.rule, lineWidth = 1) {
  return slide.shapes.add({
    geometry: "rect",
    name,
    position,
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
  });
}

function addLine(slide, name, left, top, width, color = C.rule, weight = 1) {
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left, top, width, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: weight },
  });
}

function addCircle(slide, name, left, top, size, fill = C.canvas, lineFill = C.ink, lineWidth = 1.5) {
  return slide.shapes.add({
    geometry: "ellipse",
    name,
    position: { left, top, width: size, height: size },
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
  });
}

function addChrome(slide, page, label = "JUNO OPEN HEALTH TOOLS") {
  addText(slide, `eyebrow-${page}`, label, { left: 42, top: 24, width: 360, height: 24 }, {
    fontSize: 14,
    bold: true,
    color: C.muted,
  });
  addText(slide, `page-${page}`, String(page).padStart(2, "0"), { left: 1186, top: 670, width: 52, height: 22 }, {
    fontSize: 13,
    alignment: "right",
    color: C.muted,
  });
}

function addTitle(slide, page, title, subtitle = "", titleSize = 44) {
  addText(slide, `title-${page}`, title, { left: 42, top: 62, width: 1138, height: 66 }, {
    fontSize: titleSize,
    bold: true,
  });
  if (subtitle) {
    addText(slide, `subtitle-${page}`, subtitle, { left: 42, top: 127, width: 1138, height: 44 }, {
      fontSize: 20,
      color: C.muted,
    });
  }
  addChrome(slide, page);
}

function addBlankLines(slide, prefix, left, top, width, count, gap = 42) {
  for (let index = 0; index < count; index += 1) {
    addLine(slide, `${prefix}-${index + 1}`, left, top + index * gap, width, C.rule, 1);
  }
}

function addSources(slide) {
  slide.speakerNotes.textFrame.setText(
    "[Sources]\n- https://github.com/MarshallBear1/juno-open-health-tools (accessed 2026-08-01)\n- https://doi.org/10.5281/zenodo.21729519 (accessed 2026-08-01)"
  );
}

function buildDeck() {
  const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });

  // 1 — sparse stacked-text cover, based on Codex Grid slide 01.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addText(slide, "cover-eyebrow", "JUNO OPEN HEALTH TOOLS", { left: 42, top: 38, width: 380, height: 30 }, {
      fontSize: 16,
      bold: true,
      color: C.muted,
    });
    addText(slide, "cover-title", "Appointment\nprep", { left: 42, top: 176, width: 840, height: 224 }, {
      fontSize: 78,
      bold: true,
      verticalAlignment: "bottom",
    });
    addText(slide, "cover-subtitle", "A clearer way to carry your health story into the room.", { left: 42, top: 486, width: 760, height: 84 }, {
      fontSize: 30,
    });
    addRect(slide, "cover-accent", { left: 1040, top: 38, width: 198, height: 592 }, C.accentSoft, C.accentSoft, 0);
    addText(slide, "cover-note", "Editable in Canva\nPrivate by default\nNon-diagnostic", { left: 1058, top: 474, width: 164, height: 128 }, {
      fontSize: 18,
      bold: true,
    });
    addText(slide, "page-01", "01", { left: 1186, top: 670, width: 52, height: 22 }, {
      fontSize: 13,
      alignment: "right",
      color: C.muted,
    });
    addSources(slide);
  }

  // 2 — two-column content, based on Codex Grid slide 04.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 2, "Start with one goal", "A short appointment works better when you decide what matters most before it begins.");
    addLine(slide, "goal-divider", 640, 192, 0, C.rule, 1);
    addText(slide, "goal-left-heading", "Appointment at a glance", { left: 42, top: 206, width: 500, height: 36 }, {
      fontSize: 26,
      bold: true,
    });
    const leftFields = ["Date and time", "Clinician or service", "One thing I most want from this visit"];
    leftFields.forEach((label, index) => {
      const top = 278 + index * 110;
      addText(slide, `goal-field-label-${index + 1}`, label, { left: 42, top, width: 500, height: 28 }, {
        fontSize: 18,
        bold: true,
        color: C.muted,
      });
      addLine(slide, `goal-field-line-${index + 1}`, 42, top + 55, 520, C.ink, 1);
    });
    addText(slide, "goal-right-heading", "Three useful prompts", { left: 700, top: 206, width: 500, height: 36 }, {
      fontSize: 26,
      bold: true,
    });
    const prompts = [
      "What has changed since my last visit?",
      "What decision or next step do I need?",
      "What am I worried I will forget to say?",
    ];
    prompts.forEach((prompt, index) => {
      const top = 278 + index * 110;
      addCircle(slide, `goal-prompt-number-${index + 1}`, 700, top, 36, C.accentSoft, C.accentStrong, 1.5);
      addText(slide, `goal-prompt-number-text-${index + 1}`, String(index + 1), { left: 700, top: top + 5, width: 36, height: 28 }, {
        fontSize: 18,
        bold: true,
        alignment: "center",
      });
      addText(slide, `goal-prompt-${index + 1}`, prompt, { left: 756, top, width: 430, height: 60 }, {
        fontSize: 22,
      });
    });
    addSources(slide);
  }

  // 3 — three-column change scan, based on Codex Grid slide 07.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 3, "What changed since the last visit?", "Capture observations first. Leave causes and diagnoses for the clinical conversation.");
    const columns = [
      { label: "New", hint: "A symptom, limitation, trigger, or concern that was not present before." },
      { label: "Worse or more frequent", hint: "Something that became stronger, lasted longer, or happened more often." },
      { label: "Better or resolved", hint: "Something that eased, stopped, or became more manageable." },
    ];
    columns.forEach((column, index) => {
      const left = 42 + index * 411;
      addRect(slide, `change-accent-${index + 1}`, { left, top: 205, width: 365, height: 10 }, index === 1 ? C.accentStrong : C.accent, index === 1 ? C.accentStrong : C.accent, 0);
      addText(slide, `change-label-${index + 1}`, column.label, { left, top: 238, width: 365, height: 38 }, {
        fontSize: 27,
        bold: true,
      });
      addText(slide, `change-hint-${index + 1}`, column.hint, { left, top: 291, width: 365, height: 88 }, {
        fontSize: 18,
        color: C.muted,
      });
      addBlankLines(slide, `change-lines-${index + 1}`, left, 433, 365, 4, 48);
    });
    addSources(slide);
  }

  // 4 — editable observation table, based on Codex Grid slide 14.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 4, "Describe symptoms in observable language", "Use your own words. Specific examples are often more useful than searching for the perfect label.", 36);
    const left = 42;
    const top = 208;
    const widths = [304, 184, 176, 170, 364];
    const headers = ["What I noticed", "When", "How often", "Intensity", "What it stopped or changed"];
    let x = left;
    headers.forEach((header, index) => {
      addRect(slide, `observation-header-${index + 1}`, { left: x, top, width: widths[index], height: 54 }, C.panel, C.rule, 1);
      addText(slide, `observation-header-text-${index + 1}`, header, { left: x + 10, top: top + 10, width: widths[index] - 20, height: 34 }, {
        fontSize: 16,
        bold: true,
      });
      x += widths[index];
    });
    for (let row = 0; row < 6; row += 1) {
      x = left;
      widths.forEach((width, col) => {
        addRect(slide, `observation-cell-${row + 1}-${col + 1}`, { left: x, top: top + 54 + row * 58, width, height: 58 }, C.canvas, C.rule, 1);
        x += width;
      });
    }
    addText(slide, "observation-tip", "Examples: ‘burning behind my eyes after reading’ · ‘legs feel heavy after five minutes standing’", { left: 42, top: 634, width: 1050, height: 28 }, {
      fontSize: 15,
      color: C.muted,
    });
    addSources(slide);
  }

  // 5 — simple timeline, based on Codex Grid slide 17.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 5, "Build a simple timeline", "Use approximate dates when needed. Do not invent precision you do not have.");
    addLine(slide, "timeline-axis", 76, 338, 1128, C.ink, 1.5);
    const events = [
      { x: 76, label: "First noticed", prompt: "Date or period\nWhat changed" },
      { x: 432, label: "Important change", prompt: "Date or period\nWhat became different" },
      { x: 788, label: "Test or treatment", prompt: "What happened\nWhat you observed" },
      { x: 1188, label: "Now", prompt: "Current pattern\nCurrent impact" },
    ];
    events.forEach((event, index) => {
      addCircle(slide, `timeline-dot-${index + 1}`, event.x - 9, 329, 18, index === 3 ? C.accentStrong : C.canvas, C.ink, 1.5);
      const labelLeft = Math.min(event.x, 1040);
      addText(slide, `timeline-label-${index + 1}`, event.label, { left: labelLeft, top: 276, width: 180, height: 30 }, {
        fontSize: 17,
        bold: true,
      });
      addText(slide, `timeline-prompt-${index + 1}`, event.prompt, { left: labelLeft, top: 384, width: 220, height: 66 }, {
        fontSize: 20,
      });
      addBlankLines(slide, `timeline-lines-${index + 1}`, labelLeft, 492, Math.min(220, 1238 - labelLeft), 3, 42);
    });
    addSources(slide);
  }

  // 6 — one-column checklist, based on Codex Grid slide 10.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 6, "Choose the questions that matter most", "Bring fewer, clearer questions. Put the most important one first.", 44);
    addText(slide, "questions-left-heading", "My top question", { left: 42, top: 208, width: 500, height: 36 }, {
      fontSize: 27,
      bold: true,
    });
    addRect(slide, "questions-top-area", { left: 42, top: 270, width: 548, height: 220 }, C.canvas, C.ink, 1.5);
    addText(slide, "questions-backup-heading", "If there is time", { left: 42, top: 524, width: 500, height: 32 }, {
      fontSize: 22,
      bold: true,
    });
    addBlankLines(slide, "questions-backup-lines", 42, 582, 548, 2, 44);
    addText(slide, "questions-check-heading", "Useful areas to check", { left: 700, top: 208, width: 500, height: 36 }, {
      fontSize: 27,
      bold: true,
    });
    const checks = [
      "Medication purpose, benefit, or side effects",
      "What a test can and cannot tell us",
      "The next step and who is responsible",
      "Which changes should trigger urgent help",
      "What to do if the plan does not work",
    ];
    checks.forEach((item, index) => {
      const top = 282 + index * 72;
      addCircle(slide, `question-check-${index + 1}`, 700, top, 28, C.canvas, C.ink, 1.5);
      addText(slide, `question-check-text-${index + 1}`, item, { left: 750, top: top - 2, width: 454, height: 48 }, {
        fontSize: 20,
      });
      addLine(slide, `question-check-rule-${index + 1}`, 750, top + 48, 454, C.rule, 1);
    });
    addSources(slide);
  }

  // 7 — four-point grid, based on Codex Grid slide 13.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addTitle(slide, 7, "Leave with a plan you can understand", "Write down decisions before the details fade. Ask the clinician to clarify anything that is uncertain.");
    const sections = [
      { left: 42, top: 214, title: "Decisions made" },
      { left: 656, top: 214, title: "Actions and who owns them" },
      { left: 42, top: 426, title: "Tests, referrals, or results" },
      { left: 656, top: 426, title: "Follow-up and when to seek help" },
    ];
    sections.forEach((section, index) => {
      addText(slide, `plan-heading-${index + 1}`, section.title, { left: section.left, top: section.top, width: 560, height: 34 }, {
        fontSize: 24,
        bold: true,
      });
      addRect(slide, `plan-area-${index + 1}`, { left: section.left, top: section.top + 48, width: 560, height: 138 }, C.canvas, C.rule, 1);
    });
    addSources(slide);
  }

  // 8 — sparse closing, based on Codex Grid slide 26.
  {
    const slide = deck.slides.add();
    slide.background.fill = C.canvas;
    addText(slide, "close-eyebrow", "JUNO OPEN HEALTH TOOLS", { left: 42, top: 38, width: 380, height: 30 }, {
      fontSize: 16,
      bold: true,
      color: C.muted,
    });
    addText(slide, "close-title", "Organise.\nDo not diagnose.", { left: 42, top: 168, width: 900, height: 238 }, {
      fontSize: 72,
      bold: true,
      verticalAlignment: "bottom",
    });
    addText(slide, "close-subtitle", "Bring only what matters for the conversation in front of you.", { left: 42, top: 466, width: 760, height: 70 }, {
      fontSize: 28,
    });
    addRect(slide, "close-safety-panel", { left: 876, top: 38, width: 362, height: 592 }, C.panel, C.panel, 0);
    addText(slide, "close-safety-title", "Safety", { left: 910, top: 82, width: 294, height: 36 }, {
      fontSize: 26,
      bold: true,
    });
    addText(slide, "close-safety-body", "This template helps organise information. It does not diagnose, recommend treatment, replace a clinician, or provide emergency care.\n\nIf symptoms may be urgent or life-threatening, contact local emergency services or an appropriate clinician.", { left: 910, top: 144, width: 294, height: 260 }, {
      fontSize: 19,
    });
    addText(slide, "close-links", "Open tools: github.com/MarshallBear1\nRepository: juno-open-health-tools\nDOI: 10.5281/zenodo.21729519\nMIT licensed · synthetic examples only", { left: 910, top: 484, width: 294, height: 116 }, {
      fontSize: 13,
      color: C.muted,
    });
    addText(slide, "page-08", "08", { left: 1186, top: 670, width: 52, height: 22 }, {
      fontSize: 13,
      alignment: "right",
      color: C.muted,
    });
    addSources(slide);
  }

  return deck;
}

async function writeBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(RENDER_DIR, { recursive: true });
  const deck = buildDeck();

  for (const [index, slide] of deck.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(`${RENDER_DIR}/${stem}.png`, await deck.export({ slide, format: "png", scale: 1 }));
    await fs.writeFile(`${RENDER_DIR}/${stem}.layout.json`, await (await slide.export({ format: "layout" })).text());
  }

  await writeBlob(`${RENDER_DIR}/montage.webp`, await deck.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(FINAL_PPTX);
  console.log(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
