import { buildPlan, CATEGORY_META, EMPTY_STATE, normalizeState, noteCountLabel } from "./lib.js";

const STORAGE_KEY = "junoAppointmentPrep";
const elements = {
  appointmentDate: document.querySelector("#appointment-date"),
  clinician: document.querySelector("#clinician"),
  goal: document.querySelector("#goal"),
  quickNote: document.querySelector("#quick-note"),
  promptHint: document.querySelector("#prompt-hint"),
  addNote: document.querySelector("#add-note"),
  notesList: document.querySelector("#notes-list"),
  notesEmpty: document.querySelector("#notes-empty"),
  entryCount: document.querySelector("#entry-count"),
  saveStatus: document.querySelector("#save-status"),
  copyPlan: document.querySelector("#copy-plan"),
  downloadPlan: document.querySelector("#download-plan"),
  clearPlan: document.querySelector("#clear-plan"),
  categories: [...document.querySelectorAll(".category")],
  toast: document.querySelector("#toast"),
};

let state = { ...EMPTY_STATE, notes: [] };
let activeCategory = "change";
let saveTimer;
let toastTimer;

async function loadState() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  state = normalizeState(stored[STORAGE_KEY]);
  elements.appointmentDate.value = state.appointmentDate;
  elements.clinician.value = state.clinician;
  elements.goal.value = state.goal;
  renderNotes();
}

function queueSave() {
  elements.saveStatus.textContent = "Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
    elements.saveStatus.textContent = "Saved";
  }, 180);
}

function syncContext() {
  state.appointmentDate = elements.appointmentDate.value;
  state.clinician = elements.clinician.value;
  state.goal = elements.goal.value;
  queueSave();
}

function setCategory(category) {
  activeCategory = category;
  const meta = CATEGORY_META[category];
  elements.categories.forEach((button) => {
    const selected = button.dataset.category === category;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  elements.promptHint.textContent = meta.prompt;
  elements.quickNote.placeholder = meta.placeholder;
  elements.quickNote.focus();
}

function addNote() {
  const text = elements.quickNote.value.trim();
  if (!text) {
    showToast("Write a short note first.");
    elements.quickNote.focus();
    return;
  }

  state.notes.push({
    id: crypto.randomUUID(),
    category: activeCategory,
    text: text.slice(0, 400),
    createdAt: Date.now(),
  });
  elements.quickNote.value = "";
  renderNotes();
  queueSave();
  showToast(`${CATEGORY_META[activeCategory].label} added.`);
}

function removeNote(id) {
  state.notes = state.notes.filter((note) => note.id !== id);
  renderNotes();
  queueSave();
}

function renderNotes() {
  elements.notesList.replaceChildren();
  elements.notesEmpty.hidden = state.notes.length > 0;
  elements.entryCount.textContent = noteCountLabel(state.notes.length);

  [...state.notes].reverse().forEach((note) => {
    const item = document.createElement("li");
    item.className = "note-item";

    const body = document.createElement("div");
    body.className = "note-body";

    const category = document.createElement("span");
    category.className = `note-type type-${note.category}`;
    category.textContent = CATEGORY_META[note.category].label;

    const text = document.createElement("p");
    text.textContent = note.text;

    const remove = document.createElement("button");
    remove.className = "remove-note";
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${CATEGORY_META[note.category].label.toLowerCase()} note`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeNote(note.id));

    body.append(category, text);
    item.append(body, remove);
    elements.notesList.append(item);
  });
}

async function copyPlan() {
  await navigator.clipboard.writeText(buildPlan(state));
  showToast("Appointment plan copied.");
}

function downloadPlan() {
  const blob = new Blob([buildPlan(state)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `juno-appointment-prep-${state.appointmentDate || "notes"}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("Appointment plan downloaded.");
}

async function clearPlan() {
  const hasContent = state.goal || state.clinician || state.appointmentDate || state.notes.length;
  if (!hasContent) {
    showToast("Your plan is already clear.");
    return;
  }
  const confirmed = window.confirm("Clear all appointment-prep notes stored by this extension?");
  if (!confirmed) return;
  state = { ...EMPTY_STATE, notes: [] };
  elements.appointmentDate.value = "";
  elements.clinician.value = "";
  elements.goal.value = "";
  elements.quickNote.value = "";
  renderNotes();
  await chrome.storage.local.remove(STORAGE_KEY);
  elements.saveStatus.textContent = "Cleared";
  showToast("Local notes cleared.");
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

elements.categories.forEach((button) => button.addEventListener("click", () => setCategory(button.dataset.category)));
[elements.appointmentDate, elements.clinician, elements.goal].forEach((input) => input.addEventListener("input", syncContext));
elements.addNote.addEventListener("click", addNote);
elements.quickNote.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") addNote();
});
elements.copyPlan.addEventListener("click", copyPlan);
elements.downloadPlan.addEventListener("click", downloadPlan);
elements.clearPlan.addEventListener("click", clearPlan);

loadState().catch(() => {
  elements.saveStatus.textContent = "Local save unavailable";
  showToast("Could not load local notes.");
});
