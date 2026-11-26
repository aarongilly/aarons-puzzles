// Temporary block course for testing movement; this is not the final level layout.
const PLATFORMER_RUN_SPEED = 280;
const PLATFORMER_RAMP_SECONDS = 0.15;
const PLATFORMER_GRAVITY = 1500;
const PLATFORMER_HELD_JUMP_HEIGHT = 3;
// Frame the starting ground 85% down the viewport; vertical framing stays fixed.
const PLATFORMER_CAMERA_FEET_RATIO = 0.85;
const PLATFORMER_HUD_HEIGHT = 80;
// Temporary development labels; disable when the artwork makes them unnecessary.
const PLATFORMER_SHOW_BLOCK_LABELS = false;
const PLATFORMER_ACTION_REACH = 48;
const PLATFORMER_KNOCKBACK_SPEED = 360;
const PLATFORMER_KNOCKBACK_SECONDS = 0.22;
const PLATFORMER_HURT_SECONDS = 3;
const PLATFORMER_PALETTE_FADE_SECONDS = 0.5;
const PLATFORMER_LANDING_SECONDS = 0.20;
const PLATFORMER_BOSS_PHASES = [
  { speed: 1, fireSeconds: 3 },
  { speed: 1.15, fireSeconds: 2.5 },
  { speed: 1.15 * 1.25, fireSeconds: 2 },
];
const PLATFORMER_BOSS_PROJECTILE_SPEED = 280;
const PLATFORMER_GROUND_BOSS = {
  walkSpeed: PLATFORMER_RUN_SPEED * 1.1, walkSeconds: 1.35,
  jumpHeight: 192, maxLeapSpeed: 500, recoverySeconds: 0.5, hitCooldownSeconds: 1,
};
const PLATFORMER_WIZARD_PROJECTILE_SPEED = 420;
const PLATFORMER_WIZARD_CAST_COOLDOWN = 1;
const PLATFORMER_BOSS_PROJECTILE_SPRITE = {
  src: "assets/sprites-projectile.png", frameWidth: 32, frameHeight: 32,
  framesPerSecond: 10, animations: { idle: { row: 0, frames: 4 } },
};
const PLATFORMER_BOSS_SPRITE = {
  src: "assets/sprites-boss.png", frameWidth: 96, frameHeight: 96,
  framesPerSecond: 10, boundsAnimations: ["idle"],
  animations: {
    idle: { row: 0, frames: 3 }, fire: { row: 1, frames: 1, duration: 0.25 },
    death: { row: 2, frames: 1, loop: false },
  },
};
const PLATFORMER_FIRST_BOSS_SPRITE = {
  ...PLATFORMER_BOSS_SPRITE, src: "assets/sprites-boss-one.png",
  animations: {
    ...PLATFORMER_BOSS_SPRITE.animations,
    leap: { row: 1, frames: 1 },
    recover: { row: 1, startColumn: 1, frames: 1 },
  },
};
const PLATFORMER_JUMPER_SPRITE = {
  src: "assets/sprites-jumper-normal.png", frameWidth: 32, frameHeight: 32,
  framesPerSecond: 10,
  animations: {
    idle: { row: 1, frames: 1 },
    jump: { row: 0, frames: 4 }, fall: { row: 0, frames: 4 },
    hurt: { row: 2, frames: 2 },
  },
};
const PLATFORMER_JUMPER_KNIGHT_SPRITE = {
  ...PLATFORMER_JUMPER_SPRITE, src: "assets/sprites-jumper-knight.png",
};
const PLATFORMER_JUMPER_WIZARD_SPRITE = {
  ...PLATFORMER_JUMPER_SPRITE, src: "assets/sprites-jumper-wizard.png",
};
const PLATFORMER_SPRING_SPRITE = {
  src: "assets/sprites-terrain-normal.png", frameWidth: 64, frameHeight: 32,
  framesPerSecond: 10, allowPartialFrames: true,
  animations: { idle: { row: 3, frames: 1 }, bounce: { row: 3, frames: 3, loop: false } },
};
const PLATFORMER_HAZARD_SPRITE = {
  src: "assets/sprites-terrain-normal.png", frameWidth: 64, frameHeight: 64,
  sourceX: 0, sourceY: 0, autoBounds: false, allowPartialFrames: true,
  framesPerSecond: 2, animations: { idle: { row: 0, frames: 4 } },
};
const PLATFORMER_GROUND_HAZARD_SPRITE = {
  src: "assets/sprites-terrain-normal.png", frameWidth: 32, frameHeight: 32,
  sourceX: 0, sourceY: 0, repeatX: true, autoBounds: false, allowPartialFrames: true,
  framesPerSecond: 2, animations: { idle: { row: 2, frames: 3 } },
};
const PLATFORMER_TERRAIN_SPRITES = {
  normal: { hazard: PLATFORMER_HAZARD_SPRITE, ground: PLATFORMER_GROUND_HAZARD_SPRITE, spring: PLATFORMER_SPRING_SPRITE },
};
for (const theme of ["knight", "wizard"]) {
  const src = `assets/sprites-terrain-${theme}.png`;
  PLATFORMER_TERRAIN_SPRITES[theme] = Object.fromEntries(Object.entries(PLATFORMER_TERRAIN_SPRITES.normal)
    .map(([kind, sprite]) => [kind, { ...sprite, src }]));
}
const PLATFORMER_BULLY_SPRITE = {
  src: "assets/sprites-bully-normal.png", frameWidth: 32, frameHeight: 32,
  framesPerSecond: 10,
  // Contact poses must not enlarge the NPC's established collision/Action shapes.
  boundsAnimations: ["idle", "run", "hurt"],
  animations: {
    idle: { row: 0, frames: 1 }, run: { row: 0, frames: 4 }, hurt: { row: 1, frames: 4 },
    hit: { row: 2, frames: 1, duration: 0.35, loop: false },
    contactPause: { row: 3, frames: 4 },
  },
};
const PLATFORMER_BULLY_KNIGHT_SPRITE = {
  ...PLATFORMER_BULLY_SPRITE,
  src: "assets/sprites-bully-knight.png",
};
const PLATFORMER_BULLY_WIZARD_SPRITE = {
  ...PLATFORMER_BULLY_SPRITE,
  src: "assets/sprites-bully-wizard.png",
};
// Level geometry is authored in 32px units; simulation and canvas coordinates use pixels.
const PLATFORMER_BLOCK_SIZE = 32;
const PLATFORMER_WORLD_WIDTH = 640;
const PLATFORMER_GROUND_Y = 22;
const PLATFORMER_HOME_X = 632;
// Tree placement; the inventory barrier has its own independent X below.
const PLATFORMER_QUEST_START = 235;
const PLATFORMER_QUEST_END = 628;
const PLATFORMER_BOSS_STATES = ["alive", "hit-1", "hit-2", "defeated"];

// Provisional area names and boundaries; independent of the regular/quest theme.
const PLATFORMER_AREAS = [
  { id: "neighborhood", label: "Neighborhood", startX: 0, endX: 140 },
  { id: "transition", label: "The walkway", startX: 140, endX: 172 },
  { id: "quest-1", label: "Quest area 1", startX: 172, endX: 328 },
  { id: "quest-2", label: "Quest area 2", startX: 328, endX: 484 },
  { id: "quest-3", label: "Quest area 3", startX: 484, endX: 562 },
  { id: "boss", label: "Boss area", startX: 562, endX: 626 },
  { id: "home-approach", label: "Home approach", startX: 626, endX: PLATFORMER_WORLD_WIDTH },
];

function getPlatformerArea(x) {
  const unitX = x / PLATFORMER_BLOCK_SIZE;
  return PLATFORMER_AREAS.find(area => unitX >= area.startX && unitX < area.endX);
}

function getPlatformerPlayerOpacity(player) {
  return player.hurtTime > 0 && Math.floor(player.hurtTime / 0.12) % 2 === 0 ? 0.35 : 1;
}

function getPlatformerActionHitbox(player) {
  return { x: player.facing > 0 ? player.x + player.width + 6 : player.x - 42,
    y: player.y + 10, width: 56, height: 36 };
}

function getPlatformerBlockOpacity(block) {
  const flashingTime = Math.max(block.stunTime ?? 0, block.hitCooldown ?? 0);
  return flashingTime > 0 && Math.floor(flashingTime / 0.12) % 2 === 0 ? 0.35 : 1;
}

function getPlatformerBlockState(block) {
  return {
    passable: block.passable ?? false, tileSet: block.tileSet ?? "terrain", color: block.color ?? "#455b50",
    ...block.states?.[block.state],
  };
}

function getPlatformerBlockStates(world) {
  return Object.fromEntries(world.blocks.filter(block => block.states && (!block.dropItem || block.state !== "ready") &&
    !(block.type === "boss" && block.state === "alive") && !((block.dropsStick || block.requiresBossKey) && block.state === "closed") &&
    !(block.type === "griffin-barrier" && block.state !== "dropped"))
    .map(block => [block.id, block.state]));
}

function getNearbyPlatformerBlock(world, matches) {
  const player = world.player;
  return world.blocks.find(block => {
    if (!matches(block)) return false;
    const bounds = block.interactToGround ? { ...block, height: PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - block.y }
      : block.returnBossDetail ? { ...block, width: block.width + (world.inventory.medKit ? block.entranceOffsetX ?? 0 : 0) }
      : getPlatformerBounds(block, "target") ?? getPlatformerBounds(block, "body") ?? block;
    return player.y < bounds.y + bounds.height && player.y + player.height > bounds.y &&
      player.x + player.width >= bounds.x - PLATFORMER_ACTION_REACH &&
      player.x <= bounds.x + bounds.width + PLATFORMER_ACTION_REACH;
  });
}

function getNearbyPlatformerFence(world) {
  return getNearbyPlatformerBlock(world, block => block.type === "fence" &&
    (block.state === "closed" || (block.returnBossDetail &&
      (world.inventory.medKit ? !world.inventory.returnBossKey : block.state.startsWith("return-") && block.state !== "return-open"))));
}

function getNearbyPlatformerDestination(world) {
  return getNearbyPlatformerBlock(world, block => !block.hidden && (block.type === "destination" || Boolean(block.detail)));
}

function getPlatformerBossEntrances(world) {
  if (world.isArena) return [];
  return world.blocks.filter(block => block.detail === "boss-arena" || (block.returnBossDetail && world.inventory.medKit))
    .map(block => ({ block, detail: block.returnBossDetail ?? block.detail,
      keyItem: block.returnBossDetail ? "returnBossKey" : "bossKey",
      x: block.x + block.width / 2 + (block.entranceOffsetX ?? 0) - 32, width: 64 }));
}

function getPlatformerSceneBlocks(world) {
  const holes = getPlatformerBossEntrances(world).filter(entry => world.inventory.stick && !world.inventory[entry.keyItem])
    .sort((a, b) => a.x - b.x);
  if (!holes.length) return world.blocks;
  return world.blocks.flatMap(block => {
    if (block.id !== "ground") return [block];
    const pieces = [];
    let x = block.x;
    for (const hole of holes) {
      if (hole.x < block.x || hole.x + hole.width > block.x + block.width) continue;
      if (hole.x > x) pieces.push({ ...block, x, width: hole.x - x });
      x = hole.x + hole.width;
    }
    if (x < block.x + block.width) pieces.push({ ...block, x, width: block.x + block.width - x });
    return pieces;
  });
}

function isNearPlatformerGriffin(world) {
  return !world.isArena &&
    Boolean(getNearbyPlatformerBlock({ ...world, blocks: [world.griffin] }, () => true));
}

function canGiveGriffinBandaid(world) {
  return world.inventory.medKit === true && !world.inventory.stick && isNearPlatformerGriffin(world);
}

function getPlatformerActionLabel(world) {
  if (world.imagination || world.stickDropPause || world.arenaEscape) return "Wait";
  if (getNearbyPlatformerBossKey(world) || (!world.inventory.stick && getNearbyPlatformerStick(world))) return "Pick up";
  if (canGiveGriffinBandaid(world)) return "Help";
  if (!world.inventory.stick && getNearbyPlatformerBlock(world, block => block.dropItem === "stick" && block.state === "ready")) return "Shake";
  if (world.inventory.medKit && !world.inventory.returnBossKey &&
      getNearbyPlatformerBlock(world, block => block.returnBossDetail)) return "Read";
  const destination = getNearbyPlatformerDestination(world);
  if (destination) return destination.detail === "boss-arena" ? "Read" : destination.detail ? "Inspect" : "Enter";
  if (getNearbyPlatformerFence(world)) return "Open";
  if (isNearPlatformerGriffin(world)) return "Talk";
  return world.inventory.stick ? world.inventory.medKit ? "Cast" : "Attack" : "Action";
}

function canPerformPlatformerAction(world) {
  return !world.imagination && !world.stickDropPause && !world.arenaEscape && !(world.player.hurtTime > 0 || world.player.knockbackTime > 0) &&
    (getPlatformerActionLabel(world) !== "Cast" || world.elapsed + 1e-9 >= (world.castReadyAt ?? 0)) &&
    (world.inventory.stick === true || getPlatformerActionLabel(world) !== "Action");
}

const PLATFORMER_GRIFFIN_SPRITE = {
  src: "assets/sprites-grif.png", frameWidth: 32, frameHeight: 32, scale: 2,
  framesPerSecond: 1, animations: { idle: { row: 0, frames: 2 } },
};

function getPlatformerControls(width, height, arena = false) {
  const y = height - PLATFORMER_HUD_HEIGHT + 12;
  return [
    { control: "left", x: 12, y, width: 64, height: 56, label: "←", key: "A / ←" },
    { control: "right", x: 88, y, width: 64, height: 56, label: "→", key: "D / →" },
    { control: "jump", x: width - 212, y, width: 92, height: 56, label: "Jump", key: "Hold W / ↑" },
    { control: "action", x: width - 108, y, width: 96, height: 56, label: "Action", key: "Space" },
  ];
}

// Ben's normal sheet: 32px cells, with six hurt frames on row 6.
const PLATFORMER_SPRITE = {
  src: "assets/sprites-ben-normal.png",
  frameWidth: 32,
  frameHeight: 32,
  scale: 2,
  framesPerSecond: 10,
  animations: {
    run: { row: 0, frames: 8 },
    jump: { row: 1, frames: 1, loop: false },
    fall: { row: 2, frames: 1, loop: false },
    action: { row: 3, frames: 1, loop: false },
    idle: { row: 4, frames: 1 },
    land: { row: 5, frames: 1, loop: false },
    hurt: { row: 6, frames: 6, loop: false },
    imagine: { row: 7, frames: 1, loop: false },
  },
};

const PLATFORMER_KNIGHT_SPRITE = {
  ...PLATFORMER_SPRITE,
  src: "assets/sprites-ben-knight.png",
  animations: {
    ...PLATFORMER_SPRITE.animations,
    // The body remains in the first 32px; the second half contains sword reach.
    action: { row: 3, frames: 4, frameWidth: 64, framesPerSecond: 16, loop: false },
  },
};

const PLATFORMER_WIZARD_SPRITE = {
  ...PLATFORMER_KNIGHT_SPRITE,
  src: "assets/sprites-ben-wizard.png",
};

// Asset slots can be filled when the matching artwork is ready. Null uses rectangles.
const PLATFORMER_THEMES = {
  regular: { id: "regular", tileSet: "neighborhood", background: "#d9eff8", terrain: "#455b50", grid: "#759184",
    playerColor: "#d5364b", sprite: PLATFORMER_SPRITE, stickSprite: null },
  quest: { id: "quest", tileSet: "quest", background: "#252d50", terrain: "#665477", grid: "#9c88ad",
    playerColor: "#bac5d4", sprite: PLATFORMER_KNIGHT_SPRITE },
  wizard: { id: "wizard", tileSet: "wizard", background: "#27292c", terrain: "#596970", grid: "#84959d",
    hazardColor: "#b76d84", enemyColor: "#82b5bb", springColor: "#b3c97c", fenceColor: "#a9a18b",
    playerColor: "#bac5d4", sprite: PLATFORMER_WIZARD_SPRITE },
};

function getPlatformerTheme(x, inventory = {}) {
  if (inventory.stick === true && inventory.medKit === true) return PLATFORMER_THEMES.wizard;
  // The stick activates imagination immediately, including pickup just left of the tree.
  // The home approach still returns to the ordinary world.
  return inventory.stick === true && x < PLATFORMER_QUEST_END * PLATFORMER_BLOCK_SIZE ? PLATFORMER_THEMES.quest : PLATFORMER_THEMES.regular;
}

function getPlatformerVisualTheme(world) {
  if (world.imagination?.elapsed >= 2) {
    return world.imagination.wizard ? PLATFORMER_THEMES.wizard : PLATFORMER_THEMES.quest;
  }
  return getPlatformerTheme(world.player.x, world.inventory);
}

function mixPlatformerColor(from, to, amount) {
  return "#" + [1, 3, 5].map(offset => {
    const start = parseInt(from.slice(offset, offset + 2), 16);
    const end = parseInt(to.slice(offset, offset + 2), 16);
    return Math.round(start + (end - start) * amount).toString(16).padStart(2, "0");
  }).join("");
}

function getPlatformerAnimationName(player) {
  if (player.imagining) return "imagine";
  if (player.hurtTime > 0) return "hurt";
  if (player.actionTime > 0) return "action";
  if (!player.grounded) return player.vy < 0 ? "jump" : "fall";
  if (player.landTime > 0) return "land";
  return player.vx !== 0 ? "run" : "idle";
}

function getPlatformerSpriteFrame(player, animationTime, sheet = PLATFORMER_SPRITE) {
  const name = getPlatformerAnimationName(player);
  const animation = sheet.animations[name] ?? sheet.animations.idle;
  // These poses follow their actual gameplay timers, including repeated swings.
  if (name === "action") animationTime = 0.25 - player.actionTime;
  if (name === "hurt") animationTime = PLATFORMER_HURT_SECONDS - player.hurtTime;
  const frame = Math.floor(Math.max(0, animationTime) * (animation.framesPerSecond ?? sheet.framesPerSecond));
  const column = animation.loop === false ? Math.min(frame, animation.frames - 1) : frame % animation.frames;
  return { row: animation.row, column, flip: player.facing < 0,
    width: animation.frameWidth ?? sheet.frameWidth, height: animation.frameHeight ?? sheet.frameHeight };
}

function createPlatformerBlockDefinitions() {
  // Explicit authored definitions; keep positions and IDs intact when editing behavior.
  // Coordinates and dimensions are in 32px units. Ground keeps its named ID.
  return [
    { id: "ground", description: "Ground", x: 0, y: 22, width: PLATFORMER_WORLD_WIDTH, height: 6 },
    { id: "01", description: "Spring toy", x: 10, y: 20, width: 2, height: 2 },
    { id: "02", description: "Remember Griffin", type: "griffin-barrier", hidden: true,
      x: 6, y: 0, width: 0.125, height: 28, horizontalOnly: true, state: "inactive",
      states: { inactive: { passable: true }, active: { passable: false }, dropped: { passable: true } } },
    { id: "03", description: "Hazard", type: "hazard", passable: true,
      sprite: PLATFORMER_HAZARD_SPRITE,
      color: "#8b4513", x: 18, y: 20, width: 2, height: 2 },
    { id: "04", description: "Low platform", x: 26, y: 20, width: 6, height: 2 },
    {
      id: "05", description: "Fence", type: "fence", x: 38, y: 16, width: 2, height: 6,
      returnBossDetail: "return-boss-arena", entranceOffsetX: 5,
      state: "closed",
      // Tile-set names will select the actual artwork when tiles are supplied.
      states: {
        closed: { passable: false, tileSet: "fence-closed", color: "#875d3b" },
        open: { passable: true, tileSet: "fence-open", color: "#6b9b77" },
        ...Object.fromEntries(PLATFORMER_BOSS_STATES.map(state => [`return-${state}`,
          { passable: false, tileSet: "fence-closed", color: "#875d3b" }])),
        "return-open": { passable: true, tileSet: "fence-open", color: "#6b9b77" },
      },
    },
    { id: "06", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 48, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "07", color: "green", description: "SPRING", type: "spring", springHeight: 8,
      x: 53, y: 21, width: 2, height: 1, sprite: PLATFORMER_SPRING_SPRITE },
    { id: "08", description: "Wall", x: 57, y: 14, width: 2, height: 8 },
    { id: "09", description: "Step", x: 59, y: 18, width: 2, height: 4 },
    { id: "10", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 66, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      // Limits are offsets from this NPC's starting X; moving X moves its patrol too.
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -4, maxOffsetX: 22, speed: 3.125, direction: 1 } },
    { id: "11", description: "High platform", x: 74, y: 18, width: 6, height: 2 },
    { id: "12", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 84, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      // Offsets preserve the shared patrol while allowing X to relocate it.
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -22, maxOffsetX: 4, speed: 3.125, direction: 1 } },
    { id: "13", description: "Low platform", x: 90, y: 20, width: 4, height: 2 },
    { id: "14", description: "Raised platform", x: 106, y: 18, width: 6, height: 2 },
    { id: "15", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 110, y: 20, width: 14, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 14, height: 0.25 } } },
    { id: "16", description: "Raised platform", x: 116, y: 14, width: 6, height: 2 },
    { id: "17", description: "Wide platform", x: 126, y: 18, width: 6, height: 4 },
    { id: "18", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 136, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      // Patrol between the right edge of platform 17 and the left edge of wall 22.
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -4, maxOffsetX: 17, speed: 3.125, direction: 1 } },
    { id: "19", description: "Platform", x: 140, y: 14, width: 6, height: 1 },
    { id: "20", description: "Platform", x: 150, y: 18, width: 2, height: 2 },
    { id: "21", description: "Platform", x: 150, y: 11, width: 2, height: 2 },
    { id: "22", description: "Wall", x: 155, y: 10, width: 1, height: 12 },
    { id: "23", description: "Platform", x: 156, y: 18, width: 1, height: 1 },
    { id: "24", description: "Platform", x: 156, y: 13, width: 1, height: 1 },
    { id: "25", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 159, y: 20, width: 14, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 14, height: 0.25 } } },
    { id: "26", description: "Platform", x: 164, y: 18, width: 6, height: 1 },
    { id: "27", description: "Low WALL", x: 176, y: 20, width: 4, height: 2 },
    { id: "28", description: "Hazard", type: "hazard", passable: true,
      sprite: PLATFORMER_HAZARD_SPRITE,
      color: "#8b4513", x: 184, y: 20, width: 2, height: 2 },
    { id: "29", description: "Raised platform", x: 196, y: 18, width: 6, height: 2 },
    { id: "30", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 200, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -6, maxOffsetX: 10, speed: 3.125, direction: 1 } },
    { id: "31", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 210, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "32", description: "Low platform", x: 222, y: 20, width: 4, height: 2 },
    { id: "33", description: "Tree", type: "scenery", passable: true,
      x: PLATFORMER_QUEST_START, y: 16, width: 4, height: 6, sprite: { src: null },
      dropItem: "stick", interactToGround: true, state: "ready",
      states: {
        ready: { passable: true, tileSet: "tree" },
        dropped: { passable: true, tileSet: "tree" },
        taken: { passable: true, tileSet: "tree" },
      } },
    { id: "34", description: "Tall wall", x: 248, y: 13, width: 10, height: 7 },
    { id: "35", description: "Stick barrier", type: "stick-barrier", hidden: true,
      x: 250, y: 0, width: 0.125, height: 28, passable: false, horizontalOnly: true },
    { id: "36", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 250, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0, insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: 0, maxOffsetX: 6, speed: 3.125, direction: 1 } },
    { id: "37", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 262, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0, insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "38", description: "Raised platform", x: 266, y: 18, width: 6, height: 2 },
    { id: "39", description: "Platform jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 268, y: 16, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0, insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 16, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "40", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 276, y: 20, width: 4, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 4, height: 0.25 } } },
    { id: "41", description: "Low platform", x: 292, y: 20, width: 6, height: 2 },
    { id: "42", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 304, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "43", description: "Short Platform", x: 309, y: 15, width: 18, height: 1 },
    { id: "44", description: "Short Platform", x: 313, y: 19, width: 20, height: 1 },
    { id: "45", description: "Sword Teacher", type: "hazard", passable: true,
      color: "#f28c28", x: 316, y: 17, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -3, maxOffsetX: 10, speed: 3.125, direction: 1 } },
    { id: "46", description: "Low WALL", x: 332, y: 20, width: 4, height: 2 },
    { id: "47", description: "Hazard", type: "hazard", passable: true,
      sprite: PLATFORMER_HAZARD_SPRITE,
      color: "#8b4513", x: 340, y: 14, width: 2, height: 2 },
    { id: "48", description: "Hazard", type: "hazard", passable: true,
      sprite: PLATFORMER_HAZARD_SPRITE,
      color: "#8b4513", x: 340, y: 21, width: 1, height: 1 },
    { id: "49", description: "Raised platform", x: 352, y: 18, width: 6, height: 2 },
    { id: "50", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 356, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -6, maxOffsetX: 10, speed: 3.125, direction: 1 } },
    { id: "51", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 366, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "52", description: "Low platform", x: 378, y: 20, width: 4, height: 2 },
    { id: "53", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 384, y: 20, width: 6, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 6, height: 0.25 } } },
    { id: "54", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 393, y: 20, width: 6, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 6, height: 0.25 } } },
    { id: "55", description: "Tall wall", x: 402, y: 18, width: 6, height: 4 },
    { id: "56", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 412, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -2, maxOffsetX: 18, speed: 3.125, direction: 1 } },
    { id: "57", description: "Raised platform", x: 422, y: 18, width: 6, height: 2 },
    { id: "58", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 422, y: 16, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 16, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "59", description: "Unwalkable Ground", type: "hazard", passable: true,
      color: "#8b4513", x: 432, y: 20, width: 4, height: 2, groundHazard: true, sprite: PLATFORMER_GROUND_HAZARD_SPRITE,
      bounds: { contact: { x: 0, y: 1.75, width: 4, height: 0.25 } } },
    { id: "60", description: "Low platform", x: 448, y: 20, width: 6, height: 2 },
    { id: "61", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 460, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "62", description: "Low platform", x: 469, y: 3, width: 1, height: 14 },
    { id: "63", description: "Low platform", x: 470, y: 19, width: 27, height: 1 },
    { id: "64", description: "Low platform", x: 470, y: 16, width: 27, height: 1 },
    { id: "65", description: "Low platform", x: 470, y: 13, width: 26, height: 1 },
    { id: "66", description: "Low platform", x: 472, y: 10, width: 28, height: 1 },
    // Disabled hazard at X=496, Y=20 (2×2): retained for future editing.
    // { description: "Hazard", type: "hazard", passable: true, color: "#8b4513", x: 496, y: 20, width: 2, height: 2 },
    { id: "67", description: "Low WALL", x: 496, y: 16, width: 1, height: 3 },
    { id: "68", description: "Low platform", x: 501, y: 18, width: 1, height: 1 },
    { id: "69", description: "Low platform", x: 505, y: 9, width: 1, height: 13 },
    { id: "70", description: "Raised platform", x: 508, y: 18, width: 6, height: 2 },
    { id: "71", color: "green", description: "SPRING", type: "spring", springHeight: 9,
      x: 508, y: 17, width: 2, height: 1, sprite: PLATFORMER_SPRING_SPRITE },
    { id: "72", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 512, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -6, maxOffsetX: 10, speed: 3.125, direction: 1 } },
    { id: "73", description: "Jumping NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 522, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_JUMPER_SPRITE,
      motion: { type: "hop", groundY: 20, jumpHeight: 4, restSeconds: 0.5, elapsed: 0 } },
    { id: "74", description: "Low platform", x: 534, y: 20, width: 4, height: 2 },
    { id: "82", description: "Low platform", x: 544, y: 17, width: 2, height: 1 },
    { id: "83", description: "Low platform", x: 554, y: 19, width: 1, height: 1 },
    
    { id: "89", color: "green", description: "SPRING", type: "spring", springHeight: 9,
      x: 554, y: 18, width: 1, height: 1, sprite: PLATFORMER_SPRING_SPRITE },
    
    { id: "84", description: "Low platform", x: 563, y: 17, width: 2, height: 1 },
    { id: "85", description: "Low platform", x: 567, y: 20, width: 2, height: 2 },

    { id: "86", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 554, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -6, maxOffsetX: 10, speed: 3.125, direction: 1 } },
      { id: "87", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 544, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -6, maxOffsetX: 10, speed: 3.125, direction: 1 } },
      { id: "88", description: "Walking NPC", type: "hazard", passable: true,
      color: "#f28c28", x: 564, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -16, maxOffsetX: 1, speed: 3.125, direction: 1 } },

    { id: "75", description: "Boss placeholder", type: "boss", passable: true,
      color: "#b44770", x: 574, y: 18, width: 4, height: 4, detail: "boss-arena", state: "alive",
      states: Object.fromEntries(PLATFORMER_BOSS_STATES.map(state => [state, { passable: true, tileSet: "boss", color: "#b44770" }])) },
    { id: "76", description: "Tunnel", x: 585, y: 6, width: 18, height: 13 },
    { id: "77", description: "Boss barrier", type: "boss-barrier", hidden: true,
      x: 611, y: 0, width: 0.125, height: 28, passable: false, horizontalOnly: true },
    { id: "78", description: "Final gate", type: "fence", x: 585, y: 19, width: 1, height: 3,
      requiresBossKey: true, state: "closed", states: {
        closed: { passable: false, tileSet: "fence-closed", color: "#875d3b" },
        open: { passable: true, tileSet: "fence-open", color: "#6b9b77" },
      } },
    { id: "79", description: "No sticks in the house", dropsStick: true, type: "gate-barrier", hidden: true,
      x: 625, y: 0, width: 0.125, height: 28, passable: false, horizontalOnly: true,
      state: "closed", states: { closed: {}, open: {} } },
    { id: "80", description: "Last patrol", type: "hazard", passable: true,
      color: "#f28c28", x: 590, y: 20, width: 2, height: 2,
      actionEffect: "stun", stunDuration: 3, stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      sprite: PLATFORMER_BULLY_SPRITE,
      motion: { type: "patrol", minOffsetX: -4, maxOffsetX: 12, speed: 3.125, direction: 1 } },
    { id: "81", description: "Home", type: "destination", targetScreen: "home", passable: true,
      color: "#5475bc", x: PLATFORMER_HOME_X, y: 18, width: 4, height: 4 },
  ];
}

function platformerBlockToPixels(definition) {
  const block = { ...definition };
  for (const key of ["x", "y", "width", "height"]) block[key] *= PLATFORMER_BLOCK_SIZE;
  if (Number.isFinite(block.springHeight)) block.springHeight *= PLATFORMER_BLOCK_SIZE;
  if (Number.isFinite(block.entranceOffsetX)) block.entranceOffsetX *= PLATFORMER_BLOCK_SIZE;
  if (definition.bounds) block.bounds = Object.fromEntries(Object.entries(definition.bounds).map(([kind, rect]) =>
    [kind, rect && Object.fromEntries(["x", "y", "width", "height"].map(key => [key, rect[key] * PLATFORMER_BLOCK_SIZE]))]));
  if (definition.motion) {
    block.motion = { ...definition.motion };
    for (const key of ["groundY", "jumpHeight", "minX", "maxX", "speed"]) {
      if (Number.isFinite(block.motion[key])) block.motion[key] *= PLATFORMER_BLOCK_SIZE;
    }
    if (block.motion.type === "patrol" && Number.isFinite(definition.motion.minOffsetX) && Number.isFinite(definition.motion.maxOffsetX)) {
      block.motion.minX = (definition.x + definition.motion.minOffsetX) * PLATFORMER_BLOCK_SIZE;
      block.motion.maxX = (definition.x + definition.motion.maxOffsetX) * PLATFORMER_BLOCK_SIZE;
    }
  }
  return block;
}

function createPlatformerWorld(blockStates = {}, journey = "go-home", inventory = {}) {
  const groundY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE;
  const world = {
    journey,
    width: PLATFORMER_WORLD_WIDTH * PLATFORMER_BLOCK_SIZE,
    height: 28 * PLATFORMER_BLOCK_SIZE,
    requestedScreen: null,
    hazardHit: null,
    pendingAction: null,
    actionResults: [],
    elapsed: 0,
    inventory,
    stickDrop: null,
    imagination: null,
    stickDropPause: null,
    playerProjectileId: 0,
    pickedUpItem: null,
    removedItem: null,
    message: "",
    messageTime: 0,
    messageSpeech: false,
    griffinDialogueIndex: 0,
    // The player keeps sub-tile pixel coordinates for continuous physics.
    player: { x: 6 * PLATFORMER_BLOCK_SIZE, y: groundY - 56, width: 36, height: 56, vx: 0, vy: 0, grounded: true, facing: 1, actionTime: 0, landTime: 0, jumpHolding: false, jumpStartY: groundY - 56, hurtTime: 0, knockbackTime: 0 },
    griffin: platformerBlockToPixels({ x: -2, y: 20, width: 2, height: 2 }),
    blocks: createPlatformerBlockDefinitions().map(platformerBlockToPixels),
  };
  for (const block of world.blocks) {
    const savedState = blockStates?.[block.id];
    if (block.states && typeof savedState === "string" && Object.hasOwn(block.states, savedState)) {
      block.state = savedState;
    }
  }
  syncPlatformerStick(world);
  if (journey === "get-to-playground") placePlatformerOutsideHome(world);
  return world;
}

function createBossArenaWorld(hits = 0, inventory = {}, bossKeyItem = "bossKey") {
  const world = createPlatformerWorld({}, "go-home", inventory);
  const groundY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE;
  world.isArena = true;
  world.width = 900;
  world.bossHits = Number.isInteger(hits) ? Math.max(0, Math.min(3, hits)) : 0;
  world.bossDefeated = world.bossHits === 3;
  world.bossKeyDrop = null;
  world.stickDrop = null;
  world.bossKeyItem = bossKeyItem;
  const phase = PLATFORMER_BOSS_PHASES[Math.min(world.bossHits, 2)];
  world.bossFireTime = phase.fireSeconds;
  world.bossProjectileId = 0;
  Object.assign(world.player, { x: 450 - world.player.width / 2, y: groundY - 520 + 32,
    vy: 0, grounded: false });
  world.blocks = [
    { id: "ground", description: "Arena floor", x: 0, y: groundY, width: 900, height: 192 },
    { id: "arena-boss", description: "Boss", type: "hazard", passable: true,
      x: 540, y: 400, width: 96, height: 96, sprite: PLATFORMER_BOSS_SPRITE,
      color: "#b44770", actionEffect: "boss-hit", stunTime: 0,
      insets: { contact: 0.15, target: 0.05 },
      motion: { type: "bounce", minX: 32, maxX: 772, minY: groundY - 488, maxY: groundY - 96,
        vx: 190 * phase.speed, vy: 135 * phase.speed } },
    { id: "arena-left", description: "Arena wall", x: 0, y: groundY - 520, width: 32, height: 520 },
    { id: "arena-right", description: "Arena wall", x: 868, y: groundY - 520, width: 32, height: 520 },
    { id: "arena-ceiling-left", description: "Arena ceiling", x: 0, y: groundY - 520, width: 418, height: 32 },
    { id: "arena-ceiling-right", description: "Arena ceiling", x: 482, y: groundY - 520, width: 418, height: 32 },
  ];
  if (bossKeyItem === "bossKey") {
    const boss = world.blocks[1];
    boss.sprite = PLATFORMER_FIRST_BOSS_SPRITE;
    boss.x = 650; boss.y = groundY - boss.height;
    boss.motion = { type: "ground-boss", phase: "walk", remaining: randomGroundBossWalkSeconds(phase.speed),
      minX: 32, maxX: world.width - 32 - boss.width, groundY: boss.y,
      vx: PLATFORMER_GROUND_BOSS.walkSpeed * phase.speed, vy: 0 };
    world.blocks.push(platformerBlockToPixels({
      id: "arena-spring", description: "Arena spring", type: "spring", color: "green",
      x: 18, y: PLATFORMER_GROUND_Y - 1, width: 2, height: 1, springHeight: 8,
      sprite: PLATFORMER_SPRING_SPRITE,
    }));
  }
  if (bossKeyItem === "returnBossKey") world.blocks.push(
    { id: "arena-platform-left", description: "Arena platform", bossBounce: true,
      x: world.width * 0.25 - 32, y: groundY - 128, width: 64, height: 32 },
    { id: "arena-platform-right", description: "Arena platform", bossBounce: true,
      x: world.width * 0.75 - 32, y: groundY - 128, width: 64, height: 32 },
    { id: "arena-platform-upper", description: "Arena platform", bossBounce: true,
      x: world.width * 0.5 - 32, y: groundY - 256, width: 64, height: 32 },
  );
  if (world.bossDefeated) {
    const boss = world.blocks[1];
    boss.type = "defeated"; boss.actionEffect = null; boss.deathTime = 0; boss.motion.vy = 0;
    if (!inventory[bossKeyItem]) dropPlatformerBossKey(world, boss);
  }
  return world;
}

function syncPlatformerStick(world) {
  if (world.inventory.medKit && world.message === "No sticks in the house.") {
    world.message = "";
    world.messageTime = 0;
  }
  const tree = world.blocks.find(block => block.dropItem === "stick");
  const barrier = world.blocks.find(block => block.type === "stick-barrier");
  const finalGate = world.blocks.find(block => block.type === "fence" && block.requiresBossKey);
  const dropPoint = world.blocks.find(block => block.dropsStick);
  const questFinished = finalGate?.state === "open";
  const previousDropState = dropPoint?.state;
  const returnFence = world.blocks.find(block => block.returnBossDetail);
  const previousReturnState = returnFence?.state;
  if (returnFence) {
    if (world.inventory.medKit) {
      if (world.inventory.returnBossKey) returnFence.state = "return-open";
      else if (returnFence.state === "return-open") returnFence.state = "return-defeated";
      else if (!returnFence.state.startsWith("return-")) returnFence.state = "return-alive";
    }
    returnFence.returnBarrierHeight = world.inventory.medKit && !world.inventory.returnBossKey ? world.height : 0;
    returnFence.horizontalOnly = Boolean(returnFence.returnBarrierHeight);
  }
  // Recover the dropped stick for existing saves from before the gate/drop split.
  if (dropPoint && (world.inventory.medKit || (questFinished && !world.inventory.stick))) dropPoint.state = "open";
  const stickLeftAtHouse = dropPoint?.state === "open";
  const griffinBarrier = world.blocks.find(block => block.type === "griffin-barrier");
  if (griffinBarrier) {
    if (world.inventory.medKit && world.inventory.stick) griffinBarrier.state = "active";
    else if (griffinBarrier.state !== "dropped") griffinBarrier.state = "inactive";
  }
  const droppedForGriffin = griffinBarrier?.state === "dropped";
  const boss = world.blocks.find(block => block.type === "boss");
  if (boss) boss.hidden = false;
  for (const block of world.blocks) {
    if (block.type === "boss-barrier") block.passable = world.inventory.bossKey === true || questFinished;
    if (block.type === "gate-barrier") block.passable = world.inventory.medKit === true ||
      (stickLeftAtHouse && !world.inventory.stick);
  }
  if (barrier) barrier.passable = world.inventory.stick === true || questFinished;
  if (!tree) return previousDropState !== dropPoint?.state || previousReturnState !== returnFence?.state;
  const before = tree.state;
  if (world.inventory.stick === true || questFinished || stickLeftAtHouse || droppedForGriffin) {
    tree.state = "taken";
    if (world.inventory.stick) world.stickDrop = null;
    else if ((stickLeftAtHouse || droppedForGriffin) && !world.stickDrop) {
      world.stickDrop = { x: droppedForGriffin ? griffinBarrier.x + 12 : dropPoint.x - 36,
        y: PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - 6,
        width: 24, height: 6, vy: 0, grounded: true, sourceId: droppedForGriffin ? griffinBarrier.id : dropPoint.id };
    }
    if (world.message === "I should get a stick to fight bad guys!") { world.message = ""; world.messageTime = 0; }
  } else if (tree.state === "taken") {
    tree.state = "ready";
    world.stickDrop = null;
  } else if (tree.state === "dropped" && !world.stickDrop) {
    world.stickDrop = { x: tree.x + tree.width / 2 - 12, y: PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - 6,
      width: 24, height: 6, vy: 0, grounded: true };
  }
  return tree.state !== before || previousDropState !== dropPoint?.state || previousReturnState !== returnFence?.state;
}

function setPlatformerMessage(world, text, speech = false) {
  world.message = text;
  world.messageTime = 3;
  world.messageSpeech = speech;
}

function getNearbyPlatformerStick(world) {
  const stick = world.stickDrop;
  const player = world.player;
  return stick?.grounded && player.x + player.width >= stick.x - PLATFORMER_ACTION_REACH &&
    player.x <= stick.x + stick.width + PLATFORMER_ACTION_REACH &&
    player.y < stick.y + stick.height && player.y + player.height >= stick.y ? stick : null;
}

function dropPlatformerBossKey(world, boss) {
  const x = boss.x + boss.width / 2 - 12;
  const y = boss.y + boss.height / 2 - 12;
  const vy = -Math.sqrt(2 * PLATFORMER_GRAVITY * 32);
  const floor = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - 24;
  const seconds = (-vy + Math.sqrt(vy * vy + 2 * PLATFORMER_GRAVITY * Math.max(0, floor - y))) / PLATFORMER_GRAVITY;
  world.bossKeyDrop = { x, y, width: 24, height: 24, vx: (world.width / 2 - 12 - x) / seconds,
    vy, grounded: false };
}

function getNearbyPlatformerBossKey(world) {
  const key = world.bossKeyDrop;
  return key?.grounded && getNearbyPlatformerBlock({ ...world, blocks: [key] }, () => true) ? key : null;
}

function placePlatformerOutsideHome(world) {
  world.imagination = null;
  world.stickDropPause = null;
  world.blocks = world.blocks.filter(block => block.owner !== "player");
  world.player.imagining = false;
  const home = world.blocks.find(block => block.type === "destination" && block.targetScreen === "home");
  Object.assign(world.player, {
    x: home.x - world.player.width - 24, y: home.y + home.height - world.player.height,
    vx: 0, vy: 0, grounded: true, facing: -1, jumpHolding: false, actionTime: 0, landTime: 0, hurtTime: 0, knockbackTime: 0,
  });
  world.player.jumpStartY = world.player.y;
  world.requestedScreen = null;
  world.hazardHit = null;
  world.pendingAction = null;
  world.actionResults = [];
}

function platformerOverlap(a, b) {
  if (!a || !b) return false;
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function reportPlatformerAction(world, effect, targetId = null) {
  if (!world.pendingAction || world.pendingAction.reported) return;
  world.pendingAction.reported = true;
  world.actionResults.push({ effect, targetId, armed: world.pendingAction.armed });
}

function hitPlatformerEnemy(world, block) {
  if (block.stunTime > 0 || block.hitCooldown > 0) return;
  if (block.actionEffect === "stun") {
    block.stunTime = block.stunDuration;
    block.stunFallSpeed = 0;
  } else if (block.actionEffect === "boss-hit") {
    world.bossHits = Math.min(3, world.bossHits + 1);
    world.bossHitsChanged = true;
    block.stunTime = 0.35;
    if (block.motion.type === "ground-boss") block.hitCooldown = PLATFORMER_GROUND_BOSS.hitCooldownSeconds;
    if (world.bossHits === 3) {
      world.actionResults.push({ effect: "boss-defeated", targetId: block.id, armed: false });
      world.bossDefeated = true;
      dropPlatformerBossKey(world, block);
      world.blocks = world.blocks.filter(item => item.motion?.type !== "projectile");
      block.type = "defeated"; block.actionEffect = null;
      block.stunTime = 0; block.hitCooldown = 0; block.deathTime = 0; block.motion.vy = 0;
    } else {
      const phase = PLATFORMER_BOSS_PHASES[world.bossHits];
      const previous = PLATFORMER_BOSS_PHASES[world.bossHits - 1];
      if (block.motion.type === "ground-boss") {
        // Increase pacing difficulty without changing an airborne jump's trajectory.
        if (block.motion.phase === "walk") block.motion.vx *= phase.speed / previous.speed;
      } else {
        block.motion.vx *= phase.speed / previous.speed;
        block.motion.vy *= phase.speed / previous.speed;
      }
      world.bossFireTime = Math.min(world.bossFireTime, phase.fireSeconds);
    }
  }
}

function randomGroundBossWalkSeconds(speed) {
  return PLATFORMER_GROUND_BOSS.walkSeconds * (1 + Math.random()) / speed;
}

function updatePlatformerGroundBoss(world, boss, dt) {
  const motion = boss.motion, config = PLATFORMER_GROUND_BOSS;
  const speed = PLATFORMER_BOSS_PHASES[Math.min(world.bossHits, 2)].speed;
  if (motion.phase === "leap") {
    if (motion.vx) boss.facing = Math.sign(motion.vx);
    boss.x = Math.max(motion.minX, Math.min(motion.maxX, boss.x + motion.vx * dt));
    boss.y += motion.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2;
    motion.vy += PLATFORMER_GRAVITY * dt;
    if (motion.vy > 0 && boss.y >= motion.groundY) {
      boss.y = motion.groundY;
      motion.vx = motion.vy = 0;
      motion.phase = "recover";
      motion.remaining = config.recoverySeconds;
    }
    return;
  }
  motion.remaining -= dt;
  if (motion.phase === "walk") {
    if (motion.vx) boss.facing = Math.sign(motion.vx);
    boss.x += motion.vx * dt;
    if (boss.x < motion.minX || boss.x > motion.maxX) {
      boss.x = Math.max(motion.minX, Math.min(motion.maxX, boss.x));
      motion.vx *= -1;
    }
    if (motion.remaining <= 0) {
      boss.facing = Math.sign(world.player.x + world.player.width / 2 - boss.x - boss.width / 2) || boss.facing || 1;
      const launchSpeed = Math.sqrt(2 * PLATFORMER_GRAVITY * config.jumpHeight);
      const flightSeconds = 2 * launchSpeed / PLATFORMER_GRAVITY;
      // Aim once at takeoff; moving afterward lets the player dodge the landing.
      const targetX = Math.max(motion.minX, Math.min(motion.maxX, world.player.x + world.player.width / 2 - boss.width / 2));
      motion.vx = Math.max(-config.maxLeapSpeed, Math.min(config.maxLeapSpeed, (targetX - boss.x) / flightSeconds));
      motion.vy = -launchSpeed;
      motion.phase = "leap";
      world.actionResults.push({ effect: "boss-jump", targetId: boss.id, armed: false });
      if (motion.vx) boss.facing = Math.sign(motion.vx);
    }
  } else if (motion.phase === "recover" && motion.remaining <= 0) {
    motion.phase = "walk";
    motion.remaining = randomGroundBossWalkSeconds(speed) * (motion.nextWalkMultiplier ?? 1);
    motion.nextWalkMultiplier = 1;
    const away = boss.x + boss.width / 2 < world.player.x + world.player.width / 2 ? -1 : 1;
    motion.vx = away * config.walkSpeed * speed;
  }
}

function updatePlatformerSpells(world) {
  for (const shot of world.blocks.filter(block => block.owner === "player")) {
    if (!world.blocks.includes(shot)) continue;
    const previousX = shot.previousX ?? shot.x;
    const path = { x: Math.min(previousX, shot.x), y: shot.y,
      width: shot.width + Math.abs(shot.x - previousX), height: shot.height };
    let nearest = null;
    let nearestEdge = Infinity;
    for (const block of getPlatformerSceneBlocks(world)) {
      if (block === shot) continue;
      const target = ["stun", "boss-hit"].includes(block.actionEffect) ? getPlatformerBounds(block, "target") : null;
      const bounds = getPlatformerBounds(block, "body") ?? target;
      if (!platformerOverlap(path, bounds)) continue;
      const edge = shot.motion.vx > 0 ? bounds.x : -(bounds.x + bounds.width);
      if (edge < nearestEdge) { nearest = block; nearestEdge = edge; }
    }
    if (nearest) hitPlatformerEnemy(world, nearest);
    if (nearest || shot.x + shot.width < 0 || shot.x > world.width) {
      world.blocks = world.blocks.filter(block => block !== shot);
    }
  }
}

function stepPlatformerWorld(world, input, dt) {
  if (dt <= 0) return;
  world.actionResults = [];
  world.pickedUpItem = null;
  world.removedItem = null;
  world.bossHitsChanged = false;
  world.springBounce = null;
  if (world.arenaEscape) {
    const escape = world.arenaEscape;
    if (escape.completed) return false;
    escape.elapsed += dt;
    const player = world.player;
    const upper = world.blocks.find(block => block.id === "arena-platform-upper");
    const centerX = world.width / 2 - player.width / 2;
    if (upper) {
      const detourX = upper.x - player.width - 16;
      if (player.y + player.height <= upper.y && escape.centerStartedAt === undefined) escape.centerStartedAt = escape.elapsed;
      player.x = escape.centerStartedAt === undefined ?
        escape.x + (detourX - escape.x) * Math.min(1, escape.elapsed / 0.1) :
        detourX + (centerX - detourX) * Math.min(1, (escape.elapsed - escape.centerStartedAt) / 0.18);
    } else player.x = escape.x + (centerX - escape.x) * Math.min(1, escape.elapsed / 0.2);
    player.y += player.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2;
    player.vy += PLATFORMER_GRAVITY * dt;
    player.actionTime = 0;
    if (player.y + player.height <= PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - 520) {
      escape.completed = true;
      world.arenaExitRequested = true;
    }
    return false;
  }
  if (world.imagination) {
    const previousElapsed = world.imagination.elapsed;
    world.imagination.elapsed = Math.min(6, world.imagination.elapsed + dt);
    if (previousElapsed < 2 && world.imagination.elapsed >= 2) {
      world.actionResults.push({ effect: "equip-stick", targetId: world.imagination.sourceId, armed: false, wizard: world.imagination.wizard });
    }
    if (world.imagination.elapsed >= 6) {
      world.imagination = null;
      world.player.imagining = false;
      world.inventory.stick = true;
      world.pickedUpItem = "stick";
      syncPlatformerStick(world);
      return true;
    }
    return false;
  }
  if (world.stickDropPause) {
    const pause = world.stickDropPause;
    pause.elapsed += dt;
    if (pause.elapsed < 3) return false;
    world.stickDropPause = null;
    const block = world.blocks.find(block => block.id === pause.sourceId);
    block.state = block.dropsStick ? "open" : "dropped";
    world.inventory.stick = false;
    world.removedItem = "stick";
    syncPlatformerStick(world);
    return true;
  }
  if (!world.isArena && world.inventory.stick && !(world.player.hurtTime > 0 || world.player.knockbackTime > 0)) {
    const block = getNearbyPlatformerBlock(world, block =>
      world.inventory.medKit ? block.type === "griffin-barrier" : block.dropsStick && world.inventory.bossKey);
    if (block) {
      world.stickDropPause = { elapsed: 0, sourceId: block.id };
      Object.assign(world.player, { vx: 0, vy: 0, actionTime: 0, landTime: 0, jumpHolding: false });
      world.pendingAction = null;
      setPlatformerMessage(world, block.dropsStick ? "No sticks in the house." : "Oh yeah, I'm helping Griffin");
      return false;
    }
  }
  if (world.isArena && world.bossDefeated) {
    const boss = world.blocks.find(block => block.id === "arena-boss");
    boss.deathTime += dt;
    const floorY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - boss.height;
    boss.y = Math.min(floorY, boss.y + boss.motion.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2);
    boss.motion.vy = boss.y < floorY ? boss.motion.vy + PLATFORMER_GRAVITY * dt : 0;
  }
  let blockStateChanged = syncPlatformerStick(world);
  world.messageTime = Math.max(0, world.messageTime - dt);
  if (world.messageTime === 0) world.message = "";
  for (const drop of [world.stickDrop, world.bossKeyDrop]) {
    if (!drop || drop.grounded) continue;
    drop.x += (drop.vx ?? 0) * dt;
    drop.y += drop.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2;
    drop.vy += PLATFORMER_GRAVITY * dt;
    if (drop.y + drop.height >= PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE) {
      drop.y = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - drop.height;
      drop.vy = 0;
      drop.grounded = true;
      if (drop === world.bossKeyDrop) { drop.x = world.width / 2 - drop.width / 2; drop.vx = 0; }
    }
  }
  world.elapsed = (world.elapsed ?? 0) + dt;
  // Motion uses artwork positions; collision and damage use separate local bounds.
  for (const block of world.blocks) {
    if (block.type === "defeated") continue;
    const motion = block.motion;
    if (!motion) continue;
    if (motion.type === "projectile") {
      block.previousX = block.x;
      block.x += motion.vx * dt;
      block.y += motion.vy * dt;
      continue;
    }
    const contactPaused = block.contactPauseTime > 0;
    if (block.hitCooldown > 0) block.hitCooldown = Math.max(0, block.hitCooldown - dt);
    if (contactPaused) block.contactPauseTime = Math.max(0, block.contactPauseTime - dt);
    if (block.stunTime > 0) {
      block.stunTime = Math.max(0, block.stunTime - dt);
      if (motion.type === "hop") {
        // Stop hopping but let an airborne NPC settle naturally onto the ground.
        block.y = Math.min(motion.groundY, block.y + (block.stunFallSpeed || 0) * dt + PLATFORMER_GRAVITY * dt * dt / 2);
        block.stunFallSpeed = block.y < motion.groundY ? (block.stunFallSpeed || 0) + PLATFORMER_GRAVITY * dt : 0;
        motion.elapsed = 2 * Math.sqrt(2 * motion.jumpHeight / PLATFORMER_GRAVITY);
      }
      continue;
    }
    if (contactPaused) continue;
    if (motion.type === "ground-boss") {
      updatePlatformerGroundBoss(world, block, dt);
      continue;
    }
    if (motion.type === "bounce") {
      for (const [axis, velocity, min, max] of [["x", "vx", "minX", "maxX"], ["y", "vy", "minY", "maxY"]]) {
        const previous = block[axis];
        block[axis] += motion[velocity] * dt;
        const other = axis === "x" ? "y" : "x";
        const size = axis === "x" ? "width" : "height";
        const otherSize = axis === "x" ? "height" : "width";
        let boundary = null;
        for (const platform of world.blocks.filter(item => item.bossBounce)) {
          const body = getPlatformerBounds(platform, "body");
          if (!body || block[other] + block[otherSize] <= body[other] || block[other] >= body[other] + body[otherSize]) continue;
          const edge = motion[velocity] > 0 ? body[axis] - block[size] : body[axis] + body[size];
          if (motion[velocity] > 0 && previous <= edge && block[axis] >= edge && (boundary === null || edge < boundary)) boundary = edge;
          if (motion[velocity] < 0 && previous >= edge && block[axis] <= edge && (boundary === null || edge > boundary)) boundary = edge;
        }
        if (boundary !== null) {
          block[axis] = 2 * boundary - block[axis];
          motion[velocity] *= -1;
        }
        while (block[axis] < motion[min] || block[axis] > motion[max]) {
          if (block[axis] > motion[max]) { block[axis] = 2 * motion[max] - block[axis]; motion[velocity] = -Math.abs(motion[velocity]); }
          if (block[axis] < motion[min]) { block[axis] = 2 * motion[min] - block[axis]; motion[velocity] = Math.abs(motion[velocity]); }
        }
      }
      continue;
    }
    if (motion.type === "patrol") {
      block.x += motion.direction * motion.speed * dt;
      // Reflect overshoot so turning preserves the constant speed, even on a slow frame.
      while (block.x < motion.minX || block.x > motion.maxX) {
        if (block.x > motion.maxX) { block.x = 2 * motion.maxX - block.x; motion.direction = -1; }
        if (block.x < motion.minX) { block.x = 2 * motion.minX - block.x; motion.direction = 1; }
      }
      continue;
    }
    if (motion.type !== "hop") continue;
    // A short rest between ballistic hops makes the placeholder's rhythm readable.
    const launchSpeed = Math.sqrt(2 * PLATFORMER_GRAVITY * motion.jumpHeight);
    const flightSeconds = 2 * launchSpeed / PLATFORMER_GRAVITY;
    motion.elapsed = (motion.elapsed + dt) % (flightSeconds + motion.restSeconds);
    const time = Math.min(motion.elapsed, flightSeconds);
    block.y = motion.groundY - Math.max(0, launchSpeed * time - PLATFORMER_GRAVITY * time * time / 2);
  }
  if (world.isArena) {
    const groundY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE;
    world.blocks = world.blocks.filter(block => block.motion?.type !== "projectile" ||
      (block.x + block.width >= 0 && block.x <= world.width && block.y + block.height >= groundY - 520 && block.y <= groundY));
    if (!world.bossDefeated && world.bossKeyItem === "returnBossKey") world.bossFireTime -= dt;
    if (!world.bossDefeated && world.bossKeyItem === "returnBossKey" && world.bossFireTime <= 0) {
      world.actionResults.push({ effect: "boss-fire", targetId: "arena-boss", armed: false });
      world.bossFireTime += PLATFORMER_BOSS_PHASES[Math.min(world.bossHits, 2)].fireSeconds;
      const boss = world.blocks.find(block => block.id === "arena-boss");
      boss.firedAt = world.elapsed;
      const x = boss.x + boss.width / 2, y = boss.y + boss.height / 2;
      const dx = world.player.x + world.player.width / 2 - x;
      const dy = world.player.y + world.player.height / 2 - y;
      const distance = Math.hypot(dx, dy);
      world.blocks.push({ id: `boss-projectile-${++world.bossProjectileId}`, description: "Boss projectile",
        type: "hazard", passable: true, x: x - 16, y: y - 16, width: 32, height: 32, color: "#e6bc52",
        sprite: PLATFORMER_BOSS_PROJECTILE_SPRITE,
        bounds: { contact: { x: 0, y: 0, width: 32, height: 32 } },
        motion: { type: "projectile", vx: distance ? dx / distance * PLATFORMER_BOSS_PROJECTILE_SPEED : PLATFORMER_BOSS_PROJECTILE_SPEED,
          vy: distance ? dy / distance * PLATFORMER_BOSS_PROJECTILE_SPEED : 0 } });
    }
  }
  const player = world.player;
  const wasGrounded = player.grounded;
  player.landTime = Math.max(0, (player.landTime ?? 0) - dt);
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
    const speed = PLATFORMER_RUN_SPEED;
    const acceleration = speed / PLATFORMER_RAMP_SECONDS;
    player.vx = direction * Math.min(speed, Math.abs(player.vx) + acceleration * dt);
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
  const actionAccepted = Boolean(input.action && !controlsLocked && canPerformPlatformerAction(world));
  if (actionAccepted) {
    // A rapid second press finishes an unresolved previous swing as a miss.
    reportPlatformerAction(world, "empty");
    world.pendingAction = { reported: false, armed: world.inventory.stick === true,
      cast: world.inventory.stick && world.inventory.medKit && getPlatformerActionLabel(world) === "Cast" };
    if (world.pendingAction.cast) {
      world.castReadyAt = world.elapsed + PLATFORMER_WIZARD_CAST_COOLDOWN;
      world.blocks.push({ id: `wizard-projectile-${++world.playerProjectileId}`, description: "Magic projectile",
        type: "spell", owner: "player", passable: true,
        x: player.facing > 0 ? player.x + player.width : player.x - 32,
        y: player.y + player.height / 2 - 16, width: 32, height: 32, color: "#e6bc52",
        sprite: PLATFORMER_BOSS_PROJECTILE_SPRITE,
        motion: { type: "projectile", vx: player.facing * PLATFORMER_WIZARD_PROJECTILE_SPEED, vy: 0 } });
      reportPlatformerAction(world, "cast");
    }
  }
  player.actionTime = actionAccepted ? 0.25 : Math.max(0, player.actionTime - dt);
  if (actionAccepted && canGiveGriffinBandaid(world)) {
    world.requestedScreen = "congratulations";
    reportPlatformerAction(world, "give-bandage", "griffin");
    return blockStateChanged;
  }
  if (actionAccepted && isNearPlatformerGriffin(world)) {
    const lines = ["I need medical attention!", "Bring me the med kit!"];
    setPlatformerMessage(world, lines[world.griffinDialogueIndex], true);
    world.griffinDialogueIndex = (world.griffinDialogueIndex + 1) % lines.length;
    reportPlatformerAction(world, "inspect", "griffin");
  }
  if (actionAccepted) {
    if (getNearbyPlatformerBossKey(world)) {
      world.inventory[world.bossKeyItem] = true;
      world.pickedUpItem = world.bossKeyItem;
      world.bossKeyDrop = null;
      world.arenaEscape = { elapsed: 0, x: player.x };
      Object.assign(player, { vx: 0, vy: -Math.sqrt(2 * PLATFORMER_GRAVITY *
        (player.y + player.height - (PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - 520)) + 600 * 600),
        grounded: false, hurtTime: 0, knockbackTime: 0, jumpHolding: false, landTime: 0 });
      reportPlatformerAction(world, "pickup", "boss-key");
      return blockStateChanged;
    }
    const tree = world.blocks.find(block => block.dropItem === "stick");
    if (!world.removedItem && !world.inventory.stick && getNearbyPlatformerStick(world)) {
      const sourceId = world.stickDrop.sourceId ?? tree?.id;
      reportPlatformerAction(world, "pickup", sourceId);
      world.imagination = { elapsed: 0, wizard: world.inventory.medKit === true, sourceId };
      Object.assign(player, { imagining: true, vx: 0, vy: 0, actionTime: 0, landTime: 0, jumpHolding: false });
      world.pendingAction = null;
      world.message = "";
      world.messageTime = 0;
      return blockStateChanged;
    } else if (!world.inventory.stick && tree?.state === "ready" && getNearbyPlatformerBlock(world, block => block === tree)) {
      tree.state = "dropped";
      world.stickDrop = { x: tree.x + tree.width / 2 - 12, y: tree.y, width: 24, height: 6, vy: 0, grounded: false };
      blockStateChanged = true;
      reportPlatformerAction(world, "tree", tree.id);
      setPlatformerMessage(world, "A stick fell from the tree.");
    }
    const fence = world.pickedUpItem === "stick" ? null : getNearbyPlatformerFence(world);
    if (fence?.returnBossDetail && world.inventory.medKit && !world.inventory.returnBossKey) {
      setPlatformerMessage(world, world.inventory.stick ? "Jump into the hole." : "I need a stick before fighting the boss.");
      reportPlatformerAction(world, "inspect", fence.id);
      return blockStateChanged;
    } else if (fence?.requiresBossKey && !world.inventory.bossKey) {
      setPlatformerMessage(world, "I need the boss key to open this gate.");
    } else if (fence && (!fence.requiresStick || world.inventory.stick)) {
      fence.state = "open";
      blockStateChanged = true;
      reportPlatformerAction(world, "gate", fence.id);
      syncPlatformerStick(world);
    } else if (fence?.requiresStick) {
      setPlatformerMessage(world, "I need a stick to open this gate.");
    }
    const destination = getNearbyPlatformerDestination(world);
    if (destination) {
      if (destination.detail === "boss-arena") {
        setPlatformerMessage(world, world.inventory.bossKey ? "Boss defeated!" :
          world.inventory.stick ? "Jump into the hole." : "I need a stick before fighting the boss.");
      } else world.requestedScreen = destination.detail ? { detail: destination.detail } : destination.targetScreen;
      reportPlatformerAction(world, "inspect", destination.id);
    }
  }

  player.x += player.vx * dt;
  for (const block of getPlatformerSceneBlocks(world)) {
    // The house restriction blocks entry; an armed return journey may head left.
    if (block.type === "gate-barrier" && world.player.vx < 0 &&
        world.blocks.some(item => item.dropsStick && item.state === "open")) continue;
    const bounds = getPlatformerBounds(block, "body");
    if (!platformerOverlap(player, bounds)) continue;
    if (player.vx > 0) player.x = bounds.x - player.width;
    if (player.vx < 0) player.x = bounds.x + bounds.width;
    if (block.type === "stick-barrier") setPlatformerMessage(world, "How do I get past these bad guys!?");
    if (block.type === "griffin-barrier") setPlatformerMessage(world, "Oh yeah, I'm helping Griffin");
    if (block.type === "boss-barrier") setPlatformerMessage(world, "I need the boss key for this gate.");
    if (block.returnBarrierHeight && player.vx < 0 && !controlsLocked) {
      if (!world.inventory.stick) setPlatformerMessage(world, "I need a stick before fighting the boss.");
    }
    if (block.type === "gate-barrier") setPlatformerMessage(world,
      world.inventory.stick ? "No sticks in the house." : "I need to open the gate.");
    player.vx = 0;
  }
  const boundedX = Math.max(0, Math.min(world.width - player.width, player.x));
  if (boundedX !== player.x) player.vx = 0;
  player.x = boundedX;

  const previousFeet = player.y + player.height;
  let spring = null;
  player.y += player.vy * dt + PLATFORMER_GRAVITY * dt * dt / 2;
  player.vy += PLATFORMER_GRAVITY * dt;
  player.grounded = false;
  for (const block of getPlatformerSceneBlocks(world)) {
    if (block.horizontalOnly) continue;
    const bounds = getPlatformerBounds(block, "body");
    if (!platformerOverlap(player, bounds)) continue;
    if (player.vy > 0) {
      player.y = bounds.y - player.height;
      player.grounded = true;
      if (block.type === "spring" && previousFeet <= bounds.y && !wasGrounded) spring = block;
    } else if (player.vy < 0) {
      player.y = bounds.y + bounds.height;
    }
    player.vy = 0;
    player.jumpHolding = false;
  }
  if (!controlsLocked && world.inventory.stick && player.vy > 0 && player.y >= PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE) {
    const entry = getPlatformerBossEntrances(world).find(entry => !world.inventory[entry.keyItem] &&
      player.x >= entry.x && player.x + player.width <= entry.x + entry.width);
    if (entry) world.requestedScreen = { detail: entry.detail };
  }
  if (spring) {
    spring.bounceStartedAt = world.elapsed;
    player.vy = -Math.sqrt(2 * PLATFORMER_GRAVITY * spring.springHeight);
    player.grounded = false;
    player.jumpHolding = false;
    world.springBounce = { effect: "bounce", targetId: spring.id, armed: false };
  }
  if (!player.grounded) player.landTime = 0;
  else if (!wasGrounded) player.landTime = PLATFORMER_LANDING_SECONDS;
  for (const block of world.blocks) {
    if (!block.contactRecovery || player.hurtTime > 0) continue;
    const gap = Math.max(block.x - (player.x + player.width), player.x - (block.x + block.width));
    // A cramped patrol cannot repeatedly hurt a trapped player: re-arm only
    // after recovery and a full player-width of horizontal clearance.
    if (gap >= player.width) block.contactRecovery = false;
  }
  if (player.actionTime > 0 && !controlsLocked && world.inventory.stick && world.pendingAction?.armed && !world.pendingAction.cast) {
    const hitbox = getPlatformerActionHitbox(player);
    for (const block of world.blocks) {
      if (!["stun", "boss-hit"].includes(block.actionEffect) || !platformerOverlap(hitbox, getPlatformerBounds(block, "target"))) continue;
      if (block.actionEffect === "boss-hit") {
        if (block.stunTime > 0 || block.hitCooldown > 0 || world.pendingAction.bossHit) continue;
        world.pendingAction.bossHit = true;
      }
      reportPlatformerAction(world, "enemy", block.id);
      hitPlatformerEnemy(world, block);
    }
  }
  updatePlatformerSpells(world);
  if (player.hurtTime === 0) {
    const hazard = world.blocks.find(block => block.type === "hazard" && !(block.stunTime > 0) &&
      !(block.motion?.type === "ground-boss" && block.motion.phase === "recover") &&
      !block.contactRecovery && platformerOverlap(getPlatformerPlayerContact(player), getPlatformerBounds(block, "contact")));
    if (hazard) {
      // Capture the player's side before knockback changes either facing or X.
      if (hazard.motion?.type === "patrol") hazard.hitFlip = player.x <= hazard.x;
      // Separate first, then launch backwards; the brief control lock prevents
      // held movement from cancelling the bounce on the next frame.
      const bounds = getPlatformerBounds(hazard, "contact");
      player.x = travelDirection > 0 ? bounds.x - player.width - 1 : bounds.x + bounds.width + 1;
      player.x = Math.max(0, Math.min(world.width - player.width, player.x));
      player.vx = -travelDirection * PLATFORMER_KNOCKBACK_SPEED;
      player.vy = -260;
      player.grounded = false;
      player.jumpHolding = false;
      player.actionTime = 0;
      player.landTime = 0;
      player.knockbackTime = PLATFORMER_KNOCKBACK_SECONDS;
      player.hurtTime = PLATFORMER_HURT_SECONDS;
      if (hazard.motion?.type === "ground-boss") {
        // Give Ben a longer interval before the next leap after being hurt.
        if (hazard.motion.phase === "walk") {
          const speed = PLATFORMER_BOSS_PHASES[Math.min(world.bossHits, 2)].speed;
          hazard.motion.remaining = 2 * randomGroundBossWalkSeconds(speed);
        } else hazard.motion.nextWalkMultiplier = 2;
      }
      if (hazard.motion?.type === "patrol") {
        hazard.contactPauseTime = PLATFORMER_HURT_SECONDS;
        hazard.contactRecovery = true;
        // After the shared pause, retreat from the player's knockback position.
        hazard.motion.direction = player.x + player.width / 2 < hazard.x + hazard.width / 2 ? 1 : -1;
      }
      world.requestedScreen = null;
      world.hazardHit = { blockId: hazard.id };
      if (hazard.motion?.type === "projectile") world.blocks = world.blocks.filter(block => block !== hazard);
    }
  }
  if (player.actionTime === 0 && world.pendingAction) {
    reportPlatformerAction(world, "empty");
    world.pendingAction = null;
  }
  return blockStateChanged;
}

function createPlatformer(canvas, {
  blockStates = {}, inventory = {}, position = null, onPositionChange = () => {}, arena = false, bossHits = 0, bossKeyItem = "bossKey", onBossProgress = () => {}, onStepBack = () => {},
  onBlockStateChange = () => {}, onDestination = () => {}, onHazardHit = () => {}, onAction = () => {}, onSpringBounce = () => {}, onPickup = () => {}, onItemRemoved = () => {}, onPlayerPosition = () => {},
} = {}) {
  const context = canvas.getContext("2d");
  const savedJourney = ["go-home", "get-to-playground"].includes(position?.journey) ? position.journey : "go-home";
  let world = arena ? createBossArenaWorld(bossHits, inventory, bossKeyItem) : createPlatformerWorld(blockStates, savedJourney, inventory);
  if (!arena && Number.isFinite(position?.x) && Number.isFinite(position?.y)) {
    Object.assign(world.player, {
      x: Math.max(0, Math.min(world.width - world.player.width, position.x)),
      y: Math.max(0, Math.min(world.height - world.player.height, position.y)),
      facing: position.facing === -1 ? -1 : 1, grounded: false,
    });
    world.player.jumpStartY = world.player.y;
  }
  let positionSaveTime = 0;
  let lastSavedPosition = "";
  function savePosition() {
    if (world.isArena) return;
    const { x, y, facing } = world.player;
    const state = { journey: world.journey, x, y, facing };
    const serialized = JSON.stringify(state);
    if (serialized === lastSavedPosition) return;
    lastSavedPosition = serialized;
    onPositionChange(state);
  }
  window.addEventListener("pagehide", savePosition);
  const cameraY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - canvas.height * PLATFORMER_CAMERA_FEET_RATIO;
  const held = new Map();
  const activePointers = new Set();
  const keyControls = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "jump", KeyW: "jump", Space: "action" };
  let jumpQueued = false;
  let actionQueued = false;
  let gamepadNeedsNeutral = true;
  let previousGamepad = new Set();
  let running = false;
  let frameId;
  let previousTime;
  let animationTime = 0;
  let animationState = "";
  let showBounds = false;
  let palette = { ...getPlatformerVisualTheme(world) };
  let paletteStart = { ...palette };
  let paletteTarget = palette.id;
  let paletteElapsed = PLATFORMER_PALETTE_FADE_SECONDS;
  // Decorative only: move at a fraction of the camera speed, independently of physics.
  const backgrounds = world.isArena ? [] : [
    { theme: "regular", src: "assets/background-normal.webp" },
    { theme: "quest", src: "assets/background-knight.webp" },
    { theme: "wizard", src: "assets/background-wizard.webp" },
  ];
  let backgroundCanvas;
  for (const background of backgrounds) {
    const image = new Image();
    background.image = image;
    background.ready = false;
    background.opacity = palette.id === background.theme ? 1 : 0;
    image.addEventListener("load", () => {
      background.ready = image.naturalWidth > 0 && image.naturalHeight > 0;
      if (running) draw();
    });
    image.src = background.src;
  }
  const sprites = new Map();
  for (const sheet of [PLATFORMER_GRIFFIN_SPRITE, ...Object.values(PLATFORMER_THEMES).flatMap(theme => [theme.sprite, theme.stickSprite])]) {
    if (!sheet || sprites.has(sheet.src)) continue;
    const image = new Image();
    const record = { image, ready: false };
    sprites.set(sheet.src, record);
    image.addEventListener("load", () => {
      const animations = Object.values(sheet.animations);
      const width = Math.max(...animations.map(animation => (animation.frameWidth ?? sheet.frameWidth) * animation.frames));
      const height = Math.max(...animations.map(animation => animation.row * sheet.frameHeight + (animation.frameHeight ?? sheet.frameHeight)));
      record.ready = image.naturalWidth >= width && image.naturalHeight >= height;
      if (running) draw();
    });
    image.src = sheet.src;
  }
  const entitySprites = new Map();
  // Preload projectiles and enemy variants before gameplay first needs them.
  const spriteEntities = [...world.blocks, { sprite: PLATFORMER_BOSS_PROJECTILE_SPRITE },
    ...Object.values(PLATFORMER_TERRAIN_SPRITES).flatMap(sprites => Object.values(sprites).map(sprite => ({ sprite }))), ...(arena ? [] :
    [{ sprite: PLATFORMER_BULLY_KNIGHT_SPRITE }, { sprite: PLATFORMER_BULLY_WIZARD_SPRITE },
      { sprite: PLATFORMER_JUMPER_KNIGHT_SPRITE }, { sprite: PLATFORMER_JUMPER_WIZARD_SPRITE }])];
  for (const block of spriteEntities) {
    const src = block.sprite?.src;
    if (!src || entitySprites.has(src)) continue;
    const image = new Image();
    const record = { image, ready: false };
    entitySprites.set(src, record);
    const sheets = [...new Set(spriteEntities.filter(entity => entity.sprite?.src === src).map(entity => entity.sprite))];
    image.addEventListener("load", () => {
      record.ready = image.naturalWidth > 0 && image.naturalHeight > 0 && sheets.every(sheet => {
        const animations = Object.values(sheet.animations ?? { idle: { row: 0, frames: 1 } });
        const width = sheet.frameWidth ?? image.naturalWidth;
        const height = sheet.frameHeight ?? image.naturalHeight;
        // Trimmed atlas exports can omit transparent pixels at the right edge.
        const requiredWidth = (sheet.sourceX ?? 0) + width * Math.max(...animations.map(item => (item.startColumn ?? 0) + item.frames)) -
          (sheet.allowPartialFrames ? width - 1 : 0);
        return image.naturalWidth >= requiredWidth &&
          image.naturalHeight >= (sheet.sourceY ?? 0) + height * (Math.max(...animations.map(item => item.row)) + 1);
      });
      if (!record.ready) return;
      for (const entity of world.blocks.filter(item => item.sprite?.src === src)) applySpriteBounds(entity, record);
      if (running) draw();
    });
    image.src = src;
  }

  function applySpriteBounds(block, record) {
    // Spring artwork compresses; its authored landing surface stays fixed.
    if (block.type === "spring" || block.sprite.autoBounds === false) return;
    record.bounds ??= new WeakMap();
    if (!record.bounds.has(block.sprite)) record.bounds.set(block.sprite, readPlatformerSpriteBounds(record.image, block.sprite));
    const alpha = record.bounds.get(block.sprite);
    if (alpha === undefined) return;
    block.autoBounds = alpha && { x: alpha.x * block.width, y: alpha.y * block.height,
      width: alpha.width * block.width, height: alpha.height * block.height };
  }

  function terrainCellIsEmpty(record, sprite, frame) {
    const sourceX = (sprite.sourceX ?? 0) + frame.column * sprite.frameWidth;
    const sourceY = (sprite.sourceY ?? 0) + frame.row * sprite.frameHeight;
    const key = `${sourceX}:${sourceY}:${sprite.frameWidth}:${sprite.frameHeight}`;
    record.emptyCells ??= new Map();
    if (!record.emptyCells.has(key)) record.emptyCells.set(key, readPlatformerSpriteBounds(record.image, {
      frameWidth: sprite.frameWidth, frameHeight: sprite.frameHeight, sourceX, sourceY,
    }) === null);
    return record.emptyCells.get(key);
  }

  function drawBounds() {
    if (!showBounds) return;
    const outline = (rect, color) => {
      if (!rect) return;
      context.strokeStyle = color;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    };
    for (const block of getPlatformerSceneBlocks(world)) {
      outline(block, "#22d3ee");
      outline(getPlatformerBounds(block, "body"), "#22c55e");
      outline(getPlatformerBounds(block, "contact"), "#ef4444");
      outline(getPlatformerBounds(block, "target"), "#facc15");
    }
    outline(world.player, "#22c55e");
    outline(getPlatformerPlayerContact(world.player), "#ef4444");
    const theme = getPlatformerVisualTheme(world);
    const sheet = inventory.stick && theme.stickSprite ? theme.stickSprite : theme.sprite;
    if (sheet) {
      const frame = getPlatformerSpriteFrame(world.player, animationTime, sheet);
      const anchor = sheet.frameWidth * sheet.scale / 2;
      const centerX = world.player.x + world.player.width / 2;
      outline({ x: frame.flip ? centerX + anchor - frame.width * sheet.scale : centerX - anchor,
        y: world.player.y + world.player.height - frame.height * sheet.scale,
        width: frame.width * sheet.scale, height: frame.height * sheet.scale }, "#22d3ee");
    }
    if (world.player.actionTime > 0) outline(getPlatformerActionHitbox(world.player), "#c084fc");
  }

  function press(source, control) {
    if (world.imagination || world.stickDropPause) return;
    if (control === "action" && !canPerformPlatformerAction(world)) return;
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
    gamepadNeedsNeutral = true;
    previousGamepad.clear();
  }

  window.addEventListener("keydown", event => {
    if (!running || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.("input, textarea, select, [contenteditable]")) return;
    if (world.isArena && event.code === "Escape") { event.preventDefault(); return; }
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
    return getPlatformerControls(canvas.width, canvas.height, world.isArena).find(button =>
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
    context.fillStyle = "#ffffff";
    context.font = "bold 18px Arial, sans-serif";
    if (world.imagination) {
      context.fillText(world.imagination.elapsed < 2 ? "This isn't a stick..." :
        world.imagination.wizard ? "it's a MAGIC WAND!" : "it's a SWORD!", canvas.width / 2, canvas.height - 40, 480);
    } else if (world.isArena) {
      context.fillText(world.message || "", canvas.width / 2, canvas.height - 58, 480);
    } else if (world.message) {
      if (world.messageSpeech) {
        context.fillStyle = "#ffffff";
        context.fillRect(canvas.width / 2 - 145, canvas.height - 62, 290, 44);
        // A stepped tail keeps the speech bubble in the game's pixel-art style.
        context.fillRect(canvas.width / 2 - 125, canvas.height - 18, 12, 6);
        context.fillRect(canvas.width / 2 - 125, canvas.height - 12, 6, 6);
        context.fillStyle = "#1d2b35";
      }
      context.fillText(world.message, canvas.width / 2, canvas.height - 40, 480);
    }
    for (const button of getPlatformerControls(canvas.width, canvas.height, world.isArena)) {
      const disabled = Boolean(world.imagination || world.stickDropPause) || (button.control === "action" && !canPerformPlatformerAction(world));
      context.fillStyle = disabled ? "#647078" : active.has(button.control) ? "#67e8f9" : "#06b6d4";
      context.fillRect(button.x, button.y, button.width, button.height);
      context.fillStyle = disabled ? "#c4cbd0" : "#101820";
      if (button.control === "back") {
        context.font = "bold 16px Arial, sans-serif";
        context.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2);
        continue;
      }
      context.font = "bold 20px Arial, sans-serif";
      context.fillText(button.control === "action" ? getPlatformerActionLabel(world) : button.label,
        button.x + button.width / 2, button.y + 19);
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
      if (block.hidden) continue;
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

  function bossArtwork(record) {
    const hits = Math.max(0, Math.min(3, world.bossHits));
    if (!hits) return record.image;
    record.shades ??= new Map();
    if (!record.shades.has(hits)) {
      // Tint the source sheet once per hit count, preserving its alpha and poses.
      // Canvas compositing also works in browsers without canvas filter support.
      const shade = document.createElement("canvas");
      shade.width = record.image.naturalWidth;
      shade.height = record.image.naturalHeight;
      const tint = shade.getContext("2d");
      tint.drawImage(record.image, 0, 0);
      tint.globalCompositeOperation = "source-atop";
      tint.fillStyle = `rgba(0, 0, 0, ${hits * 0.15})`;
      tint.fillRect(0, 0, shade.width, shade.height);
      record.shades.set(hits, shade);
    }
    return record.shades.get(hits);
  }

  function drawHouse(block) {
    context.save();
    context.globalAlpha = 1;
    context.translate(block.x, block.y);
    context.scale(block.width / 128, block.height / 128);
    // A small clapboard house, drawn in the same stepped style as the gate/tree.
    context.fillStyle = "#c9ac7a";
    context.fillRect(8, 44, 112, 80);
    context.fillStyle = "#ead5a8";
    context.fillRect(8, 44, 106, 74);
    context.fillStyle = "#d5bb8d";
    for (let y = 54; y < 118; y += 12) context.fillRect(12, y, 102, 2);
    // Brick chimney sits behind the overhanging, stepped roof.
    context.fillStyle = "#925944";
    context.fillRect(92, 8, 16, 32);
    context.fillStyle = "#bd8060";
    context.fillRect(90, 6, 20, 6);
    context.fillStyle = "#593e39";
    for (let row = 0; row < 8; row++) context.fillRect(56 - row * 8, 4 + row * 6, 16 + row * 16, 6);
    context.fillStyle = "#a25f49";
    for (let row = 0; row < 7; row++) context.fillRect(58 - row * 8, 6 + row * 6, 12 + row * 16, 4);
    context.fillStyle = "#f7e6c2";
    context.fillRect(8, 52, 4, 66);
    context.fillRect(114, 52, 6, 66);
    // Two bright windows with cream frames, crossbars, and projecting sills.
    for (const x of [20, 84]) {
      context.fillStyle = "#785e49";
      context.fillRect(x - 2, 64, 28, 34);
      context.fillStyle = "#f7e6c2";
      context.fillRect(x, 64, 24, 30);
      context.fillStyle = "#81b6c3";
      context.fillRect(x + 3, 67, 18, 24);
      context.fillStyle = "#bddbe0";
      context.fillRect(x + 3, 67, 8, 10);
      context.fillStyle = "#f7e6c2";
      context.fillRect(x + 10, 67, 3, 24);
      context.fillRect(x + 3, 77, 18, 3);
      context.fillRect(x - 3, 94, 30, 4);
    }
    context.fillStyle = "#f7e6c2";
    context.fillRect(49, 62, 30, 56);
    context.fillStyle = "#537b72";
    context.fillRect(53, 66, 22, 52);
    context.fillStyle = "#3d625c";
    context.fillRect(57, 72, 14, 18);
    context.fillRect(57, 96, 14, 16);
    context.fillStyle = "#e6bc52";
    context.fillRect(69, 93, 3, 3);
    context.fillStyle = "#85786b";
    context.fillRect(8, 118, 112, 10);
    context.fillStyle = "#b9ad98";
    context.fillRect(45, 118, 38, 5);
    context.fillRect(41, 123, 46, 5);
    context.restore();
  }

  function draw(dt = 0) {
    const player = world.player;
    onPlayerPosition({ x: player.x, y: player.y });
    const theme = getPlatformerVisualTheme(world);
    if (theme.id !== paletteTarget) {
      // Reverse smoothly from the current colors if the player crosses back mid-fade.
      paletteStart = { ...palette };
      paletteTarget = theme.id;
      paletteElapsed = 0;
    }
    paletteElapsed = Math.min(PLATFORMER_PALETTE_FADE_SECONDS, paletteElapsed + dt);
    const progress = paletteElapsed / PLATFORMER_PALETTE_FADE_SECONDS;
    const blend = progress * progress * (3 - 2 * progress);
    for (const key of ["background", "terrain", "grid"]) palette[key] = mixPlatformerColor(paletteStart[key], theme[key], blend);
    const sheet = inventory.stick && theme.stickSprite ? theme.stickSprite : theme.sprite;
    const sprite = sheet && sprites.get(sheet.src);
    let patrolSprite = PLATFORMER_BULLY_SPRITE;
    let jumperSprite = PLATFORMER_JUMPER_SPRITE;
    let terrainSprites = PLATFORMER_TERRAIN_SPRITES.normal;
    if (world.imagination ? world.imagination.elapsed >= 2 : inventory.stick) {
      const wizard = world.imagination?.wizard ?? inventory.medKit;
      patrolSprite = wizard ? PLATFORMER_BULLY_WIZARD_SPRITE : PLATFORMER_BULLY_KNIGHT_SPRITE;
      jumperSprite = wizard ? PLATFORMER_JUMPER_WIZARD_SPRITE : PLATFORMER_JUMPER_KNIGHT_SPRITE;
      terrainSprites = PLATFORMER_TERRAIN_SPRITES[wizard ? "wizard" : "knight"];
    }
    // Follow horizontal movement only; jumps leave the terrain vertically stable.
    const cameraX = world.isArena ? 0 : player.x + player.width / 2 - canvas.width / 2;
    context.fillStyle = palette.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height - PLATFORMER_HUD_HEIGHT);
    context.clip();
    const backgroundStep = dt / PLATFORMER_PALETTE_FADE_SECONDS;
    for (const background of backgrounds) {
      const backgroundTarget = theme.id === background.theme ? 1 : 0;
      background.opacity += Math.max(-backgroundStep, Math.min(backgroundStep, backgroundTarget - background.opacity));
      if (!background.ready || background.opacity <= 0) continue;
      const image = background.image;
      const height = canvas.height - PLATFORMER_HUD_HEIGHT;
      const width = image.naturalWidth * height / image.naturalHeight;
      const offset = cameraX * 0.15;
      const first = Math.floor(offset / width);
      if (!backgroundCanvas) {
        backgroundCanvas = document.createElement("canvas");
        backgroundCanvas.width = canvas.width;
        backgroundCanvas.height = height;
      }
      const backdrop = backgroundCanvas.getContext("2d");
      backdrop.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      backdrop.imageSmoothingEnabled = true;
      // Assemble opaque tiles first; fading individual overlaps darkens their seams.
      // Alternate mirrored tiles so both edges meet without a hard repeat seam.
      for (let tile = first; tile * width - offset < canvas.width; tile++) {
        const x = tile * width - offset;
        backdrop.save();
        backdrop.translate(x + (tile % 2 ? width : 0), 0);
        backdrop.scale(tile % 2 ? -1 : 1, 1);
        // Cover fractional-pixel edges so smoothing cannot expose a thin seam.
        backdrop.drawImage(image, -1, 0, width + 2, height);
        backdrop.restore();
      }
      context.save();
      context.globalAlpha = background.opacity;
      context.drawImage(backgroundCanvas, 0, 0);
      context.restore();
    }
    context.translate(-cameraX, -cameraY);
    context.strokeStyle = palette.grid;
    if (!world.isArena && cameraX + canvas.width > world.width) {
      // Continue the scenery past Home without expanding Ben's movement bounds.
      const groundY = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE;
      context.fillStyle = palette.terrain;
      context.fillRect(world.width, groundY, cameraX + canvas.width - world.width, world.height - groundY);
    }
    if (!world.isArena && cameraX < 0) {
      const unit = PLATFORMER_BLOCK_SIZE;
      const left = Math.floor(cameraX / unit) * unit;
      const groundY = PLATFORMER_GROUND_Y * unit;
      // Decorative terrain continues beyond Ben's X=0 movement boundary.
      context.fillStyle = palette.terrain;
      context.fillRect(left, groundY, -left, world.height - groundY);
      // Griffin is at X=-2: the five-unit slope ends immediately to his left.
      // Farther left the hilltop stays level at Y=18.
      context.fillStyle = "#54834d";
      context.beginPath();
      context.moveTo(Math.min(left, -7 * unit), 18 * unit);
      context.lineTo(-7 * unit, 18 * unit);
      context.lineTo(-2 * unit, groundY);
      context.lineTo(Math.min(left, -7 * unit), groundY);
      context.closePath();
      context.fill();
    }
    for (const block of getPlatformerSceneBlocks(world)) {
      if (block.hidden) continue;
      if (block.type === "destination" && block.targetScreen === "home" && !block.sprite?.src) {
        // Enlarge the artwork around its grounded front door, independently of entry geometry.
        const house = { ...block, width: block.width * 3, height: block.height * 3,
          x: block.x - block.width, y: block.y - block.height * 2 };
        if (house.x + house.width >= cameraX && house.x <= cameraX + canvas.width) drawHouse(house);
        continue;
      }
      if (block.x + block.width < cameraX || block.x > cameraX + canvas.width) continue;
      if (block.id === "05" || block.id === "78") {
        const open = getPlatformerBlockState(block).passable;
        const wood = theme.id === "wizard" ? theme.fenceColor : "#a47a4f";
        context.save();
        context.globalAlpha = 1;
        context.translate(block.x, block.y);
        // Fixed posts surround a slatted gate; opening turns the panel edge-on.
        context.fillStyle = "#60432d";
        context.fillRect(0, 4, 6, block.height - 4);
        context.fillRect(block.width - 6, 4, 6, block.height - 4);
        context.fillStyle = wood;
        context.fillRect(1, 0, 4, block.height);
        context.fillRect(block.width - 5, 0, 4, block.height);
        context.save();
        context.translate(6, 12);
        context.scale(open ? 0.2 : 1, 1);
        const panelWidth = block.width - 12;
        const panelHeight = block.height - 20;
        context.fillStyle = "#60432d";
        for (const y of [panelHeight * 0.28, panelHeight * 0.72]) context.fillRect(0, y, panelWidth, 8);
        for (let i = 0; i < 3; i++) {
          const x = i * (panelWidth - 4) / 2;
          context.fillStyle = wood;
          context.fillRect(x, 3, 4, panelHeight - 3);
          context.fillRect(x + 1, 0, 2, 3);
          context.fillStyle = "#c6a078";
          context.fillRect(x, 5, 1, panelHeight - 7);
        }
        context.restore();
        context.fillStyle = "#d1b36a";
        for (const y of [block.height * 0.3, block.height * 0.7]) context.fillRect(4, y, 4, 4);
        context.restore();
        if (!world.inventory.medKit || !block.returnBossDetail) continue;
      }
      const entry = getPlatformerBossEntrances(world).find(entry => entry.block === block);
      if (entry && !block.sprite?.src) {
        const center = entry.x + 32;
        const y = PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE;
        context.fillStyle = "#875d3b";
        context.fillRect(center - 3, y - 64, 6, 64);
        context.fillStyle = world.inventory[entry.keyItem] ? "#477e54" : "#b44770";
        context.fillRect(center - 62, y - 94, 124, 32);
        context.fillStyle = "#fff";
        context.font = "bold 14px Arial, sans-serif";
        context.textAlign = "center";
        context.fillText(world.inventory[entry.keyItem] ? "Boss defeated" : "Monster below", center, y - 73);
        continue;
      }
      const appearance = getPlatformerBlockState(block);
      context.fillStyle = appearance.tileSet === "terrain" && !block.color ? palette.terrain : appearance.color;
      if (theme.id === "wizard") {
        if (block.type === "hazard") context.fillStyle = block.actionEffect ? theme.enemyColor : theme.hazardColor;
        if (block.type === "spring") context.fillStyle = theme.springColor;
        if (block.type === "fence") context.fillStyle = theme.fenceColor;
      }
      context.globalAlpha = getPlatformerBlockOpacity(block);
      let displaySprite = block.sprite;
      if (block.motion?.type === "patrol" && block.sprite === PLATFORMER_BULLY_SPRITE) displaySprite = patrolSprite;
      if (block.motion?.type === "hop" && block.sprite === PLATFORMER_JUMPER_SPRITE) displaySprite = jumperSprite;
      if (block.sprite === PLATFORMER_HAZARD_SPRITE) displaySprite = terrainSprites.hazard;
      if (block.sprite === PLATFORMER_GROUND_HAZARD_SPRITE) displaySprite = terrainSprites.ground;
      if (block.sprite === PLATFORMER_SPRING_SPRITE) displaySprite = terrainSprites.spring;
      let artwork = entitySprites.get(displaySprite?.src)?.ready ? entitySprites.get(displaySprite.src) :
        entitySprites.get(block.sprite?.src);
      let frame = getPlatformerEntityFrame(block, world.elapsed, displaySprite);
      if (artwork?.ready && displaySprite?.allowPartialFrames && terrainCellIsEmpty(artwork, displaySprite, frame)) {
        // Work-in-progress skins may have only frame zero, or omit a whole row.
        const first = { ...frame, column: 0 };
        if (!terrainCellIsEmpty(artwork, displaySprite, first)) frame = first;
        else {
          displaySprite = block.sprite;
          artwork = entitySprites.get(displaySprite.src);
          frame = getPlatformerEntityFrame(block, world.elapsed, displaySprite);
          if (artwork?.ready && terrainCellIsEmpty(artwork, displaySprite, frame)) frame = { ...frame, column: 0 };
        }
      }
      if (artwork?.ready) {
        const width = displaySprite.frameWidth ?? artwork.image.naturalWidth;
        const height = displaySprite.frameHeight ?? artwork.image.naturalHeight;
        const sourceX = (displaySprite.sourceX ?? 0) + frame.column * width;
        const sourceY = (displaySprite.sourceY ?? 0) + frame.row * height;
        context.save();
        context.imageSmoothingEnabled = false;
        if (displaySprite.repeatX) {
          // Repeat square ground art at the authored strip height, cropping the last tile.
          const tileWidth = block.height * width / height;
          const first = Math.max(0, Math.floor((cameraX - block.x) / tileWidth) * tileWidth);
          for (let x = first; x < Math.min(block.width, cameraX + canvas.width - block.x); x += tileWidth) {
            const drawWidth = Math.min(tileWidth, block.width - x);
            context.drawImage(artwork.image, sourceX, sourceY, width * drawWidth / tileWidth, height,
              block.x + x, block.y, drawWidth, block.height);
          }
          context.restore();
          continue;
        }
        context.translate(block.x + block.width / 2, block.y);
        if (frame.flip) context.scale(-1, 1);
        context.drawImage(block.id === "arena-boss" ? bossArtwork(artwork) : artwork.image, sourceX, sourceY, width, height,
          -block.width / 2, 0, block.width, block.height);
        context.restore();
        continue;
      }
      if (block.groundHazard) {
        const bounds = getPlatformerBounds(block, "contact");
        if (bounds) context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        continue;
      }
      if (block.type === "scenery") {
        // Rectangle tree placeholder; a sprite replaces this when src is supplied.
        context.fillStyle = "#875d3b";
        context.fillRect(block.x + block.width * 0.4, block.y + block.height * 0.4, block.width * 0.2, block.height * 0.6);
        context.fillStyle = "#54834d";
        context.fillRect(block.x, block.y, block.width, block.height * 0.6);
        continue;
      }
      if (appearance.tileSet === "fence-open") {
        // Open gate: a narrow post and a swung panel, using temporary rectangles.
        context.fillRect(block.x, block.y, 4, block.height);
        context.fillRect(block.x + 4, block.y + block.height - 8, 48, 8);
        continue;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
      const firstTileX = block.x + Math.max(0, Math.floor((cameraX - block.x) / PLATFORMER_BLOCK_SIZE)) * PLATFORMER_BLOCK_SIZE;
      for (let x = firstTileX; x < Math.min(block.x + block.width, cameraX + canvas.width); x += PLATFORMER_BLOCK_SIZE) {
        for (let y = block.y; y < block.y + block.height; y += PLATFORMER_BLOCK_SIZE) {
          context.strokeRect(x, y, Math.min(PLATFORMER_BLOCK_SIZE, block.x + block.width - x), Math.min(PLATFORMER_BLOCK_SIZE, block.y + block.height - y));
        }
      }
    }
    context.globalAlpha = 1;
    if (world.stickDrop && !world.imagination) {
      const stick = world.stickDrop;
      context.fillStyle = "#452f1d";
      context.fillRect(stick.x, stick.y, stick.width, stick.height);
    }
    if (world.bossKeyDrop) {
      const key = world.bossKeyDrop;
      context.fillStyle = "#e6bc52";
      context.fillRect(key.x, key.y, 14, 14);
      context.fillRect(key.x + 9, key.y + 9, 6, 15);
      context.fillRect(key.x + 15, key.y + 18, 9, 6);
      context.fillStyle = "#1d2b35";
      context.fillRect(key.x + 4, key.y + 4, 6, 6);
    }
    if (!world.isArena) {
      const griffin = world.griffin;
      const sprite = sprites.get(PLATFORMER_GRIFFIN_SPRITE.src);
      if (sprite?.ready) {
        const frame = Math.floor(world.elapsed * PLATFORMER_GRIFFIN_SPRITE.framesPerSecond) % 2;
        context.imageSmoothingEnabled = false;
        context.drawImage(sprite.image, frame * 32, 0, 32, 32, griffin.x, griffin.y, griffin.width, griffin.height);
      }
    }
    context.save();
    context.globalAlpha = getPlatformerPlayerOpacity(player);
    if (sprite?.ready) {
      const frame = getPlatformerSpriteFrame(player, animationTime, sheet);
      const width = frame.width * sheet.scale;
      const height = frame.height * sheet.scale;
      context.save();
      context.imageSmoothingEnabled = false;
      // Anchor every pose at the same feet position without changing collision physics.
      context.translate(player.x + player.width / 2, player.y + player.height);
      if (frame.flip) context.scale(-1, 1);
      context.drawImage(sprite.image,
        frame.column * frame.width, frame.row * sheet.frameHeight,
        frame.width, frame.height,
        -sheet.frameWidth * sheet.scale / 2, -height, width, height);
      context.restore();
    } else {
      // Keep the prototype playable while the image loads or if it cannot load.
      context.fillStyle = theme.playerColor;
      context.fillRect(player.x, player.y, player.width, player.height);
      if (theme.id !== "regular") {
        // Placeholder knight helmet and visor until a knight sheet is supplied.
        context.fillStyle = "#e0e5ed";
        context.fillRect(player.x - 3, player.y - 3, player.width + 6, 22);
        context.fillStyle = "#30394e";
        context.fillRect(player.x + (player.facing > 0 ? 15 : 1), player.y + 7, 20, 5);
      }
      context.fillStyle = "#fff";
      context.fillRect(player.x + (player.facing > 0 ? 25 : 5), player.y + 10, 6, 8);
    }
    if (inventory.stick === true && !(theme.id !== "regular" && sprite?.ready)) {
      // One inventory item, presented as a sword only in the imagined world.
      context.fillStyle = theme.id !== "regular" ? "#e0e5ed" : "#875d3b";
      context.fillRect(player.facing > 0 ? player.x + player.width : player.x - 24, player.y + 28, 24, 5);
      if (theme.id !== "regular") {
        context.fillStyle = "#e6bc52";
        context.fillRect(player.facing > 0 ? player.x + player.width + 3 : player.x - 8, player.y + 23, 4, 15);
      }
    }
    context.restore();
    drawBounds();
    context.restore();
    drawBlockLabels(cameraX);
    drawControls();
  }

  function frame(time) {
    if (!running) return;
    const dt = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 1 / 30);
    previousTime = time;
    const active = new Set(held.values());
    const wasPaused = Boolean(world.imagination || world.stickDropPause);
    const blockStateChanged = stepPlatformerWorld(world, {
      left: active.has("left"), right: active.has("right"),
      jump: jumpQueued, jumpHeld: active.has("jump"), action: actionQueued,
    }, dt);
    if (wasPaused !== Boolean(world.imagination || world.stickDropPause)) clearInput();
    positionSaveTime += dt;
    if (positionSaveTime >= 0.25) { positionSaveTime = 0; savePosition(); }
    if (dt > 0 && world.pickedUpItem) onPickup(world.pickedUpItem);
    if (dt > 0 && world.removedItem) onItemRemoved(world.removedItem);
    if (dt > 0) for (const result of world.actionResults) onAction(result);
    if (dt > 0 && world.springBounce) onSpringBounce(world.springBounce);
    if (dt > 0 && world.bossHitsChanged) {
      onBossProgress(world.bossHits);
      if (!running) return;
    }
    if (world.arenaExitRequested) {
      world.arenaExitRequested = false;
      if (world.bossDefeated && inventory[world.bossKeyItem]) onStepBack({ arenaExit: true, vy: world.player.vy });
      if (!running) return;
    }
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
    const nextAnimationState = `${player.facing}:${getPlatformerAnimationName(player)}`;
    animationTime = nextAnimationState === animationState ? animationTime + dt : 0;
    animationState = nextAnimationState;
    if (dt > 0) {
      jumpQueued = false;
      actionQueued = false;
    }
    draw(dt);
    frameId = requestAnimationFrame(frame);
  }

  return {
    setGamepadInput(state = {}) {
      const current = new Set(state.controls ?? []);
      if (!running || state.suspended || world.imagination || world.stickDropPause || world.arenaEscape) {
        for (const key of [...held.keys()]) if (key.startsWith("gamepad-")) held.delete(key);
        gamepadNeedsNeutral = true;
        previousGamepad = current;
        return;
      }
      if (gamepadNeedsNeutral) {
        if (!current.size) gamepadNeedsNeutral = false;
        previousGamepad = current;
        return;
      }
      for (const control of ["left", "right", "jump", "action"]) {
        const source = `gamepad-${control}`;
        if (!current.has(control)) held.delete(source);
        else if (!["jump", "action"].includes(control) || !previousGamepad.has(control)) press(source, control);
      }
      previousGamepad = current;
    },
    getBossHits(detailId = "boss-arena") {
      if (world.isArena) return world.bossHits;
      const boss = world.blocks.find(block => detailId === "return-boss-arena" ?
        block.returnBossDetail === detailId : block.type === "boss");
      const state = boss?.state?.replace(/^return-/, "");
      return state === "open" ? 3 : Math.max(0, PLATFORMER_BOSS_STATES.indexOf(state));
    },
    setBossHits(hits, detailId = "boss-arena") {
      if (!Number.isInteger(hits) || hits < 0 || hits > 3) return false;
      const boss = world.blocks.find(block => detailId === "return-boss-arena" ?
        block.returnBossDetail === detailId : block.type === "boss");
      if (!boss) return false;
      boss.state = (detailId === "return-boss-arena" ? "return-" : "") + PLATFORMER_BOSS_STATES[hits];
      syncPlatformerStick(world);
      onBlockStateChange(getPlatformerBlockStates(world));
      if (running) draw();
      return true;
    },
    setArenaProgress(hits) {
      if (!world.isArena || world.bossHits === hits) return;
      world = createBossArenaWorld(hits, inventory, bossKeyItem);
      previousTime = undefined;
      clearInput();
    },
    refreshInventory() {
      if (syncPlatformerStick(world)) onBlockStateChange(getPlatformerBlockStates(world));
      if (running) draw();
    },
    setShowBounds(value) { showBounds = value === true; if (running) draw(); },
    getReturnPoint() { return { x: world.player.x, y: world.player.y, facing: world.player.facing }; },
    launchFromArena(detailId, vy = -600) {
      const entry = getPlatformerBossEntrances(world).find(entry => entry.detail === detailId);
      if (!entry || !world.inventory[entry.keyItem]) return false;
      this.warpTo(entry.x + entry.width / 2 - world.player.width / 2);
      Object.assign(world.player, { y: PLATFORMER_GROUND_Y * PLATFORMER_BLOCK_SIZE - world.player.height - 1,
        vy: Number.isFinite(vy) && vy < 0 ? vy : -600 });
      savePosition();
      return true;
    },
    restoreReturnPoint(point) {
      if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return false;
      this.warpTo(point.x);
      world.player.y = Math.max(0, Math.min(world.height - world.player.height, point.y));
      world.player.facing = point.facing === -1 ? -1 : 1;
      world.player.jumpStartY = world.player.y;
      savePosition();
      if (running) draw();
      return true;
    },
    warpTo(x) {
      if (!Number.isFinite(x)) return null;
      world.imagination = null;
      world.stickDropPause = null;
      world.blocks = world.blocks.filter(block => block.owner !== "player");
      world.player.imagining = false;
      Object.assign(world.player, {
        x: Math.max(0, Math.min(world.width - world.player.width, x)), y: 20,
        vx: 0, vy: 0, grounded: false, jumpHolding: false, jumpStartY: 20,
        actionTime: 0, landTime: 0, hurtTime: 0, knockbackTime: 0,
      });
      world.requestedScreen = null;
      world.hazardHit = null;
      world.pendingAction = null;
      world.actionResults = [];
      clearInput();
      previousTime = undefined;
      animationTime = 0;
      savePosition();
      if (running) draw();
      return { x: world.player.x, y: world.player.y };
    },
    setJourney(journey) {
      if (!["go-home", "get-to-playground"].includes(journey) || world.journey === journey) return;
      // Both routes share the engine; route-specific layout changes can be added later.
      world = createPlatformerWorld(getPlatformerBlockStates(world), journey, inventory);
      for (const block of world.blocks) {
        const record = entitySprites.get(block.sprite?.src);
        if (record?.ready) applySpriteBounds(block, record);
      }
      clearInput();
      animationTime = 0;
      previousTime = undefined;
    },
    enterFromHome() {
      placePlatformerOutsideHome(world);
      savePosition();
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
      savePosition();
      running = false;
      cancelAnimationFrame(frameId);
      clearInput();
      previousTime = undefined;
    },
  };
}
