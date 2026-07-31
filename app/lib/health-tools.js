const DISCLAIMER = "This organises information for a conversation; it is not medical advice or a diagnosis.";

const clean = (value = "") => String(value).replace(/\s+/g, " ").trim();
const list = (values = [], limit = 12) => values.map(clean).filter(Boolean).slice(0, limit);

export function findSymptomWords({ description, bodyArea = "", timing = "", impact = "" }) {
  const sensationWords = ["aching", "burning", "cramping", "electric", "heavy", "numb", "pressure-like", "prickling", "pulsing", "sharp", "sore", "stabbing", "tight", "tingling", "throbbing"];
  const timingWords = ["constant", "intermittent", "episodic", "sudden", "gradual", "delayed after activity", "worse at a particular time", "building through the day"];
  const patternWords = ["localised", "spreading", "moving", "symmetrical", "one-sided", "triggered by movement", "changed by position", "unpredictable"];
  const impactWords = ["slows walking", "interrupts sleep", "limits concentration", "requires a rest", "changes appetite", "makes speaking harder", "prevents usual tasks", "needs help from another person"];
  const base = clean(description);
  return {
    originalDescription: base,
    prompts: { sensation: sensationWords, timing: timingWords, pattern: patternWords, impact: impactWords },
    starterSentence: [base, bodyArea && `felt around ${clean(bodyArea)}`, timing && clean(timing), impact && `and ${clean(impact)}`].filter(Boolean).join(", "),
    disclaimer: DISCLAIMER
  };
}

export function buildHealthTimeline({ observations }) {
  const timeline = observations
    .map((item) => ({
      date: clean(item.date) || "Date uncertain",
      observation: clean(item.observation),
      category: clean(item.category) || "Observation",
      impact: clean(item.impact),
      uncertainty: clean(item.uncertainty)
    }))
    .filter((item) => item.observation)
    .sort((a, b) => {
      const left = Date.parse(a.date);
      const right = Date.parse(b.date);
      if (Number.isNaN(left) || Number.isNaN(right)) return 0;
      return left - right;
    });
  const changePoints = timeline.filter((item) => /first|start|wors|improv|change|new/i.test(`${item.observation} ${item.category}`)).slice(0, 6);
  return { timeline, changePoints, disclaimer: DISCLAIMER };
}

export function prepareAppointmentBrief(input) {
  const changes = list(input.changes, 3);
  const impacts = list(input.impacts, 4);
  const medicines = list(input.medicines, 12);
  const userQuestions = list(input.questions, 5);
  const questions = [...userQuestions];
  if (questions.length < 3) questions.push("What are the most useful next steps to clarify or manage this concern?");
  if (questions.length < 3) questions.push("What changes should prompt me to contact the care team, and how?");
  return {
    mainGoal: clean(input.mainGoal), changes, impacts, medicines, questions: questions.slice(0, 5),
    detailsToBring: list(input.detailsToBring, 6), disclaimer: DISCLAIMER
  };
}

export function reflectOnFlare(input) {
  return {
    baselineBefore: list(input.baselineBefore, 8),
    during: list(input.during, 10),
    recoveryAfter: list(input.recoveryAfter, 8),
    possiblePatternsToObserve: list(input.possiblePatterns, 6).map((value) => `Could ${value} be worth tracking as an observation rather than assuming it was a cause?`),
    disclaimer: DISCLAIMER
  };
}
