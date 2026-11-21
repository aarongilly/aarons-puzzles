// Shared static-view scaffold. Add actual puzzle artwork and rules as designed.
const DETAIL_VIEWS = {
  "house-puzzle": { title: "House puzzle", image: null, kind: "puzzle" },
  // Replace image with Aaron's finished full-screen med-kit pickup illustration.
  "kid-med-kit": { title: "Med kit found!", image: null, kind: "pickup" },
  "boss-arena": { title: "DEFEAT THE BOSS", image: null, kind: "arena", keyItem: "bossKey" },
  "return-boss-arena": { title: "Return boss arena", image: null, kind: "arena", keyItem: "returnBossKey" },
};

function restoreDetailState(saved) {
  const id = typeof saved?.id === "string" && Object.hasOwn(DETAIL_VIEWS, saved.id) ? saved.id : "house-puzzle";
  const returnScreen = ["home", "go-home", "get-to-playground"].includes(saved?.returnScreen) ? saved.returnScreen : "home";
  const point = saved?.returnPoint;
  const returnPoint = returnScreen !== "home" && Number.isFinite(point?.x) && Number.isFinite(point?.y)
    ? { x: point.x, y: point.y, facing: point.facing === -1 ? -1 : 1 } : null;
  return { id, returnScreen, returnPoint };
}

function createDetailView(canvas, { onStepBack = () => {}, inventory = {}, getBossHits = () => 0,
  onBossProgress = () => {}, onAction = () => {}, onHazardHit = () => {}, onPickup = () => {}, onSpringBounce = () => {}, onPlayerPosition = () => {} } = {}) {
  const context = canvas.getContext("2d");
  const images = new Map();
  const back = { x: 12, y: canvas.height - 68, width: 144, height: 56 };
  let active = false;
  let id = "house-puzzle";
  let theme;
  let pointer = null;
  let arena = null;
  const arenas = new Map();
  let gamepadActionHeld = false;

  function draw() {
    if (!active) return;
    const view = DETAIL_VIEWS[id];
    const height = canvas.height - 80;
    context.fillStyle = "#e7e9ed";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const record = view.image && images.get(view.image);
    if (record?.ready) {
      const scale = Math.min(canvas.width / record.image.naturalWidth, height / record.image.naturalHeight);
      const width = record.image.naturalWidth * scale, imageHeight = record.image.naturalHeight * scale;
      context.drawImage(record.image, (canvas.width - width) / 2, (height - imageHeight) / 2, width, imageHeight);
    } else if (view.kind === "pickup") {
      context.fillStyle = "#27272a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 28px Arial, sans-serif";
      context.fillText(view.title, canvas.width / 2, 120);
      // Temporary med-kit illustration until the finished scene is supplied.
      context.fillStyle = "#875d3b";
      context.fillRect(415, 170, 70, 18);
      context.fillStyle = "#f7faf8";
      context.fillRect(350, 188, 200, 140);
      context.fillStyle = "#c74c53";
      context.fillRect(435, 215, 30, 86);
      context.fillRect(407, 243, 86, 30);
      context.fillStyle = "#27272a";
      context.font = "20px Arial, sans-serif";
      context.fillText("Time to help Griffin!", canvas.width / 2, 375);
    } else {
      context.fillStyle = "#27272a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 28px Arial, sans-serif";
      context.fillText(view.title, canvas.width / 2, 140);
      context.font = "18px Arial, sans-serif";
      context.fillText(record?.error ? "Unable to load puzzle image." : view.image ? "Loading puzzle image…" : "Puzzle placeholder", canvas.width / 2, 184);
    }
    context.fillStyle = "#1d2b35";
    context.fillRect(0, height, canvas.width, 80);
    context.fillStyle = "#06b6d4";
    context.fillRect(back.x, back.y, back.width, back.height);
    context.fillStyle = "#101820";
    context.font = "bold 18px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(view.kind === "pickup" ? "Continue" : "Step Back", back.x + back.width / 2, back.y + back.height / 2);
    canvas.setAttribute("aria-label", view.kind === "pickup" ?
      "You got the med kit. Click Continue or press Enter or Space to head back to Griffin." :
      `${view.title}. Click or tap Step Back, or press Escape, to return.`);
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left - canvas.clientLeft) * canvas.width / canvas.clientWidth,
      y: (event.clientY - rect.top - canvas.clientTop) * canvas.height / canvas.clientHeight };
  }
  const onBack = p => p.x >= back.x && p.x < back.x + back.width && p.y >= back.y && p.y < back.y + back.height;
  canvas.addEventListener("pointerdown", event => {
    if (!active || event.button !== 0 || pointer) return;
    const p = point(event);
    if (!onBack(p)) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    pointer = { id: event.pointerId, ...p, dragged: false };
  });
  canvas.addEventListener("pointermove", event => {
    if (pointer?.id !== event.pointerId) return;
    const p = point(event);
    if (Math.hypot(p.x - pointer.x, p.y - pointer.y) > 6) pointer.dragged = true;
  });
  canvas.addEventListener("pointerup", event => {
    if (!active || pointer?.id !== event.pointerId) return;
    const start = pointer;
    pointer = null;
    const p = point(event);
    if (!start.dragged && Math.hypot(p.x - start.x, p.y - start.y) <= 6 && onBack(p)) onStepBack();
  });
  for (const event of ["pointercancel", "lostpointercapture"]) canvas.addEventListener(event, () => { pointer = null; });
  window.addEventListener("blur", () => { pointer = null; });
  document.addEventListener("visibilitychange", () => { pointer = null; });
  window.addEventListener("keydown", event => {
    const key = DETAIL_VIEWS[id].kind === "pickup" ? ["Enter", "Space"].includes(event.code) : event.code === "Escape";
    if (!active || !key || event.repeat || event.target.closest?.(DETAIL_VIEWS[id].kind === "pickup" ?
      "input, textarea, select, [contenteditable]" : "input, textarea, select, button, [contenteditable]")) return;
    event.preventDefault();
    onStepBack();
  });

  return {
    setGamepadInput(state = {}) {
      const action = state.controls?.includes("action") === true;
      const pressed = action && !gamepadActionHeld;
      gamepadActionHeld = action;
      arena?.setGamepadInput(state);
      if (active && !state.suspended && DETAIL_VIEWS[id].kind === "pickup" && pressed) onStepBack();
    },
    start(nextId, nextTheme) {
      if (!Object.hasOwn(DETAIL_VIEWS, nextId)) return false;
      id = nextId;
      theme = nextTheme;
      if (DETAIL_VIEWS[id].kind === "arena") {
        active = false;
        pointer = null;
        arena?.stop();
        const arenaId = id;
        const keyItem = DETAIL_VIEWS[id].keyItem;
        const hits = getBossHits(id);
        if (hits >= 3 && inventory[keyItem]) { onStepBack({ arenaExit: true, vy: -600 }); return true; }
        if (!inventory.stick && hits < 3) return false;
        if (!arenas.has(id)) arenas.set(id, createPlatformer(canvas, {
          arena: true, bossHits: hits, bossKeyItem: keyItem, inventory,
          onBossProgress: value => onBossProgress(value, arenaId),
          onAction, onHazardHit, onPickup, onSpringBounce, onPlayerPosition, onStepBack,
        }));
        arena = arenas.get(id);
        arena.setArenaProgress(hits);
        arena.start();
        canvas.setAttribute("aria-label", "Boss arena. Move with A/D or arrows, jump with W or Up, Action with Space. Defeat the boss, then collect its dropped key with Action to jump through the ceiling opening and return outside.");
        return true;
      }
      arena?.stop();
      active = true;
      pointer = null;
      const src = DETAIL_VIEWS[id].image;
      if (src && !images.has(src)) {
        const image = new Image();
        const record = { image, ready: false, error: false };
        images.set(src, record);
        image.addEventListener("load", () => { record.ready = true; if (active && DETAIL_VIEWS[id].image === src) draw(); });
        image.addEventListener("error", () => { record.error = true; if (active && DETAIL_VIEWS[id].image === src) draw(); });
        image.src = src;
      }
      draw();
      return true;
    },
    stop() { active = false; pointer = null; arena?.stop(); },
  };
}
