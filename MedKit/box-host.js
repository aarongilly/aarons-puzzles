// Keep the box's WebGL canvas and input lifecycle separate from the 2D game.
function createBoxHost(frame) {
  let visible = false;
  function notify() {
    const origin = window.location.origin;
    frame.contentWindow?.postMessage({ type: "med-kit:box-visibility", visible }, origin === "null" ? "*" : origin);
  }
  frame.addEventListener("load", notify);
  return {
    start() {
      visible = true;
      frame.hidden = false;
      if (!frame.getAttribute("src")) frame.src = "box-3d/index.html";
      notify();
    },
    stop() {
      visible = false;
      frame.hidden = true;
      notify();
    },
    focus() { frame.focus(); },
  };
}
