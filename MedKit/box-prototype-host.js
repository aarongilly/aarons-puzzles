// This adapter is the only bridge to the disposable, iframe-contained 3D experiment.
function createBoxPrototypeHost(fallbackCanvas, frame, { enabled = true } = {}) {
  let visible = false;
  function notify() {
    const origin = window.location.origin;
    frame.contentWindow?.postMessage({ type: "med-kit:box-visibility", visible }, origin === "null" ? "*" : origin);
  }
  frame.addEventListener("load", notify);
  return {
    start() {
      visible = true;
      fallbackCanvas.hidden = enabled;
      frame.hidden = !enabled;
      if (enabled && !frame.getAttribute("src")) frame.src = "prototypes/box-3d/index.html";
      notify();
    },
    stop() {
      visible = false;
      fallbackCanvas.hidden = true;
      frame.hidden = true;
      notify();
    },
    focus() { (enabled ? frame : fallbackCanvas).focus(); },
  };
}
