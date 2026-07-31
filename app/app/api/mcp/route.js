import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { buildHealthTimeline, findSymptomWords, prepareAppointmentBrief, reflectOnFlare } from "../../../lib/health-tools.js";
import { WIDGET_URI, widgetHtml } from "../../../lib/widget.js";

const textValue = z.string().trim().max(2000);
const shortList = z.array(z.string().trim().max(1000)).max(25).default([]);
const briefSchema = z.object({
  mainGoal: textValue,
  changes: shortList,
  impacts: shortList,
  medicines: shortList,
  questions: shortList,
  detailsToBring: shortList,
  disclaimer: textValue
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
    description: "Offer neutral vocabulary for sensation, timing, pattern, and impact. This does not diagnose or infer a cause.",
    inputSchema: z.object({ description: textValue, bodyArea: textValue.optional(), timing: textValue.optional(), impact: textValue.optional() }),
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Finding clearer words…", "openai/toolInvocation/invoked": "Word prompts ready." }
  }, async (input) => {
    const result = findSymptomWords(input);
    return { structuredContent: result, content: [{ type: "text", text: `Here are neutral word prompts and a starter sentence. ${result.disclaimer}` }] };
  });

  server.registerTool("build_health_timeline", {
    title: "Build health timeline",
    description: "Sort supplied observations into a factual chronology while preserving uncertainty. Never invents dates or diagnoses.",
    inputSchema: z.object({ observations: z.array(z.object({ date: z.string().max(80).optional(), observation: textValue, category: z.string().max(120).optional(), impact: z.string().max(1000).optional(), uncertainty: z.string().max(500).optional() })).min(1).max(50) }),
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Organising the timeline…", "openai/toolInvocation/invoked": "Timeline organised." }
  }, async (input) => {
    const result = buildHealthTimeline(input);
    return { structuredContent: result, content: [{ type: "text", text: `Organised ${result.timeline.length} supplied observations. ${result.disclaimer}` }] };
  });

  server.registerTool("prepare_appointment_brief", {
    title: "Prepare appointment brief",
    description: "Turn supplied goals, changes, impact, medicines, and questions into a concise appointment brief. Does not provide medical advice.",
    inputSchema: z.object({ mainGoal: textValue, changes: shortList, impacts: shortList, medicines: shortList, questions: shortList, detailsToBring: shortList }),
    outputSchema: briefSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Preparing the brief…", "openai/toolInvocation/invoked": "Brief prepared." }
  }, async (input) => {
    const result = prepareAppointmentBrief(input);
    return { structuredContent: result, content: [{ type: "text", text: `Prepared a concise brief with ${result.questions.length} prioritised questions. ${result.disclaimer}` }] };
  });

  server.registerTool("reflect_on_flare", {
    title: "Reflect on a flare",
    description: "Structure before, during, and after observations and turn suspected patterns into questions to monitor, not causal claims.",
    inputSchema: z.object({ baselineBefore: shortList, during: shortList, recoveryAfter: shortList, possiblePatterns: shortList }),
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { "openai/toolInvocation/invoking": "Structuring the reflection…", "openai/toolInvocation/invoked": "Reflection structured." }
  }, async (input) => {
    const result = reflectOnFlare(input);
    return { structuredContent: result, content: [{ type: "text", text: `Structured the flare as before, during, and after observations. ${result.disclaimer}` }] };
  });

  server.registerTool("render_appointment_brief", {
    title: "Render appointment brief",
    description: "Render the final result of prepare_appointment_brief as an accessible card. Call prepare_appointment_brief first, then pass its complete output here.",
    inputSchema: briefSchema,
    outputSchema: briefSchema,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { ui: { resourceUri: WIDGET_URI }, "openai/outputTemplate": WIDGET_URI, "openai/toolInvocation/invoking": "Rendering the brief…", "openai/toolInvocation/invoked": "Brief ready." }
  }, async (input) => ({ structuredContent: input, content: [{ type: "text", text: `Showing the appointment brief. ${input.disclaimer}` }] }));
}, {
  serverInfo: { name: "Juno Health Tools", version: "1.0.0" },
  instructions: "Use these tools only to organise user-supplied information. Do not diagnose, infer causes, recommend treatment, or replace urgent care. Prefer data tools first and call render_appointment_brief once, after prepare_appointment_brief."
});

export { handler as GET, handler as POST };

