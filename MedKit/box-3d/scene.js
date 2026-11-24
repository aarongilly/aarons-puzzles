import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { BOX_DIMENSIONS, SITUATIONS, createBoxState, applyBoxAction, getHudButtons } from "./state.mjs";

export function createBoxView(canvas, hud, status, {
  state: savedState, onStateChange = () => {}, onExploreHouse = () => {}, onCollect = () => {},
} = {}) {
  const state = createBoxState(savedState);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(900, 520, false);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e7e9ed");
  const camera = new THREE.PerspectiveCamera(40, 900 / 520, 1, 2000);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.mouseButtons.RIGHT = null;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  controls.minDistance = 45;
  controls.maxDistance = 1100;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7c8394, 2.6));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(80, 160, 120); scene.add(light);
  const fill = new THREE.DirectionalLight(0xffffff, 1.4);
  fill.position.set(-100, 30, -100); scene.add(fill);
  const root = new THREE.Group(); scene.add(root);
  const red = new THREE.MeshStandardMaterial({ color: "#be2540", roughness: 0.75 });
  const dark = new THREE.MeshStandardMaterial({ color: "#333e48", roughness: 0.8 });
  const cream = new THREE.MeshStandardMaterial({ color: "#f1eee5", roughness: 0.8 });
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 });
  const edges = new THREE.LineBasicMaterial({ color: "#222c39", transparent: true, opacity: 0.22 });
  let visible = true, frameId = null, lastTime, pointerStart, focusedPart = null;
  const pointers = new Set();
  let message = state.lidOpen ? "Tap an object to inspect it. Use the five buttons on the medical assistant." : "Tap the lid to open the med kit.";
  const context = hud.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function box(parent, w, h, d, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edges));
    parent.add(mesh); return mesh;
  }
  function texture(w, h, paint = () => {}) {
    const image = document.createElement("canvas"); image.width = w; image.height = h;
    paint(image.getContext("2d"));
    const map = new THREE.CanvasTexture(image); map.colorSpace = THREE.SRGBColorSpace; return map;
  }
  function decal(parent, w, h, x, y, z, map, rotationX = 0) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true }));
    mesh.position.set(x, y, z); mesh.rotation.x = rotationX; parent.add(mesh); return mesh;
  }
  function part(name) {
    const group = new THREE.Group(); group.name = name; group.userData.part = name; root.add(group); return group;
  }
  const enclosure = part("box"), lid = part("lid"), panel = part("panel");
  const { width, depth, height } = BOX_DIMENSIONS;
  box(enclosure, width, 3, depth, 0, 1.5, 0, red);
  for (const x of [-48.5, 48.5]) box(enclosure, 3, height - 6, depth, x, 16.5, 0, red);
  for (const z of [-48.5, 48.5]) box(enclosure, 94, height - 6, 3, 0, 16.5, z, red);
  box(enclosure, 94, 0.5, 94, 0, 3.3, 0, cream);
  decal(enclosure, 82, 58, 0, 3.65, 0, texture(656, 464, ctx => {
    ctx.fillStyle = "#f1eee5"; ctx.fillRect(0, 0, 656, 464);
    ctx.save(); ctx.translate(328, 232); ctx.rotate(-0.065);
    ctx.fillStyle = "#303640"; ctx.textAlign = "center";
    ctx.font = '44px "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive';
    ctx.fillText("REMEMBER", 0, -150, 600);
    ctx.fillText("For the Admin Password—", 0, -80, 600);
    ctx.fillText("it's Downstairs,", 0, -10, 600);
    ctx.fillText("Middle Floor,", 0, 60, 600);
    ctx.fillText("THEN Upstairs.", 0, 130, 600);
    ctx.restore();
  }), -Math.PI / 2);

  box(lid, width, 3, depth, 0, 0, 0, red);
  box(lid, 32, 0.4, 9, 0, 1.8, -10, white);
  box(lid, 9, 0.4, 32, 0, 1.8, -10, white);
  decal(lid, 70, 17, 0, 1.85, 21, texture(512, 128, ctx => {
    ctx.fillStyle = "white"; ctx.font = "bold 70px Arial"; ctx.textAlign = "center"; ctx.fillText("MED KIT", 256, 88);
  }), -Math.PI / 2);
  decal(lid, 78, 62, 0, -1.6, 0, texture(512, 384, ctx => {
    ctx.fillStyle = "#fff8dd"; ctx.fillRect(0, 0, 512, 384);
    ctx.save(); ctx.translate(256, 192); ctx.rotate(0.075);
    ctx.fillStyle = "#333"; ctx.textAlign = "center";
    ctx.font = '48px "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive';
    ctx.fillText("Also - remember the ART!", 0, 16, 460);
    ctx.restore();
  }), Math.PI / 2);

  box(panel, 86, 12, 78, 0, 0, 0, dark);
  box(panel, 78, 0.6, 42, 0, 6.3, -11, white);
  const screenTexture = texture(1000, 500);
  decal(panel, 74, 37, 0, 6.75, -11, screenTexture, -Math.PI / 2);
  const buttonLabels = [["left", "←"], ["right", "→"], ["up", "↑"], ["down", "↓"], ["enter", "Enter"]];
  buttonLabels.forEach(([action, label], index) => {
    const x = -32 + index * 16;
    const button = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 2, 24), red);
    button.position.set(x, 7.5, 23); button.userData.action = action; panel.add(button);
    const face = decal(panel, 10, 10, x, 8.6, 23, texture(128, 128, ctx => {
      ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = action === "enter" ? "bold 34px Arial" : "bold 76px Arial"; ctx.fillText(label, 64, 64);
    }), -Math.PI / 2);
    face.userData.action = action;
  });
  // The physical-looking output remains separate from completion: the player must take it.
  box(panel, 39, 1, 4, 0, 6.7, 36, cream);
  const bandage = new THREE.Group(); bandage.userData.action = "collect"; panel.add(bandage);
  const bandageTexture = texture(512, 160, ctx => {
    ctx.fillStyle = "#d9a970"; ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = "#f6dfb9"; ctx.fillRect(195, 8, 122, 144);
    ctx.fillStyle = "#9b734e";
    for (const x of [30, 75, 120, 365, 410, 455]) for (const y of [30, 75, 120]) ctx.fillRect(x, y, 8, 8);
  });
  decal(bandage, 38, 12, 0, 7.4, 43, bandageTexture, -Math.PI / 2).userData.action = "collect";
  const grid = new THREE.GridHelper(500, 25, 0xb8bdc8, 0xc9ced8); grid.position.y = -1; scene.add(grid);

  function updateTextures() {
    lid.userData.action = state.lidOpen ? null : "open";
    bandage.visible = state.stage === "dispensed";
    const ctx = screenTexture.image.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1000, 500);
    ctx.fillStyle = "#202522"; ctx.textAlign = "center";
    ctx.font = "bold 39px monospace"; ctx.fillText("MEDICAL ASSISTANT", 500, 55);
    if (state.stage === "situations") {
      ctx.font = "25px Arial"; ctx.fillText("Select the situation", 500, 99);
      // Keep the selected row visible as the list grows, leaving room for responses.
      const first = Math.max(0, Math.min(state.situation - 2, SITUATIONS.length - 5));
      SITUATIONS.slice(first, first + 5).forEach((situation, row) => {
        const index = first + row;
        const y = 147 + row * 51;
        if (index === state.situation) { ctx.fillStyle = "#303e38"; ctx.fillRect(34, y - 32, 932, 44); }
        ctx.fillStyle = index === state.situation ? "#fff" : "#202522";
        ctx.font = "36px Arial"; ctx.fillText(situation.label, 500, y, 900);
      });
      ctx.fillStyle = "#202522"; ctx.font = "24px Arial";
      ctx.fillText(`↑ ↓ select · Enter confirm    ${state.situation + 1} / ${SITUATIONS.length}`, 500, 420);
    } else if (state.stage === "admin") {
      ctx.font = "29px Arial"; ctx.fillText("Bandage recommended. Enter admin code.", 500, 125);
      state.adminDigits.forEach((digit, index) => {
        const x = 350 + index * 150;
        ctx.fillStyle = index === state.selectedDigit ? "#303e38" : "#d2d3c2"; ctx.fillRect(x - 55, 170, 110, 130);
        ctx.fillStyle = index === state.selectedDigit ? "#fff" : "#202522"; ctx.font = "bold 90px monospace"; ctx.fillText(String(digit), x, 270);
      });
      ctx.fillStyle = "#202522"; ctx.font = "27px Arial"; ctx.fillText("← → select digit    ↑ ↓ change    Enter dispense", 500, 360);
    } else {
      ctx.font = "bold 45px Arial"; ctx.fillText(state.stage === "dispensed" ? "BANDAGE DISPENSED" : "BANDAGE COLLECTED", 500, 230);
      ctx.font = "30px Arial"; ctx.fillText(state.stage === "dispensed" ? "Take it from the slot below." : "Time to help Griffin!", 500, 305);
    }
    ctx.fillStyle = "#202522"; ctx.font = "24px Arial"; ctx.fillText(state.feedback, 500, 466, 940);
    screenTexture.needsUpdate = true;
  }
  function drawHud() {
    context.fillStyle = "#1d2b35"; context.fillRect(0, 0, 900, 80);
    for (const button of getHudButtons(state)) {
      context.fillStyle = "#06b6d4"; context.fillRect(button.x, button.y, button.width, button.height);
      context.fillStyle = "#101820"; context.textAlign = "center"; context.textBaseline = "middle";
      context.font = "bold 18px Arial"; context.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
    }
    context.fillStyle = "#fff"; context.textAlign = "left"; context.font = "14px Arial";
    context.fillText(message, 212, 28, 674);
    context.fillStyle = "#b8c7d1"; context.font = "12px Arial";
    context.fillText("Drag to orbit · Pinch / scroll to zoom · Tap an object to focus", 212, 54, 674);
    status.textContent = message;
  }
  function resetView() {
    focusedPart = null;
    camera.position.set(...(state.lidOpen ? [220, 340, 520] : [145, 155, 195]));
    controls.target.set(0, 15, 0); controls.update(); requestRender();
  }
  const parts = { box: enclosure, lid, panel };
  const bounds = new THREE.Box3(), center = new THREE.Vector3();
  function focusPart(name) {
    const part = parts[name];
    if (!visible || !part || (name === "panel" && !state.lidOpen)) return;
    focusedPart = name;
    bounds.setFromObject(part).getCenter(center);
    const size = bounds.getSize(new THREE.Vector3());
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = Math.max(controls.minDistance, name === "panel" ?
      Math.max(size.z + size.y * 0.3, size.x / camera.aspect) / (2 * Math.tan(halfFov)) * 1.12 :
      size.length() / 2 / Math.sin(halfFov) * 1.05);
    const direction = name === "panel" || (name === "box" && state.lidOpen) ? new THREE.Vector3(0, 1, 0.3) : new THREE.Vector3(0.7, 1, 1);
    camera.position.copy(direction.normalize().multiplyScalar(distance).add(center));
    controls.target.copy(center); controls.update(); requestRender();
  }
  function trackFocusedPart() {
    if (!focusedPart) return;
    bounds.setFromObject(parts[focusedPart]).getCenter(center);
    camera.position.add(center.clone().sub(controls.target)); controls.target.copy(center); controls.update();
  }
  function performAction(action) {
    if (!visible) return;
    if (action === "explore") { pointerStart = null; onExploreHouse(); return; }
    const result = applyBoxAction(state, action);
    message = result.message;
    if (result.changed) {
      onStateChange(structuredClone(state));
      if (action === "open") resetView();
    }
    updateTextures(); drawHud(); requestRender();
    if (result.completed) onCollect();
    return result;
  }
  const raycaster = new THREE.Raycaster();
  canvas.addEventListener("pointerdown", event => {
    if (!visible || event.button !== 0) return;
    pointers.add(event.pointerId);
    if (pointers.size === 1) pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
    else if (pointerStart) pointerStart.dragged = true;
  });
  canvas.addEventListener("pointermove", event => {
    if (pointerStart?.id === event.pointerId && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) pointerStart.dragged = true;
  });
  canvas.addEventListener("pointerup", event => {
    const start = pointerStart; pointerStart = null; pointers.delete(event.pointerId);
    if (!visible || !start || start.dragged || pointers.size || start.id !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.intersectObjects(root.children, true).find(intersection => {
      // Raycaster still visits hidden descendants; ignore controls removed from view.
      for (let object = intersection.object; object; object = object.parent) if (!object.visible) return false;
      return true;
    });
    let object = hit?.object;
    while (object) {
      if (object.userData.action) { performAction(object.userData.action); return; }
      if (object.userData.part) { focusPart(object.userData.part); return; }
      object = object.parent;
    }
  });
  canvas.addEventListener("pointercancel", event => { pointers.delete(event.pointerId); pointerStart = null; });
  let hudPointer = null;
  const hudPoint = event => { const rect = hud.getBoundingClientRect(); return { x: (event.clientX - rect.left) * 900 / rect.width, y: (event.clientY - rect.top) * 80 / rect.height }; };
  hud.addEventListener("pointerdown", event => {
    if (!visible || event.button !== 0) return;
    event.preventDefault(); hud.setPointerCapture(event.pointerId);
    hudPointer = { id: event.pointerId, ...hudPoint(event) };
  });
  hud.addEventListener("pointerup", event => {
    if (!visible || hudPointer?.id !== event.pointerId) return;
    const start = hudPointer; hudPointer = null;
    const p = hudPoint(event);
    if (Math.hypot(p.x - start.x, p.y - start.y) > 6) return;
    const button = getHudButtons(state).find(item => p.x >= item.x && p.x < item.x + item.width && p.y >= item.y && p.y < item.y + item.height && start.x >= item.x && start.x < item.x + item.width && start.y >= item.y && start.y < item.y + item.height);
    if (button) performAction(button.action);
  });
  for (const type of ["pointercancel", "lostpointercapture"]) hud.addEventListener(type, () => { hudPointer = null; });
  function onKey(event) {
    if (!visible || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    const key = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", Enter: state.lidOpen ? "enter" : "open", Space: state.lidOpen ? "enter" : "open", Escape: "explore" }[event.code];
    if (key) { event.preventDefault(); performAction(key); }
  }
  window.addEventListener("keydown", onKey);
  controls.addEventListener("change", requestRender);
  controls.addEventListener("start", () => { focusedPart = null; });
  function requestRender() { if (visible && frameId === null) frameId = requestAnimationFrame(render); }
  function placeParts(immediate = false, dt = 1 / 60) {
    const amount = immediate || reducedMotion ? 1 : 1 - Math.exp(-dt * 14);
    const targets = [[lid, new THREE.Vector3(state.lidOpen ? -140 : 0, state.lidOpen ? 3 : 31.5, 0)], [panel, new THREE.Vector3(0, state.lidOpen ? 18 : 14, 0)], [enclosure, new THREE.Vector3(state.lidOpen ? 140 : 0, 0, 0)]];
    let animating = false;
    for (const [part, target] of targets) {
      part.position.lerp(target, amount);
      if (part.position.distanceTo(target) > 0.02) animating = true;
      else part.position.copy(target);
    }
    return animating;
  }
  function render(time) {
    frameId = null;
    if (!visible) return;
    const dt = lastTime === undefined ? 1 / 60 : Math.min((time - lastTime) / 1000, 0.05); lastTime = time;
    const animating = placeParts(false, dt); trackFocusedPart();
    // The reference grid should not overlay handwritten clues viewed from underneath.
    grid.visible = camera.position.y >= grid.position.y;
    renderer.render(scene, camera);
    if (animating) requestRender(); else lastTime = undefined;
  }
  placeParts(true); updateTextures(); drawHud(); resetView();
  return {
    getState: () => structuredClone(state),
    getCameraState: () => ({ focus: focusedPart, position: camera.position.toArray(), target: controls.target.toArray() }),
    performAction, focusPart,
    setVisible(next) {
      visible = next; controls.enabled = next; pointerStart = null; hudPointer = null; pointers.clear();
      if (!next) { cancelAnimationFrame(frameId); frameId = null; lastTime = undefined; }
      else requestRender();
    },
    dispose() {
      visible = false; cancelAnimationFrame(frameId); window.removeEventListener("keydown", onKey); controls.dispose();
      const materials = new Set();
      scene.traverse(object => { object.geometry?.dispose(); if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); });
      for (const material of materials) { material.map?.dispose(); material.dispose(); }
      renderer.dispose();
    },
  };
}
