let controller;
let hostVisible = true;
const failure = document.querySelector("#failure");

function updateVisibility() {
  controller?.setVisible(hostVisible && !document.hidden);
}

window.addEventListener("message", event => {
  if (event.source !== window.parent || event.origin !== window.location.origin ||
      event.data?.type !== "med-kit:box-visibility") return;
  hostVisible = event.data.visible === true;
  updateVisibility();
});
document.addEventListener("visibilitychange", updateVisibility);
window.addEventListener("pagehide", event => {
  if (event.persisted) controller?.setVisible(false);
  else controller?.dispose();
});
window.addEventListener("pageshow", updateVisibility);

try {
  const { createBoxPrototype } = await import("./prototype.js");
  controller = createBoxPrototype(document.querySelector("#scene"), document.querySelector("#hud"), document.querySelector("#status"));
  window.boxPrototype = controller;
  failure.hidden = true;
  updateVisibility();
} catch (error) {
  failure.hidden = false;
  failure.textContent = "The 3D prototype could not load. Serve the project over HTTP and use a browser with WebGL 2 enabled. The rest of Med Kit is unaffected.";
  console.error("Box prototype failed:", error);
}
