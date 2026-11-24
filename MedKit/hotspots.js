// Shared artwork markers; interaction bounds stay separate from their presentation.
function drawHotspotMarker(context, x, y, selected = false) {
  context.save();
  if (selected) {
    context.beginPath();
    context.arc(x, y, 13, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 218, 126, 0.25)";
    context.fill();
    context.strokeStyle = "rgba(29, 43, 53, 0.8)";
    context.lineWidth = 1;
    context.stroke();
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.strokeStyle = "#ffd479";
    context.lineWidth = 2.5;
    context.stroke();
  }
  context.beginPath();
  context.arc(x, y, selected ? 4.5 : 5, 0, Math.PI * 2);
  context.fillStyle = selected ? "#ffdb83" : "rgba(255, 255, 255, 0.72)";
  context.strokeStyle = selected ? "#263741" : "rgba(29, 43, 53, 0.48)";
  context.lineWidth = 1.25;
  context.fill();
  context.stroke();
  if (!selected) {
    context.beginPath();
    context.arc(x, y, 1.5, 0, Math.PI * 2);
    context.fillStyle = "rgba(29, 43, 53, 0.48)";
    context.fill();
  }
  context.restore();
}
