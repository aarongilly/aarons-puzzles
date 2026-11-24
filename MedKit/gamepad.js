// The browser remaps supported controllers to the W3C "standard" layout.
// https://w3c.github.io/gamepad/#remapping
const GAMEPAD_DEAD_ZONE = 0.25;
const GAMEPAD_CONTROL_LABELS = {
  left: "Left", right: "Right", up: "Up (unused)", down: "Down (unused)",
  action: "Action", jump: "Jump", start: "Start Game",
};

function readGamepadControls(pad, tryStandard = false) {
  const buttons = Array.from(pad.buttons ?? [], (button, index) =>
    button?.pressed || button?.value > 0.5 ? index : null).filter(index => index !== null);
  const controls = [];
  const mapped = pad.mapping === "standard" || (tryStandard && pad.mapping === "");
  if (mapped) {
    const pressed = index => buttons.includes(index);
    const x = pad.axes?.[0] ?? 0, y = pad.axes?.[1] ?? 0;
    if (pressed(14) || x < -GAMEPAD_DEAD_ZONE) controls.push("left");
    if (pressed(15) || x > GAMEPAD_DEAD_ZONE) controls.push("right");
    if (pressed(12) || y < -GAMEPAD_DEAD_ZONE) controls.push("up");
    if (pressed(13) || y > GAMEPAD_DEAD_ZONE) controls.push("down");
    if (pressed(0)) controls.push("action");
    if (pressed(1)) controls.push("jump");
    if (pressed(9)) controls.push("start");
  }
  return { status: mapped ? "ready" : "unmapped",
    compatibility: mapped && pad.mapping !== "standard",
    id: pad.id, index: pad.index, controls, buttons };
}

function createGamepadControls({ onInput = () => {} } = {}) {
  let running = false;
  let frameId;
  let selected = null;
  let blurred = false;
  let needsNeutral = false;
  let compatibilityId = null;

  function release() {
    needsNeutral = true;
    onInput({ status: "paused", controls: [], buttons: [] });
  }
  window.addEventListener("blur", () => { blurred = true; release(); });
  window.addEventListener("focus", () => { blurred = false; });
  document.addEventListener("visibilitychange", release);
  window.addEventListener("gamepaddisconnected", event => {
    if (event.gamepad.index === selected) { selected = null; release(); }
  });

  function poll() {
    if (!running) return;
    let state = { status: "waiting", controls: [], buttons: [] };
    if (blurred || document.hidden || document.hasFocus?.() === false) {
      needsNeutral = true;
      state.status = "paused";
    } else if (typeof navigator.getGamepads !== "function") state.status = "unsupported";
    else {
      try {
        const pads = Array.from(navigator.getGamepads() ?? []).filter(pad => pad?.connected);
        const current = pads.find(pad => pad.index === selected);
        const pad = current?.mapping === "standard" ? current :
          pads.find(pad => pad.mapping === "standard") ?? current ?? pads[0];
        if (pad) {
          if (selected !== pad.index) needsNeutral = true;
          selected = pad.index;
          state = readGamepadControls(pad, pad.id === compatibilityId);
          if (needsNeutral) {
            // A held button must not fire after reconnecting or returning to the tab.
            if (!state.controls.length) needsNeutral = false;
            state = { ...state, testControls: state.controls, controls: [], waitingForRelease: needsNeutral };
          }
        } else selected = null;
      } catch {
        state.status = "blocked";
        selected = null;
        needsNeutral = true;
      }
    }
    onInput(state);
    if (running) frameId = requestAnimationFrame(poll);
  }

  return {
    tryStandardMapping() {
      // Only the currently selected controller opts into this trial layout.
      try {
        const pad = Array.from(navigator.getGamepads() ?? []).find(pad => pad?.connected && pad.index === selected);
        if (!pad || pad.mapping !== "") return false;
        compatibilityId = pad.id;
        release();
        return true;
      } catch { return false; }
    },
    start() { if (!running) { running = true; poll(); } },
    stop() { running = false; cancelAnimationFrame(frameId); release(); },
  };
}
