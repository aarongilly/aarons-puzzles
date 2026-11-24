// Shared static-view scaffold. Add actual puzzle artwork and rules as designed.
const DETAIL_VIEWS = {
  // Fill in image paths as the house artwork becomes available.
  "house-music": { title: "Music room", image: "assets/detail-music.webp", kind: "inspection" },
  "house-pics": { title: "Pictures", image: "assets/detail-pics.webp", kind: "inspection", adultOnly: true },
  "house-table": { title: "Table", image: "assets/detail-table.webp", kind: "inspection", caption: "Dad left his iPad out again—he's been drawing a ton lately." },
  "house-bathroom": { title: "Bathroom", image: "assets/detail-bathroom.webp", kind: "inspection" },
  "house-garage": { title: "Garage", image: "assets/detail-garage.webp", kind: "inspection" },
  "house-skylight": { title: "Skylight", image: "assets/detail-skylight.png", kind: "inspection" },
  "house-pantry": { title: "Pantry", image: "assets/detail-pantry.webp", kind: "inspection" },
  "house-water": { title: "Water", image: "assets/detail-water.webp", kind: "inspection" },
  "house-alexa": { title: "Alexa", image: "assets/detail-alexa.webp", kind: "inspection", adultOnly: true, caption: "this thing isn't helpful" },
  "house-deck": { title: "Deck", image: "assets/detail-deck.webp", kind: "inspection" },
  "house-tv": { title: "TV", image: "assets/detail-tv.webp", kind: "inspection", caption: "No time for screens - gotta help Griffin!" },
  "house-dad": { title: "Dad", image: "assets/detail-dad.png", kind: "inspection" },
  "house-painting": { title: "Painting", image: "assets/detail-painting.webp", kind: "inspection", adultOnly: true },
  "h-up": { title: "Upstairs", image: "assets/detail-up.png", kind: "inspection" },
  "h-dad": { title: "Dad", image: "assets/detail-dad.png", kind: "inspection" },
  "h-basement": { title: "Basement", image: "assets/h-basement.webp", kind: "inspection" },
  "hallway-office": { title: "Office", image: "assets/detail-office.webp", kind: "inspection", pan: true,
    hotspots: [
      { x: 310, y: 290, width: 85, height: 60, label: "Left desk", detail: "detail-office-left-desk" },
      { x: 580, y: 255, width: 85, height: 60, label: "Right desk", detail: "detail-office-right-desk" },
    ] },
  "detail-office-left-desk": { title: "Left desk", image: "assets/detail-office-left-desk.webp", kind: "inspection", adultOnly: true },
  "detail-office-right-desk": { title: "Right desk", image: "assets/detail-office-right-desk.webp", kind: "inspection", adultOnly: true },
  "hallway-guest": { title: "Guest room", image: "assets/detail-guest-room.webp", kind: "inspection",
    hotspots: [{ x: 430, y: 170, width: 125, height: 60, label: "Picture", detail: "guest-art" }] },
  "guest-art": { title: "Guest room art", image: "assets/detail-guest-art.webp", kind: "inspection", adultOnly: true },
  "hallway-kids": { title: "Boys’ room", image: "assets/detail-boys-room.webp", kind: "inspection",
    hotspots: [{ x: 390, y: 210, width: 120, height: 100, label: "Inspect", detail: "boys-room-detail" }] },
  "boys-room-detail": { title: "Boys’ room detail", image: "assets/detail-boys-art.webp", kind: "inspection", adultOnly: true },
  "master-bath": { title: "Master bathroom", image: "assets/detail-master-bath.webp", kind: "inspection", pan: true,
    hotspots: [
      { x: 125, y: 295, width: 170, height: 50, label: "Left cabinet", detail: "master-bath-left-cabinet" },
      { x: 550, y: 355, width: 95, height: 90, label: "Right cabinet", detail: "master-bath-right-cabinet" },
    ] },
  "master-bath-left-cabinet": { title: "Left sink cabinet", image: "assets/detail-left-sink.webp", kind: "inspection" },
  "master-bath-right-cabinet": { title: "Right sink cabinet", image: "assets/detail-right-sink.webp", kind: "inspection", pickupItem: "medKit" },
  "master-picture": { title: "Bedroom picture", image: "assets/detail-master-art.webp", kind: "inspection" },
  "master-books": { title: "Books", image: "assets/detail-master-books.webp", kind: "inspection",
    hotspots: [{ x: 390, y: 260, width: 140, height: 120, label: "Book art", detail: "master-book-art" }] },
  "master-book-art": { title: "Book art", image: "assets/detail-master-book-art.webp", kind: "inspection", adultOnly: true },
  "basement-spooky": { title: "Spooky", image: "assets/detail-spooky.webp", kind: "inspection",
    hotspots: [{ x: 380, y: 150, width: 180, height: 220, sound: "spooky" }] },
  "basement-case1": { title: "Bookcase One", image: "assets/detail-bookcase-1.webp", kind: "inspection", adultOnly: true },
  "basement-case2": { title: "Bookcase Two", image: "assets/detail-bookcase-2.webp", kind: "inspection", adultOnly: true },
  "basement-case3": { title: "Bookcase Three", image: "assets/detail-bookcase-3.webp", kind: "inspection", adultOnly: true },
  "basement-case4": { title: "Bookcase Four", image: "assets/detail-bookcase-4.webp", kind: "inspection", adultOnly: true },
  "basement-case5": { title: "Bookcase Five", image: "assets/detail-bookcase-5.webp", kind: "inspection", adultOnly: true },
  "basement-tv": { title: "Basement TV", image:  "assets/detail-basement-tv.webp", kind: "inspection", caption: "No time for screens - gotta help Griffin!" },
  // Shared bandage reveal; keep the existing ID for saved-game compatibility.
  "kid-med-kit": { title: "Bandage found!", image: null, kind: "pickup" },
  "boss-arena": { title: "DEFEAT THE BOSS", image: null, kind: "arena", keyItem: "bossKey" },
  "return-boss-arena": { title: "Return boss arena", image: null, kind: "arena", keyItem: "returnBossKey" },
};

function restoreDetailState(saved, kidMode = false) {
  let id = typeof saved?.id === "string" && Object.hasOwn(DETAIL_VIEWS, saved.id) ? saved.id : "house-music";
  const returnScreen = ["home", "go-home", "get-to-playground"].includes(saved?.returnScreen) ? saved.returnScreen : "home";
  const point = saved?.returnPoint;
  const returnPoint = returnScreen !== "home" && Number.isFinite(point?.x) && Number.isFinite(point?.y)
    ? { x: point.x, y: point.y, facing: point.facing === -1 ? -1 : 1 } : null;
  const returnDetails = Array.isArray(saved?.returnDetails) ? saved.returnDetails.filter(value =>
    typeof value === "string" && Object.hasOwn(DETAIL_VIEWS, value) && DETAIL_VIEWS[value].kind === "inspection").slice(0, 20) : [];
  while (kidMode && DETAIL_VIEWS[id].adultOnly) id = returnDetails.pop() ?? "house-music";
  const allowedReturns = returnDetails.filter(id => !kidMode || !DETAIL_VIEWS[id].adultOnly);
  return { id, returnScreen, returnPoint, ...(allowedReturns.length ? { returnDetails: allowedReturns } : {}) };
}

function createDetailView(canvas, { onStepBack = () => {}, onSound = () => {}, onOpenDetail = () => {}, canViewMedKit = () => false, onViewMedKit = () => {}, kidMode = false, panPositions = {}, onPanChange = () => {}, inventory = {}, getBossHits = () => 0,
  onBossProgress = () => {}, onAction = () => {}, onHazardHit = () => {}, onPickup = () => {}, onSpringBounce = () => {}, onPlayerPosition = () => {} } = {}) {
  const context = canvas.getContext("2d");
  const images = new Map();
  const back = { x: 12, y: canvas.height - 68, width: 144, height: 56 };
  const medKitButton = { x: 168, y: back.y, width: 170, height: back.height };
  let active = false;
  let id = "house-music";
  let theme;
  let pointer = null;
  let arena = null;
  const arenas = new Map();
  let previousGamepad = new Set();
  const pans = new Map(Object.entries(panPositions ?? {}).filter(([id, offset]) =>
    Object.hasOwn(DETAIL_VIEWS, id) && DETAIL_VIEWS[id].pan && Number.isFinite(offset)));
  let panDirty = false;
  const panInputs = new Map();
  const panButtons = [{ x: 176, direction: -1, label: "←" }, { x: 252, direction: 1, label: "→" }];
  let panFrame = null;
  let panTime = 0;
  const showMedKit = () => DETAIL_VIEWS[id].kind === "inspection" && canViewMedKit();
  const panButtonX = button => button.x + (showMedKit() ? 182 : 0);

  function visibleHotspots() {
    return (DETAIL_VIEWS[id].hotspots ?? []).filter(hotspot => !kidMode ||
      (!hotspot.adultOnly && (!hotspot.detail || !DETAIL_VIEWS[hotspot.detail]?.adultOnly)));
  }

  function layout() {
    const view = DETAIL_VIEWS[id], record = images.get(view.image);
    if (!record?.ready) return null;
    const height = canvas.height - 80;
    // Fit the complete artwork; panning uses side margins rather than zooming in.
    const scale = Math.min(canvas.width / record.image.naturalWidth, height / record.image.naturalHeight);
    const width = record.image.naturalWidth * scale, imageHeight = record.image.naturalHeight * scale;
    const limit = Math.max(0, (width - canvas.width) / 2);
    let minPan = -limit, maxPan = limit;
    if (view.pan) for (const hotspot of visibleHotspots()) {
      const centered = (hotspot.x + hotspot.width / 2) * scale - width / 2;
      minPan = Math.min(minPan, centered);
      maxPan = Math.max(maxPan, centered);
    }
    const pan = Math.max(minPan, Math.min(maxPan, pans.get(id) ?? 0));
    return { scale, width, height: imageHeight, x: (canvas.width - width) / 2 - pan, y: (height - imageHeight) / 2, pan, minPan, maxPan };
  }
  function focusedHotspot() {
    const geometry = layout();
    if (!geometry) return null;
    let closest = null, distance = canvas.width / 6;
    for (const hotspot of visibleHotspots()) {
      const delta = Math.abs(geometry.x + (hotspot.x + hotspot.width / 2) * geometry.scale - canvas.width / 2);
      if (delta <= distance) { closest = hotspot; distance = delta; }
    }
    return closest;
  }
  function activateHotspot(hotspot) {
    if (hotspot?.detail) onOpenDetail(hotspot.detail);
    else if (hotspot?.sound) onSound(hotspot.sound);
  }
  function confirmView() {
    const view = DETAIL_VIEWS[id];
    if (view.pickupItem && !inventory[view.pickupItem]) {
      if (!view.image || images.get(view.image)?.ready) onPickup(view.pickupItem);
    } else onStepBack();
  }
  function clearPan() {
    panInputs.clear();
    if (panFrame !== null) cancelAnimationFrame(panFrame);
    panFrame = null;
    savePans();
  }
  function savePans() {
    if (!panDirty) return;
    panDirty = false;
    onPanChange(Object.fromEntries(pans));
  }
  function setPan(offset) {
    if (offset === (pans.get(id) ?? 0)) return;
    pans.set(id, offset);
    panDirty = true;
  }
  function panDirection() {
    const directions = new Set(panInputs.values());
    return (directions.has(1) ? 1 : 0) - (directions.has(-1) ? 1 : 0);
  }
  function setPanInput(source, direction) {
    if (direction) panInputs.set(source, direction);
    else panInputs.delete(source);
    if (!panDirection()) {
      if (panFrame !== null) cancelAnimationFrame(panFrame);
      panFrame = null;
      savePans();
    } else if (panFrame === null) {
      panTime = Date.now();
      panFrame = requestAnimationFrame(animatePan);
    }
  }
  function animatePan() {
    panFrame = null;
    if (!active || !DETAIL_VIEWS[id].pan || !panDirection()) return;
    const now = Date.now(), dt = Math.min(0.05, Math.max(0, (now - panTime) / 1000));
    panTime = now;
    const geometry = layout();
    if (geometry) setPan(Math.max(geometry.minPan, Math.min(geometry.maxPan, geometry.pan + panDirection() * 300 * dt)));
    draw();
    panFrame = requestAnimationFrame(animatePan);
  }

  function draw() {
    if (!active) return;
    const view = DETAIL_VIEWS[id];
    const height = canvas.height - 80;
    context.fillStyle = "#e7e9ed";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const record = view.image && images.get(view.image);
    if (record?.ready) {
      const geometry = layout();
      const { scale } = geometry;
      context.save(); context.beginPath(); context.rect(0, 0, canvas.width, height); context.clip();
      context.drawImage(record.image, geometry.x, geometry.y, geometry.width, geometry.height);
      const focused = focusedHotspot();
      // Only actual interactions get a marker; decorative artwork stays unmarked.
      for (const hotspot of visibleHotspots()) {
        drawHotspotMarker(context, geometry.x + (hotspot.x + hotspot.width / 2) * scale,
          geometry.y + (hotspot.y + hotspot.height / 2) * scale, hotspot === focused);
      }
      context.restore();
    } else if (view.kind === "pickup") {
      context.fillStyle = "#27272a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 28px Arial, sans-serif";
      context.fillText(view.title, canvas.width / 2, 120);
      // A plaster-style bandage with adhesive wings, a padded center, and air holes.
      context.fillStyle = "#b88759";
      context.fillRect(310, 222, 280, 64);
      context.fillRect(322, 210, 256, 88);
      context.fillStyle = "#e7bd88";
      context.fillRect(314, 226, 272, 56);
      context.fillRect(326, 214, 248, 80);
      context.fillStyle = "#f6dfb9";
      context.fillRect(410, 218, 80, 72);
      context.fillStyle = "#e5c99f";
      for (let y = 226; y < 286; y += 12) context.fillRect(418, y, 64, 3);
      context.fillStyle = "#b88759";
      for (const x of [336, 360, 384, 512, 536, 560]) {
        for (const y of [230, 252, 274]) context.fillRect(x, y, 4, 4);
      }
      context.fillStyle = "#27272a";
      context.font = "20px Arial, sans-serif";
      context.fillText("Bring the bandage back to Griffin!", canvas.width / 2, 375);
    } else {
      context.fillStyle = "#27272a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 28px Arial, sans-serif";
      context.fillText(view.title, canvas.width / 2, 140);
      context.font = "18px Arial, sans-serif";
      context.fillText(record?.error ? "Unable to load puzzle image." : view.image ? "Loading puzzle image…" : view.kind === "inspection" ? "Artwork coming soon." : "Puzzle placeholder", canvas.width / 2, 184);
    }
    context.fillStyle = "#1d2b35";
    context.fillRect(0, height, canvas.width, 80);
    context.fillStyle = "#06b6d4";
    context.fillRect(back.x, back.y, back.width, back.height);
    context.fillStyle = "#101820";
    context.font = "bold 18px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const canPickUp = view.pickupItem && !inventory[view.pickupItem];
    context.fillText(canPickUp ? "Take Med Kit" : view.kind === "pickup" ? "Continue" : "Step Back", back.x + back.width / 2, back.y + back.height / 2);
    if (showMedKit()) {
      context.fillStyle = "#06b6d4";
      context.fillRect(medKitButton.x, medKitButton.y, medKitButton.width, medKitButton.height);
      context.fillStyle = "#101820";
      context.fillText("View Med Kit", medKitButton.x + medKitButton.width / 2, medKitButton.y + medKitButton.height / 2);
    }
    const textLeft = showMedKit() ? view.pan ? 520 : 356 : view.pan ? 336 : 174;
    const textWidth = canvas.width - textLeft - 12, textCenter = textLeft + textWidth / 2;
    if (view.caption) {
      context.fillStyle = "#ffffff"; context.font = "20px Arial, sans-serif";
      context.fillText(view.caption, textCenter, height + 40, textWidth);
    }
    if (canPickUp) {
      context.fillStyle = "#ffffff"; context.font = "16px Arial, sans-serif";
      context.fillText("Action / Jump: Take Med Kit · Esc: Step Back", textCenter, height + 40, textWidth);
    }
    if (visibleHotspots().length) {
      if (view.pan) for (const button of panButtons) {
        context.fillStyle = "#06b6d4"; context.fillRect(panButtonX(button), back.y, 64, back.height);
        context.fillStyle = "#101820"; context.fillText(button.label, panButtonX(button) + 32, back.y + back.height / 2);
      }
      context.fillStyle = "#ffffff"; context.font = "16px Arial, sans-serif";
      const focused = focusedHotspot();
      context.fillText(focused ? `${focused.label ?? "Inspect"} · Action / Space` : "Center a hotspot to inspect", textCenter, height + 27, textWidth);
      context.fillText("Jump / Esc: Step Back", textCenter, height + 55, textWidth);
    }
    canvas.setAttribute("aria-label", view.kind === "pickup" ?
      "You found a bandage! Bring it back to Griffin. Click Continue, press Enter, Space, W or Up, or use controller Action or Jump." :
      `${view.title}. ${canPickUp ? "Click Take Med Kit, press Space, Enter, W or Up, or use controller Action or Jump to collect it. Escape returns." : visibleHotspots().length ? "Left/right pans where available. Action or Space activates the centered hotspot. Jump or Escape returns." : "Click or tap Step Back, or press Escape, to return."}`);
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left - canvas.clientLeft) * canvas.width / canvas.clientWidth,
      y: (event.clientY - rect.top - canvas.clientTop) * canvas.height / canvas.clientHeight };
  }
  const onBack = p => p.x >= back.x && p.x < back.x + back.width && p.y >= back.y && p.y < back.y + back.height;
  const onMedKit = p => showMedKit() && p.x >= medKitButton.x && p.x < medKitButton.x + medKitButton.width &&
    p.y >= medKitButton.y && p.y < medKitButton.y + medKitButton.height;
  function detailHotspotAt(p) {
    const view = DETAIL_VIEWS[id], geometry = layout();
    if (!geometry || !view.hotspots || p.y >= canvas.height - 80 || p.y < 0) return null;
    // Hotspots use the source artwork's pixels, matching its contained rendering.
    const x = (p.x - geometry.x) / geometry.scale;
    const y = (p.y - geometry.y) / geometry.scale;
    return visibleHotspots().find(h => x >= h.x && x < h.x + h.width && y >= h.y && y < h.y + h.height) ?? null;
  }
  canvas.addEventListener("pointerdown", event => {
    if (!active || event.button !== 0 || pointer) return;
    const p = point(event);
    const panButton = DETAIL_VIEWS[id].pan && p.y >= back.y && p.y < back.y + back.height &&
      panButtons.find(button => p.x >= panButtonX(button) && p.x < panButtonX(button) + 64);
    if (panButton) {
      event.preventDefault(); canvas.setPointerCapture(event.pointerId);
      setPanInput(`pointer-${event.pointerId}`, panButton.direction);
      return;
    }
    const hotspot = detailHotspotAt(p);
    if (!onBack(p) && !onMedKit(p) && !hotspot && !(DETAIL_VIEWS[id].pan && p.y < canvas.height - 80)) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    pointer = { id: event.pointerId, ...p, dragged: false, hotspot, medKit: onMedKit(p), pan: layout()?.pan ?? 0 };
  });
  canvas.addEventListener("pointermove", event => {
    if (pointer?.id !== event.pointerId) return;
    const p = point(event);
    if (Math.hypot(p.x - pointer.x, p.y - pointer.y) > 6) pointer.dragged = true;
    if (pointer.dragged && DETAIL_VIEWS[id].pan && pointer.y < canvas.height - 80) {
      const geometry = layout();
      if (geometry) {
        setPan(Math.max(geometry.minPan, Math.min(geometry.maxPan, pointer.pan + pointer.x - p.x)));
        draw();
      }
    }
  });
  canvas.addEventListener("pointerup", event => {
    setPanInput(`pointer-${event.pointerId}`, 0);
    if (!active || pointer?.id !== event.pointerId) return;
    const start = pointer;
    pointer = null;
    const p = point(event);
    if (!start.dragged && Math.hypot(p.x - start.x, p.y - start.y) <= 6) {
      if (start.medKit && onMedKit(p)) onViewMedKit();
      else if (start.hotspot && detailHotspotAt(p) === start.hotspot) {
        activateHotspot(start.hotspot);
      }
      else if (!start.hotspot && onBack(p)) confirmView();
    }
  });
  for (const event of ["pointercancel", "lostpointercapture"]) canvas.addEventListener(event, e => { pointer = null; setPanInput(`pointer-${e.pointerId}`, 0); });
  window.addEventListener("blur", () => { pointer = null; clearPan(); });
  document.addEventListener("visibilitychange", () => { pointer = null; clearPan(); });
  window.addEventListener("pagehide", clearPan);
  window.addEventListener("keydown", event => {
    if (!active || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.(DETAIL_VIEWS[id].kind === "pickup" ? "input, textarea, select, [contenteditable]" : "input, textarea, select, button, [contenteditable]")) return;
    const view = DETAIL_VIEWS[id];
    if (view.pan && ["ArrowLeft", "KeyA", "ArrowRight", "KeyD"].includes(event.code)) {
      event.preventDefault(); setPanInput(event.code, ["ArrowLeft", "KeyA"].includes(event.code) ? -1 : 1); return;
    }
    if (visibleHotspots().length && ["Space", "Enter", "ArrowUp", "KeyW", "Escape"].includes(event.code)) {
      event.preventDefault();
      if (!event.repeat) {
        if (["Space", "Enter"].includes(event.code)) activateHotspot(focusedHotspot());
        else onStepBack();
      }
      return;
    }
    const kind = DETAIL_VIEWS[id].kind;
    const confirm = ["Enter", "Space", "ArrowUp", "KeyW"].includes(event.code);
    const key = kind === "pickup" ? confirm : event.code === "Escape" || (kind === "inspection" && confirm);
    if (!active || event.defaultPrevented || !key || event.repeat || event.target.closest?.(DETAIL_VIEWS[id].kind === "pickup" ?
      "input, textarea, select, [contenteditable]" : "input, textarea, select, button, [contenteditable]")) return;
    event.preventDefault();
    if (event.code === "Escape") onStepBack();
    else confirmView();
  });
  window.addEventListener("keyup", event => setPanInput(event.code, 0));

  return {
    refresh: draw,
    setGamepadInput(state = {}) {
      const controls = new Set(state.controls ?? []);
      const pressed = [...controls].some(control => ["action", "jump"].includes(control) && !previousGamepad.has(control));
      const actionPressed = controls.has("action") && !previousGamepad.has("action");
      const backPressed = controls.has("jump") && !previousGamepad.has("jump");
      previousGamepad = controls;
      arena?.setGamepadInput(state);
      if (active && !state.suspended && visibleHotspots().length) {
        if (DETAIL_VIEWS[id].pan) {
          setPanInput("gamepad-left", controls.has("left") ? -1 : 0);
          setPanInput("gamepad-right", controls.has("right") ? 1 : 0);
        }
        if (backPressed) onStepBack();
        else if (actionPressed) activateHotspot(focusedHotspot());
        return;
      }
      setPanInput("gamepad-left", 0); setPanInput("gamepad-right", 0);
      if (active && !state.suspended && ["pickup", "inspection"].includes(DETAIL_VIEWS[id].kind) && pressed) confirmView();
    },
    start(nextId, nextTheme) {
      if (!Object.hasOwn(DETAIL_VIEWS, nextId) || (kidMode && DETAIL_VIEWS[nextId].adultOnly)) return false;
      clearPan();
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
    stop() { active = false; pointer = null; clearPan(); arena?.stop(); },
  };
}
