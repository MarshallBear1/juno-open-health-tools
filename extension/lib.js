export const CATEGORY_META = {
  change: {
    label: "Change",
    prompt: "Describe what changed, when, and how often.",
    placeholder: "What is different from your usual baseline?",
  },
  timeline: {
    label: "Timeline",
    prompt: "Anchor the observation to a date or time range.",
    placeholder: "When did it begin, change, or settle?",
  },
  impact: {
    label: "Impact",
    prompt: "Name a concrete task, activity, or routine affected.",
    placeholder: "What became harder, slower, or different?",
  },
  question: {
    label: "Question",
    prompt: "Write the exact question you want answered.",
    placeholder: "What do you want to ask before time runs out?",
  },
};

export const EMPTY_STATE = Object.freeze({
  appointmentDate: "",
  clinician: "",
  goal: "",
  notes: [],
});

export function normalizeState(value) {
  const source = value && typeof value === "object" ? value : {};
  const notes = Array.isArray(source.notes)
    ? source.notes
        .filter((note) => note && CATEGORY_META[note.category] && typeof note.text === "string")
        .map((note, index) => ({
          id: String(note.id || `note-${index}`),
          category: note.category,
          text: note.text.trim().slice(0, 400),
          createdAt: Number.isFinite(note.createdAt) ? note.createdAt : 0,
        }))
        .filter((note) => note.text)
        .slice(0, 50)
    : [];

  return {
    appointmentDate: typeof source.appointmentDate === "string" ? source.appointmentDate.slice(0, 10) : "",
    clinician: typeof source.clinician === "string" ? source.clinician.trim().slice(0, 80) : "",
    goal: typeof source.goal === "string" ? source.goal.trim().slice(0, 280) : "",
    notes,
  };
}

export function formatAppointmentDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "Not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function buildPlan(rawState) {
  const state = normalizeState(rawState);
  const sections = Object.keys(CATEGORY_META)
    .map((category) => ({ category, notes: state.notes.filter((note) => note.category === category) }))
    .filter((section) => section.notes.length);

  const lines = [
    "JUNO APPOINTMENT PREP",
    "=====================",
    `Date: ${formatAppointmentDate(state.appointmentDate)}`,
    `Clinician or service: ${state.clinician || "Not set"}`,
    "",
    "MAIN GOAL",
    state.goal || "Not set",
  ];

  for (const section of sections) {
    lines.push("", CATEGORY_META[section.category].label.toUpperCase());
    section.notes.forEach((note, index) => lines.push(`${index + 1}. ${note.text}`));
  }

  lines.push(
    "",
    "NEXT-STEP CHECK",
    "• What is the next step?",
    "• Who owns it?",
    "• When should I follow up?",
    "• What should I do if things change before then?",
    "",
    "This plan organises observations and questions. It is not medical advice, diagnosis, treatment, or emergency care.",
    "Created with Juno Appointment Prep: https://junocompanion.com/",
  );

  return lines.join("\n");
}

export function noteCountLabel(count) {
  return `${count} ${count === 1 ? "note" : "notes"}`;
}
