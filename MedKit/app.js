const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=eF78uT01qW0";
const OUTRO_VIDEO_URL = "https://youtu.be/eIYqghgkNPM";

// Use this prefix for localStorage saves so reset only clears Med Kit data.
const KID_MODE = new URLSearchParams(window.location.search).has("kid");
const HIGH_SCORE_GAME = KID_MODE ? "medkit-kids" : "medkit";
const STORAGE_PREFIX = KID_MODE ? "med-kit:kid:" : "med-kit:";
const TIMER_STORAGE_KEY = `${STORAGE_PREFIX}timer`;
const SCREEN_STORAGE_KEY = `${STORAGE_PREFIX}screen`;
const BLOCKS_STORAGE_KEY = `${STORAGE_PREFIX}blocks-v2`;
const LEGACY_BLOCKS_STORAGE_KEY = `${STORAGE_PREFIX}blocks`;
const GAME_SCREEN_STORAGE_KEY = `${STORAGE_PREFIX}game-screen`;
const HOME_STORAGE_KEY = `${STORAGE_PREFIX}home`;
const HOME_AUDIO_STORAGE_KEY = `${STORAGE_PREFIX}home-audio`;
const INVENTORY_STORAGE_KEY = `${STORAGE_PREFIX}inventory`;
const DETAIL_STORAGE_KEY = `${STORAGE_PREFIX}detail`;
const DETAIL_PANS_STORAGE_KEY = `${STORAGE_PREFIX}detail-pans`;
const COMPLETION_STORAGE_KEY = `${STORAGE_PREFIX}completion`;
const POSITION_STORAGE_KEY = `${STORAGE_PREFIX}position`;
const BOX_STATE_STORAGE_KEY = `${STORAGE_PREFIX}box-state`;
const BOX_FOUND_STORAGE_KEY = `${STORAGE_PREFIX}box-found`;
const PLAYER_NAME_STORAGE_KEY = `${STORAGE_PREFIX}player-name`;
const GAMEPLAY_SCREENS = ["go-home", "home", "get-to-playground", "detail", "congratulations"];
const gameAudio = createGameAudio();
document.addEventListener("pointerdown", () => { gameAudio.unlock(); }, { capture: true });
document.addEventListener("keydown", () => { gameAudio.unlock(); }, { capture: true });

// Add screens and their allowed events here as the player journey is implemented.
const screenTransitions = {
  splash: { START: "go-home" },
  "go-home": { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", ENTER_HOME: "home", COMPLETE: "congratulations" },
  home: { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", LEAVE_HOUSE: "go-home" },
  "get-to-playground": { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", ENTER_HOME: "home", COMPLETE: "congratulations" },
  box: { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "go-home" },
  congratulations: { BACK_TO_SPLASH: "splash" },
  detail: { STEP_BACK: "home", BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box" },
};

// The game is digital-only; kids and regular play share this state and canvas.
const gameState = {
  kidMode: KID_MODE,
  boxFound: false,
  boxOpened: false,
  playerName: "Player",
  startedAt: null,
  completion: null,
  screen: "splash",
  gameScreen: "go-home",
  home: restoreHomeState(null),
  inventory: { medKit: false, bandage: false, stick: false, bossKey: false, returnBossKey: false },
  detail: restoreDetailState(null, KID_MODE),
};
function normalizePlayerName(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 40) || "Player" : "Player";
}
try {
  gameState.playerName = normalizePlayerName(JSON.parse(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)));
} catch { /* An optional name must not block gameplay. */ }
try {
  gameState.detail = restoreDetailState(JSON.parse(window.localStorage.getItem(DETAIL_STORAGE_KEY)), KID_MODE);
} catch {
  // Missing or invalid detail context uses the house placeholder.
}
let legacyInventorySave = true;
const INVENTORY_CONTROLS = { medKit: "#development-med-kit", stick: "#development-stick", bossKey: "#development-boss-key", returnBossKey: "#development-return-boss-key" };
try {
  const inventory = JSON.parse(window.localStorage.getItem(INVENTORY_STORAGE_KEY));
  legacyInventorySave = !Object.hasOwn(inventory ?? {}, "bandage");
  for (const item of Object.keys(gameState.inventory)) gameState.inventory[item] = inventory?.[item] === true;
  // Older saves awarded medKit only when the bandage had been collected.
  if (legacyInventorySave) gameState.inventory.bandage = gameState.inventory.medKit;
} catch {
  // Inventory starts empty if storage is unavailable or invalid.
}

try {
  gameState.boxFound = !KID_MODE && (JSON.parse(window.localStorage.getItem(BOX_FOUND_STORAGE_KEY)) === true || gameState.inventory.medKit);
} catch { gameState.boxFound = !KID_MODE && gameState.inventory.medKit; }
// Migrate discoveries saved before the med kit itself became an inventory item.
if (legacyInventorySave && gameState.boxFound) gameState.inventory.medKit = true;

try {
  gameState.boxOpened = !KID_MODE && JSON.parse(window.localStorage.getItem(BOX_STATE_STORAGE_KEY))?.lidOpen === true;
} catch { /* An absent or malformed puzzle save starts closed. */ }

function getGameDirective() {
  if (gameState.gameScreen === "congratulations") return "You helped Griffin!";
  if (gameState.gameScreen === "detail" && gameState.screen !== "box" && DETAIL_VIEWS[gameState.detail.id].kind === "arena") return "Defeat the Boss";
  if (gameState.inventory.bandage) return "Get to the Playground";
  if (gameState.inventory.medKit) return "Obtain Meds";
  return "Find Med Kit";
}

// The embedded puzzle reports progress without restarting any active controller.
function updateMedKitProgress(state) {
  if (gameState.kidMode || gameState.screen !== "box" || typeof state?.lidOpen !== "boolean") return false;
  gameState.boxOpened = state.lidOpen;
  gameDirective.textContent = getGameDirective();
  return true;
}

function viewMedKit() {
  const fromDetail = gameState.screen === "detail" && DETAIL_VIEWS[gameState.detail.id].kind === "inspection";
  if (gameState.kidMode || (gameState.screen !== "home" && !fromDetail) || !gameState.inventory.medKit) return false;
  gameState.boxFound = true;
  try { window.localStorage.setItem(BOX_FOUND_STORAGE_KEY, "true"); } catch { /* Keep discovery in memory. */ }
  return transitionScreen("TOGGLE_BOX");
}

function exploreHouseFromBox() {
  if (gameState.screen !== "box" || gameState.kidMode) return false;
  return setScreen(gameState.gameScreen === "detail" ? "detail" : "home");
}

function setInventoryItem(item, owned) {
  if (!Object.hasOwn(gameState.inventory, item) || typeof owned !== "boolean") return false;
  gameState.inventory[item] = owned;
  if (item === "medKit" && !owned) gameState.inventory.bandage = false;
  try {
    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(gameState.inventory));
  } catch {
    const status = document.querySelector("#development-status");
    if (status) status.textContent = "Local storage is unavailable; inventory changes will not survive a reload.";
  }
  for (const [key, selector] of Object.entries(INVENTORY_CONTROLS)) {
    const checkbox = document.querySelector(selector);
    if (checkbox) checkbox.checked = gameState.inventory[key];
  }
  home.refresh();
  detailView.refresh?.();
  platformer.refreshInventory();
  gameDirective.textContent = getGameDirective();
  return true;
}
const splash = document.querySelector("#splash");
const game = document.querySelector("#game");
const gameCanvas = document.querySelector("#game-canvas");
try {
  gameState.home = restoreHomeState(JSON.parse(window.localStorage.getItem(HOME_STORAGE_KEY)));
} catch {
  // The initial entry panorama is used when no valid home view is saved.
}
let heardHomeSounds = new Set();
try {
  const saved = JSON.parse(window.localStorage.getItem(HOME_AUDIO_STORAGE_KEY));
  if (Array.isArray(saved)) heardHomeSounds = new Set(saved.filter(name => typeof name === "string"));
} catch { /* Missing or invalid dialogue progress starts unheard. */ }
function playHomeSound(sound, firstSound) {
  if (gameState.screen !== "home") return false;
  if (firstSound && !heardHomeSounds.has(firstSound)) {
    heardHomeSounds.add(firstSound);
    try { window.localStorage.setItem(HOME_AUDIO_STORAGE_KEY, JSON.stringify([...heardHomeSounds])); }
    catch { /* Keep first-use progress in memory when storage is unavailable. */ }
    sound = firstSound;
  }
  return gameAudio.play(sound);
}
const home = createHome(gameCanvas, {
  state: gameState.home,
  kidMode: KID_MODE,
  inventory: gameState.inventory,
  canViewMedKit: () => gameState.inventory.medKit && !gameState.kidMode,
  onViewMedKit: viewMedKit,
  onSound: playHomeSound,
  onOpenDetail(id) {
    if (id === "house-puzzle" && !KID_MODE) { setInventoryItem("medKit", true); viewMedKit(); }
    else openDetail(id);
  },
  onPickup(item) {
    if (item === "medKit" && gameState.screen === "home" && !KID_MODE) {
      setInventoryItem("medKit", true);
      viewMedKit();
      return;
    }
    setInventoryItem(item, true);
    if (item === "medKit") {
      setInventoryItem("bandage", true);
      if (gameState.screen === "home") openDetail("kid-med-kit");
    }
  },
  onLeaveHome() {
    transitionScreen("LEAVE_HOUSE");
  },
  onStateChange(state) {
    gameState.home = state;
    try {
      window.localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(state));
    } catch {
      const status = document.querySelector("#development-status");
      if (status) status.textContent = "Local storage is unavailable; the current home view will not survive a reload.";
    }
  },
});
let savedBlockStates = {};
try {
  let saved = JSON.parse(window.localStorage.getItem(BLOCKS_STORAGE_KEY));
  if (saved === null) {
    // Before spatial renumbering, these were the only persisted block states.
    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_BLOCKS_STORAGE_KEY));
    const ids = { "03": "05", "52": "33", "53": "75", "56": "78", "60": "02" };
    if (legacy && typeof legacy === "object" && !Array.isArray(legacy)) {
      saved = Object.fromEntries(Object.entries(legacy).filter(([id]) => Object.hasOwn(ids, id))
        .map(([id, state]) => [ids[id], state]));
    }
  }
  if (saved && typeof saved === "object" && !Array.isArray(saved)) savedBlockStates = saved;
} catch {
  // Invalid or unavailable saves leave blocks in their default states.
}
let savedPosition = null;
try {
  savedPosition = JSON.parse(window.localStorage.getItem(POSITION_STORAGE_KEY));
} catch {
  // Invalid or unavailable position saves use the normal route spawn.
}
function updatePlayerCoordinates(position) {
  const output = document.querySelector("#development-player-position");
  if (!output) return;
  const x = Number((position.x / PLATFORMER_BLOCK_SIZE).toFixed(3));
  const y = Number((position.y / PLATFORMER_BLOCK_SIZE).toFixed(3));
  const text = `X=${x}, Y=${y}`;
  if (output.textContent !== text) output.textContent = text;
}
const platformer = createPlatformer(gameCanvas, {
  onPlayerPosition: updatePlayerCoordinates,
  position: savedPosition,
  onPositionChange(position) {
    try { window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position)); }
    catch { /* Gameplay remains available when storage is blocked. */ }
  },
  blockStates: savedBlockStates,
  inventory: gameState.inventory,
  onHazardHit() { gameAudio.play("ow"); },
  onPickup(item) { setInventoryItem(item, true); },
  onItemRemoved(item) { setInventoryItem(item, false); },
  onAction: playActionSound,
  onSpringBounce: playActionSound,
  onDestination(screen) {
    if (screen === "congratulations" && gameState.inventory.bandage) transitionScreen("COMPLETE");
    else if (screen === "home") transitionScreen("ENTER_HOME");
    else if (screen?.detail) openDetail(screen.detail);
  },
  onBlockStateChange(blockStates) {
    try {
      window.localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blockStates));
    } catch {
      const status = document.querySelector("#development-status");
      if (status) status.textContent = "Local storage is unavailable; block changes will not survive a reload.";
    }
  },
});
function playActionSound(result) {
  const sound = getInteractionSound(result);
  if (sound) gameAudio.play(sound);
}
let savedDetailPans = {};
try { savedDetailPans = JSON.parse(window.localStorage.getItem(DETAIL_PANS_STORAGE_KEY)) ?? {}; }
catch { /* Missing or invalid pan history starts with the default framing. */ }
const detailView = createDetailView(gameCanvas, {
  kidMode: KID_MODE,
  panPositions: savedDetailPans,
  onPanChange(positions) {
    try { window.localStorage.setItem(DETAIL_PANS_STORAGE_KEY, JSON.stringify(positions)); }
    catch { /* The controller retains framing in memory when storage is unavailable. */ }
  },
  canViewMedKit: () => gameState.inventory.medKit && !gameState.kidMode,
  onViewMedKit: viewMedKit,
  onOpenDetail: id => openDetail(id),
  onSound: name => gameAudio.play(name),
  onPlayerPosition: updatePlayerCoordinates,
  inventory: gameState.inventory,
  getBossHits: id => platformer.getBossHits(id),
  onBossProgress(hits, id) {
    platformer.setBossHits(hits, id);
  },
  onAction: playActionSound,
  onSpringBounce: playActionSound,
  onHazardHit() { gameAudio.play("ow"); },
  onPickup(item) {
    if (item !== "medKit") { setInventoryItem(item, true); return; }
    if (gameState.screen !== "detail" || gameState.detail.returnScreen !== "home" ||
        DETAIL_VIEWS[gameState.detail.id].pickupItem !== "medKit" || gameState.inventory.medKit) return;
    setInventoryItem("medKit", true);
    setScreen("home", false);
    if (KID_MODE) {
      setInventoryItem("bandage", true);
      openDetail("kid-med-kit");
    } else viewMedKit();
  },
  onStepBack(exit) { transitionScreen("STEP_BACK", exit); },
});
const boxFrame = document.querySelector("#box-view");
const boxView = createBoxHost(boxFrame);
const videoContainer = document.querySelector("#intro-video");
const outroVideoContainer = document.querySelector("#completion-video");
const startButton = document.querySelector("#start-game");
startButton.textContent = gameState.kidMode ? "Start Game · Kids" : "Start Game";
if (gameState.kidMode) startButton.setAttribute("data-kid-mode", "true");
const kidModeCheckbox = document.querySelector("#kid-mode");
if (kidModeCheckbox) kidModeCheckbox.checked = gameState.kidMode;
const kidModeDescription = document.querySelector("#kid-mode-description");
if (kidModeDescription) kidModeDescription.hidden = !gameState.kidMode;
kidModeCheckbox?.addEventListener("change", () => {
  if (kidModeDescription) kidModeDescription.hidden = !kidModeCheckbox.checked;
  if (kidModeCheckbox.checked === gameState.kidMode) return;
  const url = new URL(window.location.href);
  if (kidModeCheckbox.checked) url.searchParams.set("kid", "");
  else url.searchParams.delete("kid");
  window.location.assign(url.href);
});
const playerNameInput = document.querySelector("#player-name");
let highScores = [];
let scoresReady = false;
if (playerNameInput) playerNameInput.value = gameState.playerName === "Player" ? "" : gameState.playerName;
function savePlayerName() {
  gameState.playerName = normalizePlayerName(playerNameInput?.value ?? gameState.playerName);
  try { window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, JSON.stringify(gameState.playerName)); }
  catch { /* The name remains available for this run without storage. */ }
  updateStartGate();
}
playerNameInput?.addEventListener("input", savePlayerName);
function updateStartGate() {
  const raw = playerNameInput?.value.trim() ?? "";
  const name = raw ? normalizePlayerName(raw) : "";
  const longEnough = (name.match(/\p{L}/gu) ?? []).length >= 3;
  const taken = highScores.some(score => normalizePlayerName(score.name).toLowerCase() === name.toLowerCase());
  startButton.disabled = !longEnough || !scoresReady || taken;
  const status = document.querySelector("#player-name-status");
  if (status) status.textContent = !longEnough ? "" :
    !scoresReady ? "Checking high score names…" : taken ? "That name is already on the high score list. Please choose another." : "";
}
updateStartGate();
const splashHeader = document.querySelector("#splash-header");
const gameHeader = document.querySelector("#game-header");
const gameTimer = document.querySelector("#game-timer");
const gameDirective = document.querySelector("#game-directive");
let timerInterval;

if (gameState.kidMode) boxFrame.remove();

try {
  const savedStart = JSON.parse(window.localStorage.getItem(TIMER_STORAGE_KEY));
  if (Number.isFinite(savedStart) && savedStart > 0 && savedStart <= Date.now()) {
    gameState.startedAt = savedStart;
  }
} catch {
  // The game remains playable if storage is unavailable or the saved value is invalid.
}

try {
  const saved = JSON.parse(window.localStorage.getItem(COMPLETION_STORAGE_KEY));
  if (Number.isFinite(saved?.elapsedMs) && saved.elapsedMs >= 0 &&
      Number.isFinite(saved.completedAt) && saved.completedAt > 0 && saved.completedAt <= Date.now()) {
    gameState.completion = { elapsedMs: saved.elapsedMs, completedAt: saved.completedAt,
      playerName: normalizePlayerName(saved.playerName ?? gameState.playerName),
      scoreStatus: ["submitted", "failed", "unconfigured", "preview"].includes(saved.scoreStatus) ? saved.scoreStatus : "unknown" };
  }
} catch {
  // A corrupt result must not prevent playing the game.
}

try {
  const savedGameScreen = JSON.parse(window.localStorage.getItem(GAME_SCREEN_STORAGE_KEY));
  if (GAMEPLAY_SCREENS.includes(savedGameScreen)) gameState.gameScreen = savedGameScreen;
} catch {
  // Missing or invalid progress uses the initial platformer screen.
}

try {
  const savedScreen = JSON.parse(window.localStorage.getItem(SCREEN_STORAGE_KEY));
  if (typeof savedScreen === "string" && Object.hasOwn(screenTransitions, savedScreen)) {
    // Kids resume gameplay rather than the adult puzzle box.
    gameState.screen = savedScreen === "box" && gameState.kidMode ? gameState.gameScreen : savedScreen;
    if (GAMEPLAY_SCREENS.includes(gameState.screen)) gameState.gameScreen = gameState.screen;
  }
} catch {
  // Missing or invalid screen data falls back to the splash screen.
}

// A missing/corrupt result cannot resume a completed screen with an invented time.
if (!gameState.completion) {
  if (gameState.gameScreen === "congratulations") gameState.gameScreen = "go-home";
  if (gameState.screen === "congratulations") gameState.screen = "go-home";
}

// Called by the Three.js puzzle only after its actual completion rules are met.
// Dispensing is not collection: only tapping the released bandage calls this hook.
function completeMedKitPuzzle() {
  const fromHome = gameState.gameScreen === "home" || (gameState.gameScreen === "detail" && gameState.detail.returnScreen === "home");
  if (gameState.kidMode || gameState.screen !== "box" || !fromHome || !gameState.inventory.medKit || gameState.inventory.bandage) return false;
  setInventoryItem("bandage", true);
  return openDetail("kid-med-kit");
}

function openDetail(id) {
  const nested = gameState.screen === "detail";
  const boxSource = gameState.gameScreen === "detail" ? gameState.detail.returnScreen : gameState.gameScreen;
  const source = nested ? gameState.detail.returnScreen : gameState.screen === "box" ? boxSource : gameState.screen;
  if (!Object.hasOwn(DETAIL_VIEWS, id) || !["home", "go-home", "get-to-playground"].includes(source) ||
      (gameState.screen === "box" && id !== "kid-med-kit")) return false;
  if (nested && (DETAIL_VIEWS[gameState.detail.id].kind !== "inspection" || DETAIL_VIEWS[id].kind !== "inspection")) return false;
  if (gameState.kidMode && (DETAIL_VIEWS[id].kind === "puzzle" || DETAIL_VIEWS[id].adultOnly)) return false;
  if (DETAIL_VIEWS[id].kind === "arena" && (gameState.screen === "home" || !gameState.inventory.stick || gameState.inventory[DETAIL_VIEWS[id].keyItem])) return false;
  gameState.detail = {
    id, returnScreen: source,
    returnPoint: nested ? gameState.detail.returnPoint : source === "home" ? null : platformer.getReturnPoint(),
    ...(nested ? { returnDetails: [...(gameState.detail.returnDetails ?? []), gameState.detail.id].slice(-20) } : {}),
  };
  try {
    window.localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(gameState.detail));
  } catch {
    const status = document.querySelector("#development-status");
    if (status) status.textContent = "Local storage is unavailable; this puzzle view will not survive a reload.";
  }
  return setScreen("detail");
}

function transitionScreen(event, exit) {
  if (event === "START") {
    updateStartGate();
    if (startButton.disabled) return false;
    savePlayerName();
  }
  if (event === "TOGGLE_BOX" && gameState.kidMode) return false;
  const transitions = screenTransitions[gameState.screen];
  if (!Object.hasOwn(transitions, event)) return false;
  let nextScreen = transitions[event];
  if (event === "START" || (gameState.screen === "box" && event === "TOGGLE_BOX")) {
    nextScreen = gameState.gameScreen;
  } else if (event === "LEAVE_HOUSE") {
    nextScreen = gameState.inventory.bandage ? "get-to-playground" : "go-home";
    platformer.setJourney(nextScreen);
    platformer.enterFromHome();
  } else if (event === "STEP_BACK") {
    const view = DETAIL_VIEWS[gameState.detail.id];
    if (gameState.detail.returnDetails?.length) {
      const returnDetails = [...gameState.detail.returnDetails];
      gameState.detail = restoreDetailState({ ...gameState.detail, id: returnDetails.pop(), returnDetails }, KID_MODE);
      try { window.localStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(gameState.detail)); }
      catch { /* Keep navigation available when storage is unavailable. */ }
      return setScreen("detail");
    }
    if (view.kind === "pickup") {
      setInventoryItem("medKit", true);
      setInventoryItem("bandage", true);
      if (gameState.detail.returnScreen === "home") return setScreen("home");
      platformer.setJourney("get-to-playground");
      platformer.enterFromHome();
      return setScreen("get-to-playground");
    }
    if (view.kind === "arena" && (!exit?.arenaExit || !gameState.inventory[view.keyItem] || platformer.getBossHits(gameState.detail.id) < 3)) return false;
    nextScreen = gameState.detail.returnScreen;
    if (nextScreen !== "home") {
      platformer.setJourney(nextScreen);
      if (view.kind === "arena") platformer.launchFromArena(gameState.detail.id, exit?.vy);
      else platformer.restoreReturnPoint(gameState.detail.returnPoint);
    }
  }
  return setScreen(nextScreen, true, event === "COMPLETE");
}

// Shared save/render path. The development selector can bypass progression events.
function setScreen(nextScreen, moveFocus = true, submitScore = false) {
  if (!Object.hasOwn(screenTransitions, nextScreen) ||
      (nextScreen === "box" && gameState.kidMode)) return false;
  const newCompletion = nextScreen === "congratulations" && !gameState.completion;
  if (newCompletion) {
    const now = Date.now();
    gameState.completion = { completedAt: now, elapsedMs: Math.max(0, now - (gameState.startedAt ?? now)),
      playerName: gameState.playerName, scoreStatus: submitScore ? "pending" : "preview" };
    saveCompletion();
  }
  gameState.screen = nextScreen;
  if (GAMEPLAY_SCREENS.includes(nextScreen)) gameState.gameScreen = nextScreen;
  try {
    window.localStorage.setItem(GAME_SCREEN_STORAGE_KEY, JSON.stringify(gameState.gameScreen));
    window.localStorage.setItem(SCREEN_STORAGE_KEY, JSON.stringify(nextScreen));
  } catch {
    const status = document.querySelector("#development-status");
    if (status) status.textContent = "Local storage is unavailable; the current screen will not survive a reload.";
  }
  renderScreen(moveFocus);
  if (newCompletion && submitScore) void submitHighScore();
  return true;
}

function renderScreen(moveFocus = false) {
  const isSplash = gameState.screen === "splash";
  const isBox = gameState.screen === "box";
  const isComplete = gameState.screen === "congratulations";
  splash.hidden = !isSplash;
  splashHeader.hidden = !isSplash;
  game.hidden = isSplash;
  gameHeader.hidden = isSplash;
  const developmentTools = document.querySelector("#development-tools");
  if (developmentTools) developmentTools.hidden = isSplash;
  // Stop the previous controller before another one draws onto the shared canvas.
  if (gameState.screen !== "home") home.stop();
  if (gameState.screen !== "detail") detailView.stop();
  if (["go-home", "get-to-playground"].includes(gameState.screen)) {
    platformer.setJourney(gameState.screen);
    platformer.start();
    // Warm the same cache used by the house without delaying character control.
    home.preload();
  }
  else platformer.stop();
  const directive = getGameDirective();
  gameDirective.textContent = directive;
  gameCanvas.setAttribute("aria-label", gameState.gameScreen === "home"
    ? "Home panoramas. Drag to look around and click targets to move between rooms."
    : `${directive} platformer. Move with A/D or Left/Right, hold W or Up to jump higher, and act with Space. Touch controls are in the bottom strip.`);
  if (gameState.screen === "home") home.start();
  if (gameState.screen === "detail") detailView.start(gameState.detail.id, getPlatformerTheme(gameState.detail.returnPoint?.x ?? 0, gameState.inventory));
  gameCanvas.hidden = isBox;
  if (isBox && !gameState.kidMode) boxView.start();
  else boxView.stop();
  const finalScores = document.querySelector("#completion-high-scores");
  if (finalScores) finalScores.hidden = !isComplete;
  const completionActions = document.querySelector("#completion-actions");
  if (completionActions) completionActions.hidden = !isComplete;
  const resetConfirmation = document.querySelector("#reset-confirmation");
  if (!isComplete && resetConfirmation?.open) resetConfirmation.close();
  updateOutroVideo(isComplete);

  const developmentScreen = document.querySelector("#development-screen");
  if (developmentScreen) developmentScreen.value = gameState.screen;

  const iframe = videoContainer.querySelector("iframe");
  if (isSplash) {
    clearInterval(timerInterval);
    if (iframe && embedUrl && !iframe.getAttribute("src")) iframe.src = embedUrl;
  } else {
    if (isComplete) {
      clearInterval(timerInterval);
      updateTimer();
      drawCongratulations();
    } else startTimer();
    // Removing the player stops video/audio when leaving the splash screen.
    if (iframe) iframe.removeAttribute("src");
  }
  if (moveFocus) {
    if (isBox) boxView.focus();
    else (isSplash ? startButton : gameCanvas).focus();
  }
}

function formatElapsedTime(elapsedMs) {
  const seconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return [hours, minutes, seconds % 60]
    .map(value => String(value).padStart(2, "0")).join(":");
}

function updateTimer() {
  gameTimer.textContent = formatElapsedTime(gameState.completion?.elapsedMs ?? (Date.now() - gameState.startedAt));
}

function saveCompletion() {
  try { window.localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(gameState.completion)); }
  catch { /* Completion still works when storage is unavailable. */ }
}

function drawCongratulations() {
  const context = gameCanvas.getContext("2d");
  context.fillStyle = "#e9f4ee";
  context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#1d2b35";
  context.font = "bold 42px Arial, sans-serif";
  context.fillText("You helped Griffin!", 450, 32);
  context.font = "24px Arial, sans-serif";
  const time = formatElapsedTime(gameState.completion?.elapsedMs ?? 0);
  context.fillText(`Your time: ${time}`, 450, 76);
  const status = { pending: "Submitting your time…", submitted: "Your time has been submitted.",
    failed: "Your time is saved here, but score submission failed.",
    unknown: "Your time is saved here. Score submission could not be confirmed.",
    preview: "Preview only. No score was submitted.",
    unconfigured: "Your time is saved on this device." }[gameState.completion?.scoreStatus] ?? "";
  context.font = "16px Arial, sans-serif";
  context.fillText(status, 450, 106);
  gameCanvas.setAttribute("aria-label", `You helped Griffin! Your time: ${time}. ${status}`);
}

async function submitHighScore() {
  const result = gameState.completion;
  try {
    await postMedKitScore(HIGH_SCORE_GAME, result.playerName, result.elapsedMs);
    result.scoreStatus = "submitted";
    void loadHighScores(true);
  } catch {
    result.scoreStatus = "failed";
  }
  saveCompletion();
  if (gameState.screen === "congratulations") drawCongratulations();
}

let scoresLoading = false;
let scoresFailed = false;
let scoreRefreshPending = false;
function renderHighScores() {
  updateStartGate();
  for (const prefix of ["splash", "completion"]) {
    const title = document.querySelector(`#${prefix}-scores-title`);
    if (title) title.textContent = `High scores · ${gameState.kidMode ? "Kids" : "Regular"}`;
    const status = document.querySelector(`#${prefix}-scores-status`);
    if (status) status.textContent = scoresLoading ? "Loading…" : scoresFailed ? "Unable to load scores." : highScores.length ? "Fastest five times" : "No scores yet. Be the first!";
    const rows = document.querySelector(`#${prefix}-scores-rows`);
    if (!rows) continue;
    rows.replaceChildren();
    highScores.slice(0, 5).forEach((score, index) => {
      const row = document.createElement("tr");
      for (const text of [String(index + 1), score.name, formatMedKitScoreTime(score.elapsedMs)]) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.append(cell);
      }
      rows.append(row);
    });
  }
}
async function loadHighScores(refreshAfterCurrent = false) {
  if (scoresLoading) { scoreRefreshPending ||= refreshAfterCurrent; return; }
  scoresLoading = true;
  scoresFailed = false;
  renderHighScores();
  try { highScores = await fetchMedKitScores(HIGH_SCORE_GAME); }
  catch { scoresFailed = true; }
  finally {
    scoresLoading = false;
    scoresReady = true;
    renderHighScores();
    if (scoreRefreshPending) { scoreRefreshPending = false; void loadHighScores(); }
  }
}
for (const selector of ["#splash-scores-refresh", "#completion-scores-refresh"]) {
  document.querySelector(selector)?.addEventListener("click", () => { void loadHighScores(); });
}

function startTimer() {
  if (gameState.completion) { updateTimer(); clearInterval(timerInterval); return; }

  if (gameState.startedAt === null) {
    gameState.startedAt = Date.now();
    try {
      window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(gameState.startedAt));
    } catch {
      const status = document.querySelector("#development-status");
      if (status) status.textContent = "Local storage is unavailable; elapsed time will reset if this page reloads.";
    }
  }
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 250);
}

function getYouTubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let videoId;

    if (host === "youtu.be") {
      videoId = url.pathname.split("/")[1];
    } else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const segments = url.pathname.split("/");
      videoId = url.searchParams.get("v");
      if (["embed", "shorts", "live"].includes(segments[1])) videoId = segments[2];
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId ?? "")
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : null;
  } catch {
    return null;
  }
}

function updateOutroVideo(visible) {
  if (!outroVideoContainer) return;
  outroVideoContainer.hidden = !visible;
  let iframe = outroVideoContainer.querySelector("iframe");
  if (!visible) {
    iframe?.removeAttribute("src");
    return;
  }
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.title = "Med Kit outro";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    outroVideoContainer.replaceChildren(iframe);
  }
  if (!iframe.getAttribute("src")) iframe.src = getYouTubeEmbedUrl(OUTRO_VIDEO_URL);
}

const embedUrl = getYouTubeEmbedUrl(INTRO_VIDEO_URL);
if (embedUrl) {
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = "Med Kit introductory video";
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  videoContainer.replaceChildren(iframe);
} else if (INTRO_VIDEO_URL.trim()) {
  console.warn("Set INTRO_VIDEO_URL to a valid YouTube video URL.");
}


for (const [item, selector] of Object.entries(INVENTORY_CONTROLS)) {
  const checkbox = document.querySelector(selector);
  if (checkbox) {
    checkbox.checked = gameState.inventory[item];
    checkbox.addEventListener("change", () => {
      const owned = checkbox.checked;
      // This diagnostic remains a shortcut to the completed pickup state.
      if (item === "medKit") setInventoryItem("bandage", owned);
      setInventoryItem(item, owned);
    });
  }
}

const developmentScreenSelect = document.querySelector("#development-screen");
const developmentWarpX = document.querySelector("#development-warp-x");
const developmentBounds = document.querySelector("#development-bounds");
if (developmentBounds) developmentBounds.addEventListener("change", () => platformer.setShowBounds(developmentBounds.checked));
document.querySelector("#development-warp")?.addEventListener("click", () => {
  if (!developmentWarpX) return;
  const x = Number(developmentWarpX.value);
  const pixelX = x * PLATFORMER_BLOCK_SIZE;
  const status = document.querySelector("#development-status");
  if (!developmentWarpX.value.trim() || !Number.isFinite(pixelX)) {
    if (status) status.textContent = "Enter a valid X coordinate.";
    return;
  }
  const screen = gameState.gameScreen === "get-to-playground" ? "get-to-playground" : "go-home";
  setScreen(screen);
  const position = platformer.warpTo(pixelX);
  developmentWarpX.value = String(position.x / PLATFORMER_BLOCK_SIZE);
  if (status) status.textContent = `Warped to X=${position.x / PLATFORMER_BLOCK_SIZE}, Y=${position.y / PLATFORMER_BLOCK_SIZE} units.`;
});
if (developmentScreenSelect) {
  for (const screen of Object.keys(screenTransitions)) {
    const option = document.createElement("option");
    option.value = screen;
    option.textContent = screen;
    option.disabled = screen === "box" && gameState.kidMode;
    developmentScreenSelect.append(option);
  }
  developmentScreenSelect.addEventListener("change", () => {
    // Keep focus on the selector so arrow-key selection works without interruption.
    if (!setScreen(developmentScreenSelect.value, false)) {
      developmentScreenSelect.value = gameState.screen;
    }
  });
}

startButton.addEventListener("click", () => {
  transitionScreen("START");
});

// Development controls are optional so their HTML can be commented out for release.
document.querySelector("#back-to-splash")?.addEventListener("click", () => {
  transitionScreen("BACK_TO_SPLASH");
});

function resetSavedGame() {
  try {
    const storage = window.localStorage;
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
    for (const key of keys) {
      if (key?.startsWith(STORAGE_PREFIX) && (gameState.kidMode || !key.startsWith("med-kit:kid:"))) storage.removeItem(key);
    }
    window.location.reload();
    return true;
  } catch {
    for (const selector of ["#development-status", "#reset-status"]) {
      const status = document.querySelector(selector);
      if (status) status.textContent = "Unable to reset saved data. Check that this browser allows local storage.";
    }
    return false;
  }
}
document.querySelector("#reset-save")?.addEventListener("click", resetSavedGame);

const resetConfirmation = document.querySelector("#reset-confirmation");
document.querySelector("#completion-reset-save")?.addEventListener("click", () => {
  if (gameState.screen !== "congratulations" || !resetConfirmation || resetConfirmation.open) return;
  const status = document.querySelector("#reset-status");
  if (status) status.textContent = "";
  resetConfirmation.showModal();
});
document.querySelector("#reset-cancel")?.addEventListener("click", () => resetConfirmation?.close());
document.querySelector("#reset-confirm")?.addEventListener("click", () => {
  if (gameState.screen !== "congratulations" || !resetConfirmation?.open) return;
  if (resetSavedGame()) resetConfirmation.close();
});

// Restore the saved screen on every load, including reloads triggered by edits.
renderScreen();

let previousGamepadControls = new Set();
const gamepadControls = createGamepadControls({
  onInput(state) {
    const controls = new Set(state.controls);
    const startPressed = controls.has("start") && !previousGamepadControls.has("start");
    if ([...controls].some(control => !previousGamepadControls.has(control))) void gameAudio.unlock();
    previousGamepadControls = controls;
    const editing = document.activeElement?.closest?.("input, textarea, select, [contenteditable]");
    const input = editing && gameState.screen !== "splash" ? { ...state, suspended: true } : state;
    platformer.setGamepadInput(input);
    detailView.setGamepadInput(input);
    home.setGamepadInput(input);
    if (gameState.screen === "splash") {
      const status = document.querySelector("#controller-status");
      const detected = ["ready", "unmapped"].includes(state.status);
      const message = state.status === "unmapped" ? "Controller detected, but its controls aren't mapped. Input:" :
        detected ? "Controller detected! Input:" : "Controllers are supported - none detected";
      const compatibility = document.querySelector("#controller-compatibility");
      if (compatibility) compatibility.hidden = state.status !== "unmapped";
      if (status && status.textContent !== message) status.textContent = message;
      const output = document.querySelector("#controller-input");
      if (output) {
        output.hidden = !detected;
        const unused = (state.buttons ?? []).filter(index => state.status !== "ready" || ![0, 1, 9, 12, 13, 14, 15].includes(index));
        const labels = (state.testControls ?? [...controls]).map(control => GAMEPAD_CONTROL_LABELS[control]);
        if (unused.length) labels.push("Unassigned button");
        const text = labels.join(" · ") || "—";
        if (output.textContent !== text) output.textContent = text;
      }
      if (startPressed) transitionScreen("START");
    }
  },
});
document.querySelector("#controller-compatibility")?.addEventListener("click", () => {
  gamepadControls.tryStandardMapping();
});
gamepadControls.start();
void loadHighScores();
