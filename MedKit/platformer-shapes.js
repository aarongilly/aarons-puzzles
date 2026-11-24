// Runtime rectangles use pixels. Authored bounds are local offsets in level units.
function getPlatformerBounds(entity, kind) {
  if (kind === "body" && getPlatformerBlockState(entity).passable) return null;
  if (kind === "body" && entity.returnBarrierHeight) {
    // Match the visible fence so approaching from the right stops at its edge.
    return { x: entity.x, y: 0, width: entity.width, height: entity.returnBarrierHeight };
  }
  const explicit = entity.bounds && Object.hasOwn(entity.bounds, kind);
  let local;
  if (explicit) local = entity.bounds[kind];
  else {
    if (kind === "contact" && entity.type !== "hazard") return null;
    if (kind === "target" && !entity.actionEffect) return null;
    local = Object.hasOwn(entity, "autoBounds") ? entity.autoBounds : { x: 0, y: 0, width: entity.width, height: entity.height };
  }
  if (!local || local.width <= 0 || local.height <= 0) return null;
  const facing = entity.motion?.type === "patrol" ? entity.motion.direction : entity.facing ?? 1;
  let x = facing < 0 ? entity.width - local.x - local.width : local.x;
  let y = local.y, width = local.width, height = local.height;
  if (!explicit) {
    const inset = entity.insets?.[kind] ?? 0;
    x += width * inset; y += height * inset;
    width *= 1 - 2 * inset; height *= 1 - 2 * inset;
  }
  return width > 0 && height > 0 ? { x: entity.x + x, y: entity.y + y, width, height } : null;
}

function getPlatformerPlayerContact(player) {
  // Stable, slightly forgiving damage area, independent of animation frame changes.
  return { x: player.x + 3, y: player.y + 3, width: player.width - 6, height: player.height - 6 };
}

function scanPlatformerAlpha(data, imageWidth, imageHeight, frames, threshold = 1) {
  let left = Infinity, top = Infinity, right = -1, bottom = -1;
  for (const frame of frames) {
    for (let y = 0; y < frame.height; y++) {
      for (let x = 0; x < frame.width; x++) {
        if (frame.x + x >= imageWidth || frame.y + y >= imageHeight) continue;
        if (data[((frame.y + y) * imageWidth + frame.x + x) * 4 + 3] < threshold) continue;
        left = Math.min(left, x); top = Math.min(top, y);
        right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
    }
  }
  return right < left ? null : { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

function readPlatformerSpriteBounds(image, sprite) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const width = sprite.frameWidth ?? canvas.width, height = sprite.frameHeight ?? canvas.height;
    const animations = sprite.animations ? Object.entries(sprite.animations)
      .filter(([name]) => !sprite.boundsAnimations || sprite.boundsAnimations.includes(name)) : [];
    const frames = animations.length ? animations.flatMap(([, animation]) =>
      Array.from({ length: animation.frames }, (_, column) => ({
        x: (sprite.sourceX ?? 0) + ((animation.startColumn ?? 0) + column) * width, y: (sprite.sourceY ?? 0) + animation.row * height, width, height })))
      : [{ x: sprite.sourceX ?? 0, y: sprite.sourceY ?? 0, width, height }];
    const bounds = scanPlatformerAlpha(data, canvas.width, canvas.height, frames, sprite.alphaThreshold ?? 1);
    return bounds && { x: bounds.x / width, y: bounds.y / height, width: bounds.width / width, height: bounds.height / height };
  } catch {
    // Pixel readback may be unavailable (e.g. cross-origin art). Explicit bounds still work.
    return undefined;
  }
}

function getPlatformerEntityFrame(block, time, sprite = block.sprite) {
  if (!sprite?.animations) return { row: 0, column: 0, flip: (block.motion?.direction ?? block.facing ?? 1) < 0 };
  let name = "idle";
  if (block.type === "defeated") {
    name = sprite.animations.death ? "death" : "idle";
    time = block.deathTime ?? 0;
  } else if (block.type === "spring" && sprite.animations.bounce && Number.isFinite(block.bounceStartedAt)) {
    const elapsed = time - block.bounceStartedAt;
    if (elapsed >= 0 && elapsed < sprite.animations.bounce.frames / (sprite.framesPerSecond ?? 10)) {
      name = "bounce";
      time = elapsed;
    }
  } else if (block.motion?.type === "ground-boss" && ["leap", "recover"].includes(block.motion.phase) && sprite.animations[block.motion.phase]) {
    name = block.motion.phase;
    time = 0;
  } else if (sprite.animations.fire && Number.isFinite(block.firedAt) &&
      time >= block.firedAt && time - block.firedAt < sprite.animations.fire.duration) {
    name = "fire";
    time -= block.firedAt;
  } else if (block.stunTime > 0) name = sprite.animations.hurt ? "hurt" : "idle";
  else if (block.contactPauseTime > 0 && sprite.animations.contactPause) {
    const elapsed = Math.max(0, PLATFORMER_HURT_SECONDS - block.contactPauseTime);
    const hitDuration = sprite.animations.hit?.duration ?? 0;
    name = sprite.animations.hit && elapsed < hitDuration ? "hit" : "contactPause";
    time = name === "hit" ? elapsed : elapsed - hitDuration;
  }
  else if (block.motion?.type === "patrol" && !(block.contactPauseTime > 0)) name = "run";
  else if (block.motion?.type === "hop") {
    const flight = 2 * Math.sqrt(2 * block.motion.jumpHeight / PLATFORMER_GRAVITY);
    if (block.motion.elapsed < flight) name = block.motion.elapsed < flight / 2 ? "jump" : "fall";
  }
  const animation = sprite.animations[name] ?? sprite.animations.idle ?? Object.values(sprite.animations)[0];
  const frame = Math.floor(time * (sprite.framesPerSecond ?? 10));
  const column = (animation.startColumn ?? 0) + (name === "death" || animation.loop === false ? Math.min(frame, animation.frames - 1) : frame % animation.frames);
  return { row: animation.row, column,
    flip: name === "hit" ? block.hitFlip === true : (block.motion?.direction ?? block.facing ?? 1) < 0 };
}
