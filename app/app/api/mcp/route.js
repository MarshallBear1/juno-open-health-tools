import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { buildHealthTimeline, findSymptomWords, prepareAppointmentBrief, reflectOnFlare } from "../../../lib/health-tools.js";
import { WIDGET_URI, widgetHtml } from "../../../lib/widget.js";

const textValue = z.string().trim().max(2000);
const shortText = z.string().trim().max(1000);
const shortList = z.array(shortText).max(25).default([]);
const outputShortList = z.array(z.string().trim().max(1500)).max(25);
const consentConfirmed = z.literal(true).describe(
  "Set to true only after the user explicitly agrees to transient processing of their non-identifying, user-authored health notes. Do not submit PHI, medical-record identifiers, contact details, credentials, or provider documents."
);
const disclaimerValue = z.string().trim().max(2000);
const promptGroupsSchema = z.object({
  sensation: z.array(z.string()).max(30),
  timing: z.array(z.string()).max(30),
  pattern: z.array(z.string()).max(30),
  impact: z.array(z.string()).max(30)
});
const symptomWordsSchema = z.object({
  originalDescription: textValue,
  prompts: promptGroupsSchema,
  starterSentence: z.string().max(10000),
  disclaimer: disclaimerValue
});
const timelineItemSchema = z.object({
  date: z.string().max(80),
  observation: textValue,
  category: z.string().max(120),
  impact: shortText,
  uncertainty: z.string().max(500)
});
const timelineOutputSchema = z.object({
  timeline: z.array(timelineItemSchema).max(50),
  changePoints: z.array(timelineItemSchema).max(6),
  disclaimer: disclaimerValue
});
const briefSchema = z.object({
  mainGoal: textValue,
  changes: outputShortList,
  impacts: outputShortList,
  medicines: outputShortList,
  questions: outputShortList,
  detailsToBring: outputShortList,
  disclaimer: disclaimerValue
});
const flareSchema = z.object({
  baselineBefore: outputShortList,
  during: outputShortList,
  recoveryAfter: outputShortList,
  possiblePatternsToObserve: outputShortList,
  disclaimer: disclaimerValue
});

const handler = createMcpHandler((server) => {
  server.registerResource("appointment-brief-card", WIDGET_URI, {}, async () => ({
    contents: [{
      uri: WIDGET_URI,
      mimeType: "text/html;profile=mcp-app",
      text: widgetHtml,
      _meta: { ui: { prefersBorder: true, domain: "https://juno-health-tools.vercel.app", csp: { connectDomains: [], resourceDomains: [] } } }
    }]
  }));

  server.registerTool("find_symptom_words", {
    title: "Find symptom words",
    description: "After explicit consent, organise only the user's non-identifying description into neutral sensation, timing, pattern, and impact vocabulary. Do not accept PHI or infer a diagnosis or cause.",
    inputSchema: z.object({ consentConfirmed, description: textValue, bodyArea: textValue.optional(), timing: textValue.optional(), impact: textValue.optional() }),
    outputSchema: symptomWordsSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Finding clearer words…", "openai/toolInvocation/invoked": "Word prompts ready." }
  }, async (input) => {
    const { consentConfirmed: _consent, ...values } = input;
    const result = findSymptomWords(values);
    return { structuredContent: result, content: [{ type: "text", text: `Here are neutral word prompts and a starter sentence. ${result.disclaimer}` }] };
  });

  server.registerTool("build_health_timeline", {
    title: "Build health timeline",
    description: "After explicit consent, sort only non-identifying, user-authored observations into a factual chronology while preserving uncertainty. Do not accept PHI or invent dates or diagnoses.",
    inputSchema: z.object({ consentConfirmed, observations: z.array(z.object({ date: z.string().max(80).optional(), observation: textValue, category: z.string().max(120).optional(), impact: z.string().max(1000).optional(), uncertainty: z.string().max(500).optional() })).min(1).max(50) }),
    outputSchema: timelineOutputSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Organising the timeline…", "openai/toolInvocation/invoked": "Timeline organised." }
  }, async (input) => {
    const { consentConfirmed: _consent, ...values } = input;
    const result = buildHealthTimeline(values);
    return { structuredContent: result, content: [{ type: "text", text: `Organised ${result.timeline.length} supplied observations. ${result.disclaimer}` }] };
  });

  server.registerTool("prepare_appointment_brief", {
    title: "Prepare appointment brief",
    description: "After explicit consent, turn minimal non-identifying goals, changes, impact, user-stated medicines, and questions into a concise appointment brief. Do not accept PHI or provide medical advice.",
    inputSchema: z.object({ consentConfirmed, mainGoal: textValue, changes: shortList, impacts: shortList, medicines: shortList, questions: shortList, detailsToBring: shortList }),
    outputSchema: briefSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Preparing the brief…", "openai/toolInvocation/invoked": "Brief prepared." }
  }, async (input) => {
    const { consentConfirmed: _consent, ...values } = input;
    const result = prepareAppointmentBrief(values);
    return { structuredContent: result, content: [{ type: "text", text: `Prepared a concise brief with ${result.questions.length} prioritised questions. ${result.disclaimer}` }] };
  });

  server.registerTool("reflect_on_flare", {
    title: "Reflect on a flare",
    description: "After explicit consent, structure only non-identifying, user-authored before, during, and after observations; turn suspected patterns into questions, not causal claims. Do not accept PHI.",
    inputSchema: z.object({ consentConfirmed, baselineBefore: shortList, during: shortList, recoveryAfter: shortList, possiblePatterns: shortList }),
    outputSchema: flareSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Structuring the reflection…", "openai/toolInvocation/invoked": "Reflection structured." }
  }, async (input) => {
    const { consentConfirmed: _consent, ...values } = input;
    const result = reflectOnFlare(values);
    return { structuredContent: result, content: [{ type: "text", text: `Structured the flare as before, during, and after observations. ${result.disclaimer}` }] };
  });

  server.registerTool("render_appointment_brief", {
    title: "Render appointment brief",
    description: "After the user's existing consent, render the non-identifying output of prepare_appointment_brief as an accessible card. Call prepare_appointment_brief first; do not add PHI.",
    inputSchema: briefSchema.extend({ consentConfirmed }),
    outputSchema: briefSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { ui: { resourceUri: WIDGET_URI }, "openai/outputTemplate": WIDGET_URI, "openai/toolInvocation/invoking": "Rendering the brief…", "openai/toolInvocation/invoked": "Brief ready." }
  }, async (input) => {
    const { consentConfirmed: _consent, ...brief } = input;
    return { structuredContent: brief, content: [{ type: "text", text: `Showing the appointment brief. ${brief.disclaimer}` }] };
  });
}, {
  serverInfo: { name: "Juno Health Tools", version: "1.1.0" },
  instructions: "Before any tool call, disclose that Juno Health Tools transiently processes the submitted text without intentionally storing it, ask whether the user wants to continue, and set consentConfirmed true only after explicit agreement. Do not request or accept protected health information (PHI), names, contact details, record or insurance numbers, credentials, provider documents, or other identifying data. Use only minimal user-authored observations. Do not diagnose, infer causes, recommend treatment, or replace urgent care. Prefer data tools first and call render_appointment_brief once, after prepare_appointment_brief."
});

export { handler as GET, handler as POST };
