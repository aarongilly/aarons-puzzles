export const ADMIN_CODE = "725";
export const BOX_DIMENSIONS = { width: 100, depth: 100, height: 33 };
export const SITUATIONS = [
  { label: "Decapitation", response: "Beyond this device's paygrade." },
  { label: "Rampant Diarrhea", response: "Find a toilet. Drink water." },
  { label: "Acute Homework Allergy", response: "Not a real condition." },
  { label: "Door-related Head Injury", response: "Duck faster." },
  { label: "Lethargy", response: "Plenty of water. Move your body more. Avoid alcohol." },
  { label: "Minor Playground scrape", correct: true },
  { label: "Possible Demon Possession", response: "5 Hail Marys and church on Sundays." },
  { label: "Spooky Spider", response: "Kill it with fire." },
];
const digits = value => Array.isArray(value) && value.length === 3 && value.every(n => Number.isInteger(n) && n >= 0 && n <= 9) ? [...value] : [0, 0, 0];
export function createBoxState(saved = {}) {
  const stage = ["situations", "admin", "dispensed", "collected"].includes(saved?.stage) ? saved.stage : "situations";
  return {
    lidOpen: saved?.lidOpen === true,
    situation: Number.isInteger(saved?.situation) && saved.situation >= 0 && saved.situation < SITUATIONS.length ? saved.situation : 0,
    stage: saved?.lidOpen === true ? stage : "situations",
    adminDigits: digits(saved?.adminDigits),
    selectedDigit: Number.isInteger(saved?.selectedDigit) && saved.selectedDigit >= 0 && saved.selectedDigit < 3 ? saved.selectedDigit : 0,
    feedback: "",
  };
}

export function applyBoxAction(state, action) {
  const blocked = message => ({ changed: false, message });
  if (action === "open") {
    if (state.lidOpen) return blocked("The box is already open.");
    state.lidOpen = true;
    return { changed: true, message: "Med kit opened. Tap the medical assistant to focus it." };
  }
  if (!state.lidOpen) return blocked("Open the med kit first.");
  if (action === "collect") {
    if (state.stage !== "dispensed") return blocked("No bandage is ready to collect.");
    state.stage = "collected";
    return { changed: true, completed: true, message: "Bandage collected. Time to help Griffin!" };
  }
  if (!["left", "right", "up", "down", "enter"].includes(action)) return blocked("Unknown control.");
  if (["dispensed", "collected"].includes(state.stage)) return blocked(state.stage === "dispensed" ? "Take the bandage from the dispenser." : "Bandage already collected.");
  state.feedback = "";
  if (state.stage === "situations") {
    if (action === "enter") {
      const situation = SITUATIONS[state.situation];
      if (situation.correct) { state.stage = "admin"; state.feedback = "Bandage recommended. Admin code required."; }
      else state.feedback = situation.response;
    } else state.situation = (state.situation + (["up", "left"].includes(action) ? -1 : 1) + SITUATIONS.length) % SITUATIONS.length;
  } else if (action === "left" || action === "right") {
    state.selectedDigit = (state.selectedDigit + (action === "left" ? 2 : 1)) % 3;
  } else if (action === "up" || action === "down") {
    state.adminDigits[state.selectedDigit] = (state.adminDigits[state.selectedDigit] + (action === "up" ? 1 : 9)) % 10;
  } else if (state.adminDigits.join("") === ADMIN_CODE) {
    state.stage = "dispensed";
    state.feedback = "Bandage dispensed. Take it from the slot.";
  } else state.feedback = "Admin code not recognized. Try again.";
  return { changed: true, message: state.feedback || (state.stage === "admin" ? "Left/right: select digit. Up/down: change it. Enter: dispense." : "Select the situation, then press Enter.") };
}

export function getHudButtons() {
  return [{ action: "explore", x: 12, y: 12, width: 180, height: 56, label: "Explore house" }];
}
