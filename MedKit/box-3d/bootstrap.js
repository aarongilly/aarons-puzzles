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
  const { createBoxView } = await import("./scene.js");
  let savedState;
  try { savedState = JSON.parse(window.localStorage.getItem("med-kit:box-state")); } catch { /* Start fresh if storage is unavailable. */ }
  controller = createBoxView(document.querySelector("#scene"), document.querySelector("#hud"), document.querySelector("#status"), {
    state: savedState,
    onStateChange(state) {
      try { window.localStorage.setItem("med-kit:box-state", JSON.stringify(state)); } catch { /* Keep playing in memory. */ }
      window.parent.updateMedKitProgress?.(state);
    },
    onExploreHouse() { window.parent.exploreHouseFromBox?.(); },
    onCollect() { window.parent.completeMedKitPuzzle?.(); },
  });
  window.boxView = controller;
  window.parent.updateMedKitProgress?.(controller.getState());
  failure.hidden = true;
  updateVisibility();
} catch (error) {
  failure.hidden = false;
  failure.textContent = "The puzzle box could not load. Serve the project over HTTP and use a browser with WebGL 2 enabled.";
  console.error("Puzzle box failed:", error);
}
