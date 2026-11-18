import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { BOX_DIMENSIONS, createBoxState, applyBoxAction, getHudButtons } from "./state.mjs";

export function createBoxPrototype(canvas, hud, status) {
  const state = createBoxState();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(900, 480, false);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e7e9ed");
  const camera = new THREE.PerspectiveCamera(40, 900 / 480, 1, 2000);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = 140;
  controls.maxDistance = 750;
  controls.target.set(0, 17, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7c8394, 2.6));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(80, 160, 120);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xffffff, 1.4);
  fill.position.set(-100, 30, -100);
  scene.add(fill);

  const root = new THREE.Group();
  scene.add(root);
  const red = new THREE.MeshStandardMaterial({ color: "#be2540", roughness: 0.75 });
  const dark = new THREE.MeshStandardMaterial({ color: "#333e48", roughness: 0.8 });
  const cream = new THREE.MeshStandardMaterial({ color: "#f1eee5", roughness: 0.8 });
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.8 });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: "#222c39", transparent: true, opacity: 0.22 });
  let visible = true;
  let frameId = null;
  let lastTime;
  let pointerStart;
  const scenePointers = new Set();
  let message = "100 × 100 × 33 mm · Demo code: 000 · Drag to inspect; scroll/pinch to zoom.";
  const context = hud.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function box(parent, width, height, depth, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMaterial));
    parent.add(mesh);
    return mesh;
  }

  function texture(width, height, paint) {
    const image = document.createElement("canvas");
    image.width = width;
    image.height = height;
    paint(image.getContext("2d"));
    const result = new THREE.CanvasTexture(image);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }

  function decal(parent, width, height, x, y, z, map, rotationX = 0) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map, transparent: true }));
    mesh.position.set(x, y, z);
    mesh.rotation.x = rotationX;
    parent.add(mesh);
    return mesh;
  }

  // Millimeters are world units. Floor + four walls leave a real, visible cavity.
  const { width, depth, height } = BOX_DIMENSIONS;
  box(root, width, 3, depth, 0, 1.5, 0, red);
  box(root, 3, height - 6, depth, -48.5, 16.5, 0, red);
  box(root, 3, height - 6, depth, 48.5, 16.5, 0, red);
  box(root, 94, height - 6, 3, 0, 16.5, -48.5, red);
  box(root, 94, height - 6, 3, 0, 16.5, 48.5, red);
  box(root, 94, 0.5, 94, 0, 3.3, 0, cream);

  const lid = new THREE.Group();
  lid.position.set(0, 31.5, 0);
  root.add(lid);
  const lidMesh = box(lid, width, 3, depth, 0, 0, 0, red);
  lidMesh.userData.action = "lid";
  box(lid, 32, 0.4, 9, 0, 1.8, -10, white);
  box(lid, 9, 0.4, 32, 0, 1.8, -10, white);
  decal(lid, 70, 17, 0, 1.85, 21, texture(512, 128, ctx => {
    ctx.fillStyle = "white";
    ctx.font = "bold 70px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MED KIT", 256, 88);
  }), -Math.PI / 2);
  decal(lid, 78, 62, 0, -1.6, 0, texture(512, 384, ctx => {
    ctx.fillStyle = "#fff8dd";
    ctx.fillRect(0, 0, 512, 384);
    ctx.strokeStyle = "#8b7c4c";
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 488, 360);
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.font = "bold 42px Arial";
    ctx.fillText("UNDERSIDE", 256, 150);
    ctx.font = "30px Arial";
    ctx.fillText("Clue placeholder", 256, 215);
  }), Math.PI / 2);

  const lock = box(root, 56, 19, 6, 0, 17, 53, dark);
  lock.userData.action = "unlock";
  const digitTextures = state.digits.map((_, index) => {
    const map = texture(64, 96, () => {});
    const dial = decal(root, 12, 15, -16 + index * 16, 17, 56.1, map);
    dial.userData = { action: "digit", index };
    return map;
  });

  const panel = new THREE.Group();
  panel.position.set(0, 14, 0);
  root.add(panel);
  const housing = box(panel, 74, 18, 70, 0, 0, 0, dark);
  housing.userData.action = "panel";
  box(panel, 29, 0.6, 54, -14, 9.25, 0, white);
  const screenTexture = texture(244, 500, () => {});
  decal(panel, 24.4, 50, -14, 9.65, 0, screenTexture, -Math.PI / 2);
  for (const [index, z] of [-12, 12].entries()) {
    const button = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 2, 24), red);
    button.position.set(24, 10, z);
    button.userData = { action: "panel-button", index };
    panel.add(button);
  }

  const grid = new THREE.GridHelper(160, 8, 0xb8bdc8, 0xc9ced8);
  grid.position.y = -1;
  scene.add(grid);

  function updateTextures() {
    digitTextures.forEach((map, index) => {
      const ctx = map.image.getContext("2d");
      ctx.fillStyle = "#f5f5f0";
      ctx.fillRect(0, 0, 64, 96);
      ctx.fillStyle = "#242b35";
      ctx.font = "bold 70px monospace";
      ctx.textAlign = "center";
      ctx.fillText(String(state.digits[index]), 32, 72);
      map.needsUpdate = true;
    });
    const ctx = screenTexture.image.getContext("2d");
    ctx.fillStyle = "#f1f0df";
    ctx.fillRect(0, 0, 244, 500);
    ctx.fillStyle = "#202522";
    ctx.textAlign = "center";
    ctx.font = "bold 27px monospace";
    ctx.fillText("CROWPANEL", 122, 70);
    ctx.font = "22px monospace";
    ctx.fillText(state.panelRemoved ? "POWER ON" : "POWER OFF", 122, 150);
    if (state.panelRemoved) {
      ctx.fillText("DEMO", 122, 230);
      ctx.fillText(`Presses: ${state.buttonPresses}`, 122, 285);
    }
    screenTexture.needsUpdate = true;
  }

  function drawHud() {
    context.fillStyle = "#1d2b35";
    context.fillRect(0, 0, 900, 120);
    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.font = "15px Arial";
    context.fillText(message, 12, 22, 876);
    for (const button of getHudButtons(state)) {
      context.fillStyle = button.disabled ? "#43515b" : "#06b6d4";
      context.fillRect(button.x, button.y, button.width, button.height);
      context.fillStyle = button.disabled ? "#b5bfc6" : "#101820";
      context.textAlign = "center";
      context.font = button.action === "digit" ? "bold 24px monospace" : "15px Arial";
      context.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
    }
    context.textAlign = "left";
    context.fillStyle = "#b8c7d1";
    context.font = "12px Arial";
    context.fillText("3D EXPERIMENT · U unlock · L lid · F flip · P panel · V view · R reset · No game progress is changed", 12, 105);
    status.textContent = message;
  }

  function resetView() {
    camera.position.set(...(state.lidOpen ? [220, 230, 360] : [145, 155, 195]));
    controls.target.set(0, 17, 0);
    controls.update();
    requestRender();
  }

  function performAction(action, index = 0) {
    if (!visible) return;
    if (action === "view") resetView();
    else {
      const wasOpen = state.lidOpen;
      const result = applyBoxAction(state, action, index);
      message = result.message;
      if (action === "reset" || wasOpen !== state.lidOpen) resetView();
      updateTextures();
    }
    drawHud();
    requestRender();
  }

  const raycaster = new THREE.Raycaster();
  canvas.addEventListener("pointerdown", event => {
    if (!visible || event.button !== 0) return;
    scenePointers.add(event.pointerId);
    if (scenePointers.size === 1) pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
    else if (pointerStart) pointerStart.dragged = true;
  });
  canvas.addEventListener("pointermove", event => {
    if (pointerStart?.id === event.pointerId && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) {
      pointerStart.dragged = true;
    }
  });
  canvas.addEventListener("pointerup", event => {
    const start = pointerStart;
    pointerStart = null;
    scenePointers.delete(event.pointerId);
    if (!visible || !start || start.dragged || scenePointers.size || start.id !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.intersectObjects(root.children, true)[0];
    let object = hit?.object;
    while (object && !object.userData.action) object = object.parent;
    if (object) performAction(object.userData.action, object.userData.index);
  });
  canvas.addEventListener("pointercancel", event => { scenePointers.delete(event.pointerId); pointerStart = null; });
  hud.addEventListener("pointerdown", event => {
    if (!visible || event.button !== 0) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    const rect = hud.getBoundingClientRect();
    const x = (event.clientX - rect.left) * 900 / rect.width;
    const y = (event.clientY - rect.top) * 120 / rect.height;
    const button = getHudButtons(state).find(item => x >= item.x && x < item.x + item.width && y >= item.y && y < item.y + item.height);
    if (button) performAction(button.action, button.index);
  });
  function onKey(event) {
    if (!visible || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    const keys = { KeyU: "unlock", KeyL: "lid", KeyF: "flip", KeyP: "panel", KeyV: "view", KeyR: "reset" };
    if (keys[event.code]) { event.preventDefault(); performAction(keys[event.code]); }
    else if (/^Digit[1-3]$/.test(event.code)) { event.preventDefault(); performAction("digit", Number(event.code.slice(-1)) - 1); }
  }
  window.addEventListener("keydown", onKey);
  controls.addEventListener("change", requestRender);

  function requestRender() {
    if (visible && frameId === null) frameId = requestAnimationFrame(render);
  }

  function render(time) {
    frameId = null;
    if (!visible) return;
    const dt = lastTime === undefined ? 1 / 60 : Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    const amount = reducedMotion ? 1 : 1 - Math.exp(-dt * 14);
    const lidTarget = new THREE.Vector3(state.lidOpen ? -135 : 0, state.lidOpen ? 36 : 31.5, 0);
    const panelTarget = new THREE.Vector3(state.panelRemoved ? 135 : 0, state.panelRemoved ? 36 : 14, 0);
    const flipTarget = state.lidFlipped ? Math.PI : 0;
    lid.position.lerp(lidTarget, amount);
    panel.position.lerp(panelTarget, amount);
    lid.rotation.x += (flipTarget - lid.rotation.x) * amount;
    const animating = lid.position.distanceTo(lidTarget) > 0.02 || panel.position.distanceTo(panelTarget) > 0.02 || Math.abs(lid.rotation.x - flipTarget) > 0.002;
    if (!animating) { lid.position.copy(lidTarget); panel.position.copy(panelTarget); lid.rotation.x = flipTarget; }
    renderer.render(scene, camera);
    if (animating) requestRender();
    else lastTime = undefined;
  }

  updateTextures();
  drawHud();
  resetView();
  return {
    getState: () => structuredClone(state),
    performAction,
    setVisible(nextVisible) {
      visible = nextVisible;
      controls.enabled = visible;
      pointerStart = null;
      scenePointers.clear();
      if (!visible) {
        cancelAnimationFrame(frameId);
        frameId = null;
        lastTime = undefined;
      } else requestRender();
    },
    dispose() {
      visible = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKey);
      controls.dispose();
      const materials = new Set();
      scene.traverse(object => {
        object.geometry?.dispose();
        if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
      });
      for (const material of materials) { material.map?.dispose(); material.dispose(); }
      renderer.dispose();
    },
  };
}
