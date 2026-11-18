// Temporary block course for testing movement; this is not the final level layout.
const PLATFORMER_RUN_SPEED = 280;
const PLATFORMER_RAMP_SECONDS = 0.15;
const PLATFORMER_GRAVITY = 1500;
const PLATFORMER_HELD_JUMP_HEIGHT = 3;
// Frame the starting ground 85% down the viewport; vertical framing stays fixed.
const PLATFORMER_CAMERA_FEET_RATIO = 0.85;
const PLATFORMER_HUD_HEIGHT = 80;
// Temporary development labels; disable when the artwork makes them unnecessary.
const PLATFORMER_SHOW_BLOCK_LABELS = true;
const PLATFORMER_ACTION_REACH = 48;
const PLATFORMER_KNOCKBACK_SPEED = 360;
const PLATFORMER_KNOCKBACK_SECONDS = 0.22;
const PLATFORMER_HURT_SECONDS = 3;

function getPlatformerPlayerOpacity(player) {
  return player.hurtTime > 0 && Math.floor(player.hurtTime / 0.12) % 2 === 0 ? 0.35 : 1;
}

function getPlatformerBlockState(block) {
  return block.states?.[block.state] ?? {
    passable: block.passable ?? false, tileSet: block.tileSet ?? "terrain", color: block.color ?? "#455b50",
  };
}

function getPlatformerBlockStates(world) {
  return Object.fromEntries(world.blocks.filter(block => block.states).map(block => [block.id, block.state]));
}

function getNearbyPlatformerBlock(world, matches) {
  const player = world.player;
  return world.blocks.find(block => matches(block) &&
    player.y < block.y + block.height && player.y + player.height > block.y &&
    player.x + player.width >= block.x - PLATFORMER_ACTION_REACH &&
    player.x <= block.x + block.width + PLATFORMER_ACTION_REACH);
}

function getNearbyPlatformerFence(world) {
  return getNearbyPlatformerBlock(world, block => block.type === "fence" && block.state === "closed");
}

function getNearbyPlatformerDestination(world) {
  return getNearbyPlatformerBlock(world, block => block.type === "destination");
}

function getPlatformerControls(width, height) {
  const y = height - PLATFORMER_HUD_HEIGHT + 12;
  return [
    { control: "left", x: 12, y, width: 64, height: 56, label: "←", key: "A / ←" },
    { control: "right", x: 88, y, width: 64, height: 56, label: "→", key: "D / →" },
    { control: "jump", x: width - 212, y, width: 92, height: 56, label: "Jump", key: "Hold W / ↑" },
    { control: "action", x: width - 108, y, width: 96, height: 56, label: "Action", key: "Space" },
  ];
}

// Temporary sheet: 4 columns, 10 rows; update this mapping for the final artwork.
const PLATFORMER_SPRITE = {
  src: "assets/my-sprite.png",
  frameWidth: 22,
  frameHeight: 35,
  scale: 2,
  framesPerSecond: 10,
  idle: { right: 2, left: 3 },
  run: { right: 6, left: 7 },
  actionRow: 8,
};

function getPlatformerSpriteFrame(player, animationTime) {
  const direction = player.facing < 0 ? "left" : "right";
  const column = Math.floor(animationTime * PLATFORMER_SPRITE.framesPerSecond) % 4;
  if (player.actionTime > 0) {
    return { row: PLATFORMER_SPRITE.actionRow, column, flip: player.facing < 0 };
  }
  if (player.grounded && player.vx !== 0) {
    return { row: PLATFORMER_SPRITE.run[direction], column, flip: false };
  }
  // This sheet has no dedicated jump row; use the standing pose in the air.
  return { row: PLATFORMER_SPRITE.idle[direction], column: 0, flip: false };
}

function createPlatformerWorld(blockStates = {}, journey = "go-home") {
  const world = {
    journey,
    width: 4800,
    height: 900,
    requestedScreen: null,
    hazardHit: null,
    player: { x: 160, y: 644, width: 36, height: 56, vx: 0, vy: 0, grounded: true, facing: 1, actionTime: 0, jumpHolding: false, jumpStartY: 644, hurtTime: 0, knockbackTime: 0 },
    // Griffin stays just outside the walkable area to the left of spawn.
    griffin: { x: -64, y: 668, width: 64, height: 32 },
    blocks: [
      { id: "ground", description: "Ground", x: 0, y: 700, width: 4800, height: 200 },
      // Narrow enough to jump over with a tap, rather than requiring a landing on top.
      { id: "01", description: "Spring toy", x: 260, y: 676, width: 24, height: 24 },
      { id: "02", description: "Low platform", x: 800, y: 620, width: 160, height: 80 },
      {
        id: "03", description: "Fence", type: "fence", x: 1280, y: 530, width: 16, height: 130,
        state: "closed",
        // Tile-set names will select the actual artwork when tiles are supplied.
        states: {
          closed: { passable: false, tileSet: "fence-closed", color: "#875d3b" },
          open: { passable: true, tileSet: "fence-open", color: "#6b9b77" },
        },
      },
      { id: "04", description: "Wide platform", x: 1780, y: 600, width: 220, height: 100 },
      { id: "05", description: "High platform", x: 2350, y: 500, width: 180, height: 30 },
      { id: "06", description: "Low platform", x: 2880, y: 620, width: 120, height: 80 },
      { id: "07", description: "Raised platform", x: 3380, y: 540, width: 200, height: 30 },
      { id: "08", description: "Wide platform", x: 4020, y: 600, width: 220, height: 100 },
      { id: "09", description: "Hazard", type: "hazard", passable: true,
        color: "#8b4513", x: 600, y: 676, width: 40, height: 24 },
      { id: "10", description: "Hazard", type: "hazard", passable: true,
        color: "#8b4513", x: 4320, y: 676, width: 40, height: 24 },
      { id: "99", description: "Home", type: "destination", targetScreen: "home", passable: true,
        color: "#5475bc", x: 4500, y: 580, width: 100, height: 120 },
    ],
  };
  for (const block of world.blocks) {
    const savedState = blockStates?.[block.id];
    if (block.states && typeof savedState === "string" && Object.hasOwn(block.states, savedState)) {
      block.state = savedState;
    }
  }
  if (journey === "get-to-playground") placePlatformerOutsideHome(world);
  return world;
}

function placePlatformerOutsideHome(world) {
  const home = world.blocks.find(block => block.id === "99");
  Object.assign(world.player, {
    x: home.x - world.player.width - 24, y: home.y + home.height - world.player.height,
    vx: 0, vy: 0, grounded: true, facing: -1, jumpHolding: false, actionTime: 0, hurtTime: 0, knockbackTime: 0,
  });
  world.player.jumpStartY = world.player.y;
  world.requestedScreen = null;
  world.hazardHit = null;
}

function platformerOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function stepPlatformerWorld(world, input, dt) {
  if (dt <= 0) return;
  const player = world.player;
  world.hazardHit = null;
  player.hurtTime = Math.max(0, player.hurtTime - dt);
  const knockedBack = player.knockbackTime > 0;
  player.knockbackTime = Math.max(0, player.knockbackTime - dt);
  const controlsLocked = knockedBack || player.hurtTime > 0;
  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  // After the initial bounce, stay still until the full flashing penalty ends.
  if (!knockedBack && player.hurtTime > 0) player.vx = 0;
  // Stop immediately on release; each new direction ramps from rest.
  if (!controlsLocked && (!direction || Math.sign(player.vx) !== direction)) player.vx = 0;
  if (!controlsLocked && direction) {
    const acceleration = PLATFORMER_RUN_SPEED / PLATFORMER_RAMP_SECONDS;
    player.vx = direction * Math.min(PLATFORMER_RUN_SPEED, Math.abs(player.vx) + acceleration * dt);
  }
  if (!controlsLocked && player.vx) player.facing = Math.sign(player.vx);
  const travelDirection = Math.sign(player.vx) || direction || player.facing;
  if (!controlsLocked && input.jump && player.grounded) {
    // Launch for the maximum height; release cuts the ascent instead of changing gravity.
    player.vy = -Math.sqrt(2 * PLATFORMER_GRAVITY * player.height * PLATFORMER_HELD_JUMP_HEIGHT);
    player.jumpStartY = player.y;
    player.jumpHolding = true;
  }
  if (!input.jumpHeld && player.jumpHolding) {
    if (player.vy < 0) {
      // An early release still reaches one body height. Later release ends ascent.
      const remainingHeight = Math.max(0, player.height - (player.jumpStartY - player.y));
      player.vy = Math.max(player.vy, -Math.sqrt(2 * PLATFORMER_GRAVITY * remainingHeight));
    }
    player.jumpHolding = false;
  }
  player.actionTime = input.action && !controlsLocked ? 0.25 : Math.max(0, player.actionTime - dt);
  let blockStateChanged = false;
  if (input.action && !controlsLocked) {
    const fence = getNearbyPlatformerFence(world);
    if (fence) {
      fence.state = "open";
      blockStateChanged = true;
    }
    const destination = getNearbyPlatformerDestination(world);
    if (destination) world.requestedScreen = destination.targetScreen;
  }

  player.x += player.vx * dt;
  for (const block of world.blocks) {
    if (getPlatformerBlockState(block).passable) continue;
    if (!platformerOverlap(player, block)) continue;
    if (player.vx > 0) player.x = block.x - player.width;
    if (player.vx < 0) player.x = block.x + block.width;
    player.vx = 0;
  }
  const boundedX = Math.max(0, Math.min(world.width - player.width, player.x));
  if (boundedX !== player.x) player.vx = 0;
  player.x = boundedX;

  player.y += player.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2;
  player.vy += PLATFORMER_GRAVITY * dt;
  player.grounded = false;
  for (const block of world.blocks) {
    if (getPlatformerBlockState(block).passable) continue;
    if (!platformerOverlap(player, block)) continue;
    if (player.vy > 0) {
      player.y = block.y - player.height;
      player.grounded = true;
    } else if (player.vy < 0) {
      player.y = block.y + block.height;
    }
    player.vy = 0;
    player.jumpHolding = false;
  }
  if (player.hurtTime === 0) {
    const hazard = world.blocks.find(block => block.type === "hazard" && platformerOverlap(player, block));
    if (hazard) {
      // Separate first, then launch backwards; the brief control lock prevents
      // held movement from cancelling the bounce on the next frame.
      player.x = travelDirection > 0 ? hazard.x - player.width - 1 : hazard.x + hazard.width + 1;
      player.x = Math.max(0, Math.min(world.width - player.width, player.x));
      player.vx = -travelDirection * PLATFORMER_KNOCKBACK_SPEED;
      player.vy = -260;
      player.grounded = false;
      player.jumpHolding = false;
      player.actionTime = 0;
      player.knockbackTime = PLATFORMER_KNOCKBACK_SECONDS;
      player.hurtTime = PLATFORMER_HURT_SECONDS;
      world.requestedScreen = null;
      world.hazardHit = { blockId: hazard.id };
    }
  }
  return blockStateChanged;
}

function createPlatformer(canvas, {
  blockStates = {}, onBlockStateChange = () => {}, onDestination = () => {}, onHazardHit = () => {},
} = {}) {
  const context = canvas.getContext("2d");
  let world = createPlatformerWorld(blockStates);
  const cameraY = world.player.y + world.player.height - canvas.height * PLATFORMER_CAMERA_FEET_RATIO;
  const held = new Map();
  const activePointers = new Set();
  const keyControls = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "jump", KeyW: "jump", Space: "action" };
  let jumpQueued = false;
  let actionQueued = false;
  let running = false;
  let frameId;
  let previousTime;
  let animationTime = 0;
  let animationState = "";
  let spriteReady = false;
  const sprite = new Image();
  sprite.addEventListener("load", () => {
    spriteReady = sprite.naturalWidth >= PLATFORMER_SPRITE.frameWidth * 4 &&
      sprite.naturalHeight >= PLATFORMER_SPRITE.frameHeight * 9;
    if (running) draw();
  });
  sprite.src = PLATFORMER_SPRITE.src;

  function press(source, control) {
    if (held.has(source)) return;
    held.set(source, control);
    if (control === "jump") jumpQueued = true;
    if (control === "action") actionQueued = true;
  }

  function clearInput() {
    held.clear();
    jumpQueued = false;
    actionQueued = false;
    activePointers.clear();
  }

  window.addEventListener("keydown", event => {
    if (!running || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    const control = keyControls[event.code];
    if (!control) return;
    event.preventDefault();
    if (!event.repeat) press(event.code, control);
  });
  window.addEventListener("keyup", event => {
    if (running && keyControls[event.code]) event.preventDefault();
    held.delete(event.code);
  });
  window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", () => {
    clearInput();
    previousTime = undefined;
  });

  function controlAt(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - canvas.clientLeft) * canvas.width / canvas.clientWidth;
    const y = (event.clientY - rect.top - canvas.clientTop) * canvas.height / canvas.clientHeight;
    return getPlatformerControls(canvas.width, canvas.height).find(button =>
      x >= button.x && x < button.x + button.width &&
      y >= button.y && y < button.y + button.height)?.control;
  }

  canvas.addEventListener("pointerdown", event => {
    if (!running || event.button !== 0) return;
    const control = controlAt(event);
    if (!control) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    activePointers.add(event.pointerId);
    press(`pointer-${event.pointerId}`, control);
  });
  canvas.addEventListener("pointermove", event => {
    if (!running || !activePointers.has(event.pointerId)) return;
    event.preventDefault();
    const source = `pointer-${event.pointerId}`;
    const control = controlAt(event);
    if (held.get(source) === control) return;
    held.delete(source);
    if (control) press(source, control);
  });
  function releasePointer(event) {
    held.delete(`pointer-${event.pointerId}`);
    activePointers.delete(event.pointerId);
  }
  canvas.addEventListener("pointerup", releasePointer);
  canvas.addEventListener("pointercancel", releasePointer);
  canvas.addEventListener("lostpointercapture", releasePointer);

  function drawControls() {
    const active = new Set(held.values());
    context.fillStyle = "#1d2b35";
    context.fillRect(0, canvas.height - PLATFORMER_HUD_HEIGHT, canvas.width, PLATFORMER_HUD_HEIGHT);
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (const button of getPlatformerControls(canvas.width, canvas.height)) {
      context.fillStyle = active.has(button.control) ? "#67e8f9" : "#06b6d4";
      context.fillRect(button.x, button.y, button.width, button.height);
      context.fillStyle = "#101820";
      context.font = "bold 20px Arial, sans-serif";
      context.fillText(button.label, button.x + button.width / 2, button.y + 19);
      context.font = "12px Arial, sans-serif";
      context.fillText(button.key, button.x + button.width / 2, button.y + 42);
    }
  }

  function drawBlockLabels(cameraX) {
    if (!PLATFORMER_SHOW_BLOCK_LABELS) return;
    context.save();
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height - PLATFORMER_HUD_HEIGHT);
    context.clip();
    context.font = "12px Arial, sans-serif";
    context.textAlign = "left";
    context.textBaseline = "top";
    for (const block of world.blocks) {
      const description = block.state ? `${block.description} (${block.state})` : block.description;
      const left = block.x - cameraX;
      const top = block.y - cameraY;
      if (left + block.width <= 0 || left >= canvas.width ||
          top + block.height <= 0 || top >= canvas.height - PLATFORMER_HUD_HEIGHT) continue;
      const width = Math.min(canvas.width - 16,
        Math.max(context.measureText(block.id).width, context.measureText(description).width) + 12);
      // Keep labels readable even when a long block extends beyond the viewport.
      const x = Math.max(8, Math.min(left + 4, canvas.width - width - 8));
      const y = Math.max(4, top - 38);
      context.fillStyle = "#1d2b35";
      context.fillRect(x, y, width, 34);
      context.fillStyle = "#fff";
      context.fillText(block.id, x + 6, y + 3, width - 12);
      context.fillStyle = "#c5e4ed";
      context.fillText(description, x + 6, y + 18, width - 12);
    }
    context.restore();
  }

  function draw() {
    const player = world.player;
    // Follow horizontal movement only; jumps leave the terrain vertically stable.
    const cameraX = player.x + player.width / 2 - canvas.width / 2;
    context.fillStyle = "#d9eff8";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height - PLATFORMER_HUD_HEIGHT);
    context.clip();
    context.translate(-cameraX, -cameraY);
    context.strokeStyle = "#759184";
    for (const block of world.blocks) {
      const appearance = getPlatformerBlockState(block);
      context.fillStyle = appearance.color;
      if (appearance.tileSet === "fence-open") {
        // Open gate: a narrow post and a swung panel, using temporary rectangles.
        context.fillRect(block.x, block.y, 4, block.height);
        context.fillRect(block.x + 4, block.y + block.height - 8, 48, 8);
        continue;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
      for (let x = block.x; x < block.x + block.width; x += 40) {
        for (let y = block.y; y < block.y + block.height; y += 40) {
          context.strokeRect(x, y, Math.min(40, block.x + block.width - x), Math.min(40, block.y + block.height - y));
        }
      }
    }
    const griffin = world.griffin;
    context.fillStyle = "#dc2626";
    context.fillRect(griffin.x, griffin.y, griffin.width, griffin.height);
    if (player.actionTime > 0) {
      context.fillStyle = "#f8c34f";
      context.fillRect(player.facing > 0 ? player.x + player.width + 6 : player.x - 42, player.y + 10, 36, 36);
    }
    context.save();
    context.globalAlpha = getPlatformerPlayerOpacity(player);
    if (spriteReady) {
      const frame = getPlatformerSpriteFrame(player, animationTime);
      const width = PLATFORMER_SPRITE.frameWidth * PLATFORMER_SPRITE.scale;
      const height = PLATFORMER_SPRITE.frameHeight * PLATFORMER_SPRITE.scale;
      context.save();
      context.imageSmoothingEnabled = false;
      // Anchor every pose at the same feet position without changing collision physics.
      context.translate(player.x + player.width / 2, player.y + player.height);
      if (frame.flip) context.scale(-1, 1);
      context.drawImage(sprite,
        frame.column * PLATFORMER_SPRITE.frameWidth, frame.row * PLATFORMER_SPRITE.frameHeight,
        PLATFORMER_SPRITE.frameWidth, PLATFORMER_SPRITE.frameHeight,
        -width / 2, -height, width, height);
      context.restore();
    } else {
      // Keep the prototype playable while the image loads or if it cannot load.
      context.fillStyle = "#d5364b";
      context.fillRect(player.x, player.y, player.width, player.height);
      context.fillStyle = "#fff";
      context.fillRect(player.x + (player.facing > 0 ? 25 : 5), player.y + 10, 6, 8);
    }
    context.restore();
    context.restore();
    drawBlockLabels(cameraX);
    const destination = getNearbyPlatformerDestination(world);
    if (getNearbyPlatformerFence(world) || destination) {
      context.fillStyle = "#1d2b35";
      context.font = "bold 14px Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "bottom";
      context.fillText(destination ? "Space / Action: Enter home" : "Space / Action: Open fence",
        canvas.width / 2, player.y - cameraY - 24);
    }
    drawControls();
  }

  function frame(time) {
    if (!running) return;
    const dt = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 1 / 30);
    previousTime = time;
    const active = new Set(held.values());
    const blockStateChanged = stepPlatformerWorld(world, {
      left: active.has("left"), right: active.has("right"),
      jump: jumpQueued, jumpHeld: active.has("jump"), action: actionQueued,
    }, dt);
    if (blockStateChanged) onBlockStateChange(getPlatformerBlockStates(world));
    if (dt > 0 && world.hazardHit) onHazardHit(world.hazardHit);
    if (world.requestedScreen) {
      const screen = world.requestedScreen;
      world.requestedScreen = null;
      onDestination(screen);
      // A screen transition can stop this controller inside the callback.
      if (!running) return;
    }
    const player = world.player;
    const nextAnimationState = `${player.facing}:${player.actionTime > 0 ? "action" : !player.grounded ? "jump" : player.vx ? "run" : "idle"}`;
    animationTime = nextAnimationState === animationState ? animationTime + dt : 0;
    animationState = nextAnimationState;
    if (dt > 0) {
      jumpQueued = false;
      actionQueued = false;
    }
    draw();
    frameId = requestAnimationFrame(frame);
  }

  return {
    setJourney(journey) {
      if (!["go-home", "get-to-playground"].includes(journey) || world.journey === journey) return;
      // Both routes share the engine; route-specific layout changes can be added later.
      world = createPlatformerWorld(getPlatformerBlockStates(world), journey);
      clearInput();
      animationTime = 0;
      previousTime = undefined;
    },
    enterFromHome() {
      placePlatformerOutsideHome(world);
      clearInput();
      previousTime = undefined;
    },
    start() {
      if (running) return;
      running = true;
      previousTime = undefined;
      draw();
      frameId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frameId);
      clearInput();
      previousTime = undefined;
    },
  };
}
