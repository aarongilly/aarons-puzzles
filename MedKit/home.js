// Hotspots use original-image pixels: x/y are the top-left corner, before scaling.
// These are deliberately visible placeholder targets. Move/resize them here.
const HOME_PANORAMAS = {
  "h-entry": {
    src: "assets/h-entry.webp", label: "Entry", width: 1632, height: 520,
    hotspots: [
      { id: "entry-kitchen", label: "Kitchen", target: "h-kitchen", x: 735, y: 230, width: 60, height: 90 },
      { id: "entry-outside", label: "Leave house", action: "leave-house", x: 210, y: 110, width: 120, height: 280 },
      { id: "entry-stairs", label: "Stairs", target: "h-stairs", x: 915, y: 250, width: 60, height: 60 },
      { id: "entry-puzzle", label: "Inspect puzzle", action: "detail", detail: "house-puzzle", x: 450, y: 180, width: 120, height: 100 },
    ],
  },
  "h-kitchen": {
    src: "assets/h-kitchen.webp", label: "Kitchen", width: 2224, height: 520,
    hotspots: [
      { id: "kitchen-stairs", label: "Stairs", target: "h-stairs", x: 1500, y: 300, width: 120, height: 70 },
      { id: "kitchen-entry", label: "Entry", target: "h-entry", x: 1860, y: 220, width: 100, height: 80 },
    ],
  },
  "h-stairs": {
    src: "assets/h-stairs.webp", label: "Stairs", width: 1411, height: 520,
    hotspots: [
      { id: "stairs-kitchen", label: "Kitchen", target: "h-kitchen", x: 970, y: 240, width: 100, height: 60 },
      { id: "stairs-med-kit", label: "MedKit", action: "pickup", item: "medKit", x: 1200, y: 300, width: 100, height: 80 },
    ]
  },
};
const HOME_HUD_HEIGHT = 80;

function wrapHomeOffset(offset, width) {
  return ((offset % width) + width) % width;
}

function restoreHomeState(saved) {
  const pano = typeof saved?.pano === "string" && Object.hasOwn(HOME_PANORAMAS, saved.pano)
    ? saved.pano : "h-entry";
  return { pano, offset: Number.isFinite(saved?.offset) ? wrapHomeOffset(saved.offset, HOME_PANORAMAS[pano].width) : 0 };
}

function getHomeHotspotAt(pano, offset, x, y, inventory = {}) {
  const imageX = wrapHomeOffset(offset + x, pano.width);
  return pano.hotspots.find(hotspot =>
    (!hotspot.item || inventory[hotspot.item] !== true) &&
    wrapHomeOffset(imageX - hotspot.x, pano.width) < hotspot.width &&
    y >= hotspot.y && y < hotspot.y + hotspot.height);
}

function getHomeCopies(x, width, offset, viewportWidth, itemWidth) {
  const positions = [];
  let left = wrapHomeOffset(x - offset, width) - width;
  for (; left < viewportWidth; left += width) {
    if (left + itemWidth > 0) positions.push(left);
  }
  return positions;
}

function createHome(canvas, {
  state: savedState, inventory = {}, onPickup = () => {},
  onStateChange = () => {}, onLeaveHome = () => {}, onOpenDetail = () => {},
} = {}) {
  const context = canvas.getContext("2d");
  const state = restoreHomeState(savedState);
  const images = new Map();
  let active = false;
  let gesture = null;

  function save() { onStateChange({ ...state }); }
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
    state.pano = pano;
    state.offset = 0;
    gesture = null;
    canvas.style.cursor = "grab";
    save();
    draw();
  }

  function pan(distance) {
    state.offset = wrapHomeOffset(state.offset + distance, HOME_PANORAMAS[state.pano].width);
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
    return getHomeHotspotAt(HOME_PANORAMAS[state.pano], state.offset, position.x / scale(), position.y / scale(), inventory);
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
    const direction = panButtonAt(position);
    if (direction) {
      pan(direction * canvas.width / scale() / 3);
      return;
    }
    if (position.y < 0 || position.y >= canvas.height - HOME_HUD_HEIGHT || loadImage().status !== "ready") return;
    canvas.setPointerCapture(event.pointerId);
    gesture = { id: event.pointerId, start: position, offset: state.offset, dragged: false, hotspot: hotspotAt(position) };
  });

  canvas.addEventListener("pointermove", event => {
    if (!active) return;
    const position = point(event);
    if (!gesture) {
      canvas.style.cursor = hotspotAt(position) || panButtonAt(position) ? "pointer" : "grab";
      return;
    }
    if (gesture.id !== event.pointerId) return;
    event.preventDefault();
    if (Math.hypot(position.x - gesture.start.x, position.y - gesture.start.y) > 6) gesture.dragged = true;
    if (gesture.dragged) {
      state.offset = wrapHomeOffset(gesture.offset - (position.x - gesture.start.x) / scale(), HOME_PANORAMAS[state.pano].width);
      canvas.style.cursor = "grabbing";
      draw();
    }
  });

  canvas.addEventListener("pointerup", event => {
    if (!active || gesture?.id !== event.pointerId) return;
    const ended = gesture;
    gesture = null;
    const position = point(event);
    // A drag ending on a target must never act like a click.
    const moved = Math.hypot(position.x - ended.start.x, position.y - ended.start.y) > 6;
    if (!ended.dragged && !moved && ended.hotspot && ended.hotspot === hotspotAt(position)) {
      if (ended.hotspot.action === "leave-house") {
        save();
        onLeaveHome();
      } else if (ended.hotspot.action === "pickup") {
        onPickup(ended.hotspot.item);
        draw();
      } else if (ended.hotspot.action === "detail") {
        save();
        onOpenDetail(ended.hotspot.detail);
      } else navigate(ended.hotspot.target);
    }
    else if (ended.dragged) save();
    if (active) canvas.style.cursor = "grab";
  });
  for (const type of ["pointercancel", "lostpointercapture"]) {
    canvas.addEventListener(type, event => { if (gesture?.id === event.pointerId) cancelGesture(); });
  }
  window.addEventListener("blur", cancelGesture);
  document.addEventListener("visibilitychange", cancelGesture);
  window.addEventListener("keydown", event => {
    if (!active || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.("input, textarea, select, button, [contenteditable]")) return;
    if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(event.code)) {
      event.preventDefault();
      pan((event.code === "ArrowLeft" || event.code === "KeyA" ? -1 : 1) * canvas.width / scale() / 6);
    }
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
      for (const x of getHomeCopies(0, pano.width, state.offset, viewWidth, pano.width)) {
        context.drawImage(image.image, x * imageScale, 0, pano.width * imageScale, viewHeight);
      }
      context.font = "bold 16px Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      pano.hotspots.forEach(hotspot => {
        if (hotspot.item && inventory[hotspot.item] === true) return;
        for (const x of getHomeCopies(hotspot.x, pano.width, state.offset, viewWidth, hotspot.width)) {
          const left = x * imageScale, top = hotspot.y * imageScale;
          const width = hotspot.width * imageScale, height = hotspot.height * imageScale;
          context.fillStyle = "rgba(6, 182, 212, 0.25)";
          context.fillRect(left, top, width, height);
          context.strokeStyle = "#086b87";
          context.lineWidth = 2;
          context.strokeRect(left, top, width, height);
          context.fillStyle = "#101820";
          context.fillText(hotspot.label, left + width / 2, top + height / 2, width - 8);
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
    for (const [x, label] of [[12, "←"], [88, "→"]]) {
      context.fillStyle = "#06b6d4";
      context.fillRect(x, viewHeight + 12, 64, 56);
      context.fillStyle = "#101820";
      context.fillText(label, x + 32, viewHeight + 40);
    }
    context.fillStyle = "#fff";
    context.textAlign = "right";
    context.font = "14px Arial, sans-serif";
    context.fillText("Drag or ← / → to look", canvas.width - 16, viewHeight + 26);
    context.fillText(inventory.medKit ? "MedKit in inventory" : "Click or tap a target", canvas.width - 16, viewHeight + 52);
    canvas.setAttribute("aria-label", `Home: ${pano.label}. Drag or use Left/Right to look. Click or tap hotspots to navigate.`);
  }

  return {
    refresh: draw,
    preload() { Object.keys(HOME_PANORAMAS).forEach(id => loadImage(id)); },
    start() { active = true; canvas.style.cursor = "grab"; draw(); },
    stop() { cancelGesture(); active = false; canvas.style.cursor = ""; },
  };
}
