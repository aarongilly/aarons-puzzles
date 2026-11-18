// Demonstration values only. This is not the real puzzle combination or game state.
export const DEMO_COMBINATION = "000";
export const BOX_DIMENSIONS = { width: 100, depth: 100, height: 33 };

export function createBoxState() {
  return { digits: [0, 0, 0], unlocked: false, lidOpen: false, lidFlipped: false, panelRemoved: false, buttonPresses: 0 };
}

export function applyBoxAction(state, action, index = 0) {
  const blocked = message => ({ changed: false, message });
  let message;
  switch (action) {
    case "digit":
      if (state.unlocked || !Number.isInteger(index) || index < 0 || index > 2) return blocked("Reset the demo to try the lock again.");
      state.digits[index] = (state.digits[index] + 1) % 10;
      message = "Demo combination: 000. Click a digit to change it.";
      break;
    case "unlock":
      if (state.unlocked) return blocked("Already unlocked.");
      if (state.digits.join("") !== DEMO_COMBINATION) return blocked("Locked. Use 000 for this demonstration.");
      state.unlocked = true;
      message = "Unlocked. Slide the lid off to inspect the cavity.";
      break;
    case "lid":
      if (!state.unlocked) return blocked("Unlock the lid first. Demo combination: 000.");
      if (state.panelRemoved) return blocked("Return the panel before closing the box.");
      state.lidOpen = !state.lidOpen;
      state.lidFlipped = false;
      message = state.lidOpen ? "Lid removed. Flip it to inspect the underside, or lift out the panel." : "Lid closed.";
      break;
    case "flip":
      if (!state.lidOpen) return blocked("Slide the lid off before flipping it.");
      state.lidFlipped = !state.lidFlipped;
      message = state.lidFlipped ? "Lid underside: a placeholder for future clues." : "Lid top facing up.";
      break;
    case "panel":
      if (!state.lidOpen) return blocked("Slide the lid off before removing the panel.");
      state.panelRemoved = !state.panelRemoved;
      message = state.panelRemoved ? "Panel removed. Contact-switch power is ON. Try its two demo buttons." : "Panel returned. Contact-switch power is OFF.";
      break;
    case "panel-button":
      if (!state.panelRemoved) return blocked("The panel powers on when removed from the box.");
      state.buttonPresses++;
      message = `Demo button ${index + 1} pressed. No puzzle behavior is assigned.`;
      break;
    case "reset":
      Object.assign(state, createBoxState());
      message = "Demo reset. Combination: 000. Drag the scene to inspect the box.";
      break;
    default:
      return blocked("Unknown demonstration action.");
  }
  return { changed: true, message };
}

export function getHudButtons(state) {
  const button = (action, x, width, label, disabled = false, index = 0) => ({ action, x, y: 46, width, height: 38, label, disabled, index });
  return [
    ...state.digits.map((digit, index) => button("digit", 12 + index * 40, 32, String(digit), state.unlocked, index)),
    button("unlock", 136, 100, state.unlocked ? "Unlocked" : "Unlock", state.unlocked),
    button("lid", 248, 118, state.lidOpen ? "Close lid" : "Slide lid", !state.unlocked || state.panelRemoved),
    button("flip", 378, 100, "Flip lid", !state.lidOpen),
    button("panel", 490, 150, state.panelRemoved ? "Return panel" : "Remove panel", !state.lidOpen),
    button("view", 652, 110, "Reset view"),
    button("reset", 774, 114, "Reset demo"),
  ];
}
