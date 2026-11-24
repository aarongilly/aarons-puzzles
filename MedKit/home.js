// Hotspots use original-image pixels: x/y are the top-left corner, before scaling.
// These are deliberately visible placeholder targets. Move/resize them here.
const HOME_PANORAMAS = {
  "h-entry": {
    src: "assets/h-entry.webp", label: "Entry", width: 1632, height: 520,
    hotspots: [
      { id: "entry-kitchen", label: "Kitchen", target: "h-kitchen", x: 735, y: 230, width: 60, height: 90 },
      { id: "entry-outside", label: "Leave house", action: "leave-house", x: 210, y: 110, width: 120, height: 280 },
      { id: "entry-stairs", label: "Stairs", target: "h-stairs", x: 915, y: 250, width: 60, height: 60 },
      { id: "entry-living", label: "Living room", target: "h-living", x: 1150, y: 250, width: 100, height: 80 },
      { id: "entry-music", label: "Music room", action: "detail", detail: "house-music", x: 550, y: 140, width: 130, height: 160 },
      { id: "entry-pics", label: "Pictures", adultOnly: true, action: "detail", detail: "house-pics", x: 0, y: 140, width: 150, height: 120 },
      { id: "entry-tv", label: "TV", action: "detail", detail: "house-tv", x: 1320, y: 70, width: 70, height: 80 },
      // { id: "entry-puzzle", adultOnly: true, label: "Inspect puzzle", action: "detail", detail: "house-puzzle", x: 450, y: 180, width: 120, height: 100 },
    ],
  },
  "h-kitchen": {
    src: "assets/h-kitchen.webp", label: "Kitchen", width: 2224, height: 520,
    hotspots: [
      { id: "kitchen-stairs", label: "Stairs", target: "h-stairs", x: 1500, y: 300, width: 120, height: 70 },
      { id: "kitchen-entry", label: "Entry", target: "h-entry", x: 1860, y: 220, width: 100, height: 80 },
      { id: "kitchen-table", label: "Table", action: "detail", detail: "house-table", x: 1100, y: 210, width: 100, height: 60 },
      { id: "kitchen-bathroom", label: "Bathroom", action: "detail", detail: "house-bathroom", x: 2015, y: 10, width: 70, height: 420 },
      { id: "kitchen-garage", label: "Garage", action: "detail", detail: "house-garage", x: 95, y: 80, width: 190, height: 420 },
      { id: "kitchen-pantry", label: "Pantry", action: "detail", detail: "house-pantry", x: 1640, y: 35, width: 180, height: 360 },
      { id: "kitchen-water", label: "Water", action: "detail", detail: "house-water", x: 500, y: 285, width: 60, height: 100 },
      { id: "kitchen-alexa", label: "Alexa", adultOnly: true, action: "detail", detail: "house-alexa", x: 840, y: 225, width: 60, height: 50 },
      { id: "kitchen-deck", label: "Deck", action: "detail", detail: "house-deck", x: 1270, y: 125, width: 60, height: 150 },
    ],
  },
  "h-stairs": {
    src: "assets/h-stairs.webp", label: "Stairs", width: 1411, height: 520,
    hotspots: [
      { id: "stairs-living", label: "Living room", target: "h-living", x: 665, y: 170, width: 100, height: 60 },
      { id: "stairs-down", label: "Downstairs", target: "h-down", x: 380, y: 310, width: 100, height: 80 },
      { id: "stairs-kitchen", label: "Kitchen", target: "h-kitchen", x: 1000, y: 220, width: 100, height: 60 },
      { id: "stairs-pantry", label: "Pantry", action: "detail", detail: "house-pantry", x: 890, y: 30, width: 70, height: 360 },
      { id: "stairs-painting", label: "Painting", adultOnly: true, action: "detail", detail: "house-painting", x: 775, y: 100, width: 100, height: 80 },
      { id: "stairs-table", label: "Table", action: "detail", detail: "house-table", x: 95, y: 200, width: 100, height: 80 },
      { id: "stairs-up", label: "Upstairs", target: "h-up", x: 480, y: 70, width: 100, height: 80 },
      { id: "stairs-alexa", label: "Alexa", adultOnly: true, action: "detail", detail: "house-alexa", x: 1320, y: 160, width: 60, height: 40 },
      { id: "stairs-deck", label: "Deck", action: "detail", detail: "house-deck", x: 290, y: 125, width: 60, height: 150 },
    ]
  },
  "h-living": {
    src: "assets/h-living.webp", label: "Living room", width: 1392, height: 530,
    hotspots: [
      { id: "living-stairs", label: "Stairs", target: "h-stairs", x: 1170, y: 210, width: 100, height: 60 },
      { id: "living-entry", label: "Entry", target: "h-entry", x: 860, y: 230, width: 100, height: 60 },
      { id: "living-tv", label: "TV", action: "detail", detail: "house-tv", x: 520, y: 80, width: 100, height: 80 },
      { id: "living-dad", label: "Dad", action: "sound", sound: "wheres-dad", x: 1440, y: 290, width: 270, height: 130 },
    ],
  },
  "h-down": {
    src: "assets/h-down.webp", label: "Downstairs", width: 707, height: 530, wrap: false,
    hotspots: [
      { id: "down-stairs", label: "Stairs", target: "h-stairs", x: 335, y: 60, width: 100, height: 90 },
      { id: "down-basement", label: "Basement", target: "h-basement", x: 185, y: 360, width: 100, height: 90 },
    ],
  },
  "h-up": {
    src: "assets/h-up.webp", label: "Upstairs", width: 900, height: 520, wrap: false, centerHotspots: true,
    hotspots: [
      { id: "up-stairs", label: "Stairs", target: "h-stairs", x: 315, y: 350, width: 80, height: 90 },
      { id: "up-hallway", label: "Hallway", target: "h-hallway", x: 480, y: 40, width: 70, height: 120 },
    ],
  },
  "h-hallway": {
    src: "assets/h-hallway.webp", label: "Hallway", width: 1483, height: 520,
    hotspots: [
      { id: "hallway-master", label: "Master bedroom", target: "h-master", x: 155, y: 170, width: 105, height: 220 },
      { id: "hallway-office", label: "Office", action: "detail", detail: "hallway-office", x: 515, y: 185, width: 55, height: 135 },
      { id: "hallway-guest", label: "Guest room", action: "detail", detail: "hallway-guest", x: 700, y: 75, width: 155, height: 420 },
      { id: "hallway-bathroom", label: "Bathroom", action: "sound", sound: "bathroom-dad-thereafter", firstSound: "bathroom-dad-once", x: 925, y: 65, width: 80, height: 430 },
      { id: "hallway-kids", label: "Kids room", action: "detail", detail: "hallway-kids", x: 1075, y: 85, width: 70, height: 330 },
      { id: "hallway-stairs", label: "Stairs", target: "h-up", x: 1190, y: 250, width: 75, height: 90 },
    ],
  },
  "h-master": {
    src: "assets/h-master.webp", label: "Master bedroom", width: 2308, height: 520,
    hotspots: [
      { id: "master-hallway", label: "Hallway", target: "h-hallway", x: 2000, y: 155, width: 110, height: 300 },
      { id: "master-bath", label: "Bathroom", action: "detail", detail: "master-bath", x: 240, y: 160, width: 85, height: 230 },
      { id: "master-picture", label: "Picture", action: "detail", adultOnly: true, detail: "master-picture", x: 575, y: 150, width: 80, height: 70 },
      { id: "master-books", label: "Books", action: "detail", detail: "master-books", x: 1335, y: 150, width: 120, height: 230 },
    ],
  },
  "h-basement": {
    src: "assets/h-basement.webp", label: "Basement", width: 2152, height: 520,
    hotspots: [
      { id: "basement-stairs", label: "Up the stairs", target: "h-down", x: 1760, y: 255, width: 110, height: 140 },
      { id: "basement-door", label: "Storage door", action: "detail", detail: "basement-spooky", x: 25, y: 155, width: 130, height: 350 },
      { id: "basement-one", label: "Bookcase One", adultOnly: true, action: "detail", detail: "basement-case1", x: 245, y: 170, width: 130, height: 150 },
      { id: "basement-two", label: "Bookcase Two", adultOnly: true, action: "detail", detail: "basement-case2", x: 380, y: 170, width: 130, height: 150 },
      { id: "basement-three", label: "Bookcase Three", adultOnly: true, action: "detail", detail: "basement-case3", x: 515, y: 170, width: 100, height: 150 },
      { id: "basement-four", label: "Bookcase Four", adultOnly: true, action: "detail", detail: "basement-case4", x: 618, y: 170, width: 77, height: 150 },
      { id: "basement-five", label: "Bookcase Five", adultOnly: true, action: "detail", detail: "basement-case5", x: 700, y: 170, width: 60, height: 150 },
      { id: "basement-tv", label: "Basement TV", action: "detail", detail: "basement-tv", x: 1280, y: 175, width: 130, height: 80 },
    ],
  },
};
const HOME_HUD_HEIGHT = 80;
const HOME_PAN_SPEED = 300; // Canvas pixels per second.

function wrapHomeOffset(offset, width) {
  return ((offset % width) + width) % width;
}

function constrainHomeOffset(pano, offset, viewWidth) {
  if (pano.wrap !== false) return wrapHomeOffset(offset, pano.width);
  const spare = pano.width - viewWidth;
  let left = Math.min(0, spare), right = Math.max(0, spare);
  if (pano.centerHotspots) {
    // Allow side margins when needed to center targets in a single-frame room.
    for (const hotspot of pano.hotspots) {
      const centered = hotspot.x + hotspot.width / 2 - viewWidth / 2;
      left = Math.min(left, centered);
      right = Math.max(right, centered);
    }
  }
  // A narrow image can shift between left/right alignment without clipping or repetition.
  return Math.max(left, Math.min(right, offset));
}

function restoreHomeState(saved, viewportWidth = 900, viewportHeight = 600) {
  const offsets = {};
  for (const [id, offset] of Object.entries(saved?.offsets ?? {})) {
    if (!Object.hasOwn(HOME_PANORAMAS, id) || !Number.isFinite(offset)) continue;
    const scene = HOME_PANORAMAS[id];
    offsets[id] = constrainHomeOffset(scene, offset, viewportWidth * scene.height / (viewportHeight - HOME_HUD_HEIGHT));
  }
  const pano = typeof saved?.pano === "string" && Object.hasOwn(HOME_PANORAMAS, saved.pano)
    ? saved.pano : "h-entry";
  const scene = HOME_PANORAMAS[pano];
  const viewWidth = viewportWidth * scene.height / (viewportHeight - HOME_HUD_HEIGHT);
  const offset = Number.isFinite(saved?.offset) ? saved.offset : offsets[pano] ?? (scene.wrap === false ? (scene.width - viewWidth) / 2 : 0);
  offsets[pano] = constrainHomeOffset(scene, offset, viewWidth);
  return { pano, offset: offsets[pano], offsets };
}

function getHomeHotspotAt(pano, offset, x, y, inventory = {}, kidMode = false) {
  const imageX = pano.wrap === false ? offset + x : wrapHomeOffset(offset + x, pano.width);
  return pano.hotspots.find(hotspot =>
    (!kidMode || !hotspot.adultOnly) && (kidMode || !hotspot.kidOnly) && (!hotspot.item || inventory[hotspot.item] !== true) &&
    (pano.wrap === false ? imageX >= hotspot.x && imageX < hotspot.x + hotspot.width :
      wrapHomeOffset(imageX - hotspot.x, pano.width) < hotspot.width) &&
    y >= hotspot.y && y < hotspot.y + hotspot.height);
}

function getHomeCopies(x, width, offset, viewportWidth, itemWidth, wrap = true) {
  if (!wrap) return x - offset < viewportWidth && x - offset + itemWidth > 0 ? [x - offset] : [];
  const positions = [];
  let left = wrapHomeOffset(x - offset, width) - width;
  for (; left < viewportWidth; left += width) {
    if (left + itemWidth > 0) positions.push(left);
  }
  return positions;
}

function getHomeFocusedHotspot(pano, offset, viewWidth, inventory = {}, kidMode = false) {
  let closest;
  let distance = viewWidth / 6;
  for (const hotspot of pano.hotspots) {
    if ((kidMode && hotspot.adultOnly) || (!kidMode && hotspot.kidOnly) || (hotspot.item && inventory[hotspot.item])) continue;
    for (const x of getHomeCopies(hotspot.x, pano.width, offset, viewWidth, hotspot.width, pano.wrap !== false)) {
      const delta = Math.abs(x + hotspot.width / 2 - viewWidth / 2);
      if (delta <= distance) { closest = hotspot; distance = delta; }
    }
  }
  return closest;
}

function createHome(canvas, {
  state: savedState, inventory = {}, kidMode = false, onPickup = () => {},
  onStateChange = () => {}, onLeaveHome = () => {}, onOpenDetail = () => {}, onSound = () => {},
  canViewMedKit = () => false, onViewMedKit = () => {},
} = {}) {
  const context = canvas.getContext("2d");
  const state = restoreHomeState(savedState, canvas.width, canvas.height);
  const images = new Map();
  let active = false;
  let gesture = null;
  let previousControls = new Set();
  let needsNeutral = true;
  const panInputs = new Map();
  const panPointers = new Set();
  let panFrame = null;
  let panTime = null;
  let panDirty = false;
  const panKeyDirections = { ArrowLeft: -1, KeyA: -1, ArrowRight: 1, KeyD: 1 };

  function panDirection() {
    const directions = new Set(panInputs.values());
    return (directions.has(1) ? 1 : 0) - (directions.has(-1) ? 1 : 0);
  }
  function updatePan() {
    if (!panDirection()) {
      if (panFrame !== null) cancelAnimationFrame(panFrame);
      panFrame = null;
      panTime = null;
      if (panDirty) { panDirty = false; save(); }
    } else if (panFrame === null) {
      panTime = Date.now();
      panFrame = requestAnimationFrame(animatePan);
    }
  }
  function setPanInput(source, direction) {
    if (direction) panInputs.set(source, direction);
    else panInputs.delete(source);
    updatePan();
  }
  function clearPan() { panInputs.clear(); panPointers.clear(); updatePan(); }
  function animatePan() {
    panFrame = null;
    if (!active || !panDirection()) return;
    const now = Date.now();
    const dt = Math.min(0.05, Math.max(0, (now - panTime) / 1000));
    panTime = now;
    const offset = constrainHomeOffset(HOME_PANORAMAS[state.pano],
      state.offset + panDirection() * HOME_PAN_SPEED * dt / scale(), canvas.width / scale());
    panDirty ||= offset !== state.offset;
    state.offset = offset;
    draw();
    panFrame = requestAnimationFrame(animatePan);
  }

  function clearControls() { clearPan(); needsNeutral = true; previousControls.clear(); }
  function focusedHotspot() {
    return getHomeFocusedHotspot(HOME_PANORAMAS[state.pano], state.offset, canvas.width / scale(), inventory, kidMode);
  }
  function activate(hotspot) {
    if (!active || !hotspot || loadImage().status !== "ready") return;
    cancelGesture();
    clearControls();
    if (hotspot.action === "leave-house") { save(); onLeaveHome(); }
    else if (hotspot.action === "pickup") { onPickup(hotspot.item); draw(); }
    else if (hotspot.action === "detail") { save(); onOpenDetail(hotspot.detail); }
    else if (hotspot.action === "sound") { save(); onSound(hotspot.sound, hotspot.firstSound); }
    else if (Object.hasOwn(HOME_PANORAMAS, hotspot.target)) navigate(hotspot.target);
    else { save(); onOpenDetail(hotspot.target); }
  }

  function save() {
    state.offsets[state.pano] = state.offset;
    onStateChange({ ...state, offsets: { ...state.offsets } });
  }
  function scale() { return (canvas.height - HOME_HUD_HEIGHT) / HOME_PANORAMAS[state.pano].height; }

  function loadImage(id = state.pano) {
    if (images.has(id)) return images.get(id);
    const image = new Image();
    image.decoding = "async";
    const record = { image, status: "loading" };
    images.set(id, record);
    const ready = () => {
      record.status = "ready";
      if (active && state.pano === id) draw();
    };
    image.addEventListener("load", () => {
      // Decode off the rendering path too, so the first room draw stays quick.
      if (typeof image.decode === "function") image.decode().then(ready, ready);
      else ready();
    });
    image.addEventListener("error", () => {
      record.status = "error";
      if (active && state.pano === id) draw();
    });
    image.src = HOME_PANORAMAS[id].src;
    return record;
  }

  function navigate(pano) {
    if (!Object.hasOwn(HOME_PANORAMAS, pano)) return;
    clearControls();
    state.offsets[state.pano] = state.offset;
    state.pano = pano;
    state.offset = restoreHomeState({ pano, offsets: state.offsets }, canvas.width, canvas.height).offset;
    gesture = null;
    clearControls();
    canvas.style.cursor = "grab";
    save();
    draw();
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - canvas.clientLeft) * canvas.width / canvas.clientWidth,
      y: (event.clientY - rect.top - canvas.clientTop) * canvas.height / canvas.clientHeight,
    };
  }

  function hotspotAt(position) {
    if (position.y < 0 || position.y >= canvas.height - HOME_HUD_HEIGHT || position.x < 0 || position.x >= canvas.width) return;
    return getHomeHotspotAt(HOME_PANORAMAS[state.pano], state.offset, position.x / scale(), position.y / scale(), inventory, kidMode);
  }

  function panButtonAt(position) {
    if (position.y < canvas.height - HOME_HUD_HEIGHT + 12 || position.y >= canvas.height - 12) return 0;
    if (position.x >= 12 && position.x < 76) return -1;
    if (position.x >= 88 && position.x < 152) return 1;
    return 0;
  }

  function cancelGesture() {
    if (gesture?.dragged) save();
    gesture = null;
    if (active) canvas.style.cursor = "grab";
  }

  canvas.addEventListener("pointerdown", event => {
    if (!active || gesture || event.button !== 0) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    const position = point(event);
    if (!kidMode && canViewMedKit() && position.x >= 168 && position.x < 338 &&
        position.y >= canvas.height - 68 && position.y < canvas.height - 12) {
      cancelGesture(); clearControls(); onViewMedKit(); return;
    }
    const direction = panButtonAt(position);
    if (direction) {
      canvas.setPointerCapture(event.pointerId);
      panPointers.add(event.pointerId);
      setPanInput(`pointer-${event.pointerId}`, direction);
      return;
    }
    if (position.y < 0 || position.y >= canvas.height - HOME_HUD_HEIGHT || loadImage().status !== "ready") return;
    clearPan();
    canvas.setPointerCapture(event.pointerId);
    gesture = { id: event.pointerId, start: position, offset: state.offset, dragged: false, hotspot: hotspotAt(position) };
  });

  canvas.addEventListener("pointermove", event => {
    if (!active) return;
    const position = point(event);
    if (panPointers.has(event.pointerId)) {
      event.preventDefault();
      setPanInput(`pointer-${event.pointerId}`, panButtonAt(position));
      return;
    }
    if (!gesture) {
      canvas.style.cursor = hotspotAt(position) || panButtonAt(position) ? "pointer" : "grab";
      return;
    }
    if (gesture.id !== event.pointerId) return;
    event.preventDefault();
    if (Math.hypot(position.x - gesture.start.x, position.y - gesture.start.y) > 6) gesture.dragged = true;
    if (gesture.dragged) {
      state.offset = constrainHomeOffset(HOME_PANORAMAS[state.pano], gesture.offset - (position.x - gesture.start.x) / scale(), canvas.width / scale());
      canvas.style.cursor = "grabbing";
      draw();
    }
  });

  function releasePanPointer(event) {
    if (!panPointers.delete(event.pointerId)) return false;
    setPanInput(`pointer-${event.pointerId}`, 0);
    return true;
  }
  canvas.addEventListener("pointerup", event => {
    if (releasePanPointer(event)) return;
    if (!active || gesture?.id !== event.pointerId) return;
    const ended = gesture;
    gesture = null;
    const position = point(event);
    // A drag ending on a target must never act like a click.
    const moved = Math.hypot(position.x - ended.start.x, position.y - ended.start.y) > 6;
    if (!ended.dragged && !moved && ended.hotspot && ended.hotspot === hotspotAt(position)) {
      activate(ended.hotspot);
    }
    else if (ended.dragged) save();
    if (active) canvas.style.cursor = "grab";
  });
  for (const type of ["pointercancel", "lostpointercapture"]) {
    canvas.addEventListener(type, event => { releasePanPointer(event); if (gesture?.id === event.pointerId) cancelGesture(); });
  }
  window.addEventListener("blur", () => { cancelGesture(); clearControls(); });
  document.addEventListener("visibilitychange", () => { cancelGesture(); clearControls(); });
  window.addEventListener("pagehide", () => {
    if (!active) return;
    cancelGesture(); clearControls(); save();
  });
  window.addEventListener("keydown", event => {
    if (!active || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    if (Object.hasOwn(panKeyDirections, event.code)) {
      event.preventDefault();
      if (event.repeat || panInputs.has(event.code)) return;
      cancelGesture();
      setPanInput(event.code, panKeyDirections[event.code]);
    } else if (["Space", "Enter", "ArrowUp", "KeyW"].includes(event.code)) {
      event.preventDefault();
      if (!event.repeat) activate(focusedHotspot());
    }
  });

  window.addEventListener("keyup", event => {
    if (!Object.hasOwn(panKeyDirections, event.code)) return;
    if (active) event.preventDefault();
    setPanInput(event.code, 0);
  });

  function draw() {
    if (!active) return;
    const pano = HOME_PANORAMAS[state.pano];
    const image = loadImage();
    const imageScale = scale();
    const viewHeight = canvas.height - HOME_HUD_HEIGHT;
    const viewWidth = canvas.width / imageScale;
    context.fillStyle = "#f4f4f5";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.beginPath();
    context.rect(0, 0, canvas.width, viewHeight);
    context.clip();
    if (image.status === "ready") {
      for (const x of getHomeCopies(0, pano.width, state.offset, viewWidth, pano.width, pano.wrap !== false)) {
        context.drawImage(image.image, x * imageScale, 0, pano.width * imageScale, viewHeight);
      }
      context.font = "bold 16px Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      const focused = focusedHotspot();
      pano.hotspots.forEach(hotspot => {
        if ((kidMode && hotspot.adultOnly) || (!kidMode && hotspot.kidOnly) || (hotspot.item && inventory[hotspot.item] === true)) return;
        for (const x of getHomeCopies(hotspot.x, pano.width, state.offset, viewWidth, hotspot.width, pano.wrap !== false)) {
          drawHotspotMarker(context, (x + hotspot.width / 2) * imageScale,
            (hotspot.y + hotspot.height / 2) * imageScale, hotspot === focused);
        }
      });
    } else {
      context.fillStyle = "#27272a";
      context.font = "22px Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(image.status === "error" ? `Unable to load ${pano.label}.` : `Loading ${pano.label}…`, canvas.width / 2, viewHeight / 2);
    }
    context.restore();
    context.fillStyle = "#1d2b35";
    context.fillRect(0, viewHeight, canvas.width, HOME_HUD_HEIGHT);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "24px Arial, sans-serif";
    for (const [x, label, direction] of [[12, "←", -1], [88, "→", 1]]) {
      const offset = state.offset;
      const blocked = pano.wrap === false && constrainHomeOffset(pano, offset + direction, viewWidth) === offset;
      context.fillStyle = blocked ? "#647078" : [...panInputs.values()].includes(direction) ? "#67e8f9" : "#06b6d4";
      context.fillRect(x, viewHeight + 12, 64, 56);
      context.fillStyle = "#101820";
      context.fillText(label, x + 32, viewHeight + 40);
    }
    if (!kidMode && canViewMedKit()) {
      context.fillStyle = "#06b6d4"; context.fillRect(168, viewHeight + 12, 170, 56);
      context.fillStyle = "#101820"; context.textAlign = "center"; context.font = "bold 17px Arial, sans-serif";
      context.fillText("View Med Kit", 253, viewHeight + 40);
    }
    context.fillStyle = "#fff";
    context.textAlign = "right";
    context.font = "14px Arial, sans-serif";
    context.fillText("Drag or hold ← / → to look", canvas.width - 16, viewHeight + 26, canvas.width - 376);
    const target = focusedHotspot();
    context.fillText(target ? `${target.label} · Action / Jump` : inventory.medKit ? "MedKit in inventory" : "Center a target · Action / Jump", canvas.width - 16, viewHeight + 52, canvas.width - 376);
    canvas.setAttribute("aria-label", `Home: ${pano.label}. Drag or hold Left/Right to look. Center a target and press Space, Enter, W/Up, or controller Action/Jump, or click a target.`);
  }

  return {
    setGamepadInput(input = {}) {
      const controls = new Set(input.controls ?? []);
      if (!active || input.suspended) { clearControls(); previousControls = controls; return; }
      if (needsNeutral) {
        if (!controls.size) needsNeutral = false;
        previousControls = controls;
        return;
      }
      const pressed = control => controls.has(control) && !previousControls.has(control);
      const activatePressed = pressed("action") || pressed("jump");
      previousControls = controls;
      if (controls.has("left") || controls.has("right")) cancelGesture();
      if (controls.has("left")) panInputs.set("gamepad-left", -1);
      else panInputs.delete("gamepad-left");
      if (controls.has("right")) panInputs.set("gamepad-right", 1);
      else panInputs.delete("gamepad-right");
      updatePan();
      if (activatePressed) activate(focusedHotspot());
    },
    refresh: draw,
    preload() { Object.keys(HOME_PANORAMAS).forEach(id => loadImage(id)); },
    start() { active = true; clearControls(); canvas.style.cursor = "grab"; draw(); },
    stop() { cancelGesture(); clearControls(); active = false; canvas.style.cursor = ""; },
  };
}
