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
const INVENTORY_STORAGE_KEY = `${STORAGE_PREFIX}inventory`;
const DETAIL_STORAGE_KEY = `${STORAGE_PREFIX}detail`;
const COMPLETION_STORAGE_KEY = `${STORAGE_PREFIX}completion`;
const POSITION_STORAGE_KEY = `${STORAGE_PREFIX}position`;
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

// Both modes use this same game state and canvas. Hardware integration comes later.
// Presence of the query parameter selects physical mode, including a bare ?physical.
const gameState = {
  mode: new URLSearchParams(window.location.search).has("physical") ? "physical" : "digital",
  kidMode: KID_MODE,
  playerName: "Player",
  startedAt: null,
  completion: null,
  screen: "splash",
  gameScreen: "go-home",
  home: restoreHomeState(null),
  inventory: { medKit: false, stick: false, bossKey: false, returnBossKey: false },
  detail: restoreDetailState(null),
};
function normalizePlayerName(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 40) || "Player" : "Player";
}
try {
  gameState.playerName = normalizePlayerName(JSON.parse(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)));
} catch { /* An optional name must not block gameplay. */ }
try {
  gameState.detail = restoreDetailState(JSON.parse(window.localStorage.getItem(DETAIL_STORAGE_KEY)));
} catch {
  // Missing or invalid detail context uses the house placeholder.
}
const INVENTORY_CONTROLS = { medKit: "#development-med-kit", stick: "#development-stick", bossKey: "#development-boss-key", returnBossKey: "#development-return-boss-key" };
try {
  const inventory = JSON.parse(window.localStorage.getItem(INVENTORY_STORAGE_KEY));
  for (const item of Object.keys(gameState.inventory)) gameState.inventory[item] = inventory?.[item] === true;
} catch {
  // Inventory starts empty if storage is unavailable or invalid.
}

function setInventoryItem(item, owned) {
  if (!Object.hasOwn(gameState.inventory, item) || typeof owned !== "boolean") return false;
  gameState.inventory[item] = owned;
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
  platformer.refreshInventory();
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
const home = createHome(gameCanvas, {
  state: gameState.home,
  inventory: gameState.inventory,
  onOpenDetail: openDetail,
  onPickup(item) { setInventoryItem(item, true); },
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
    if (screen === "congratulations" && gameState.inventory.medKit) transitionScreen("COMPLETE");
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
const detailView = createDetailView(gameCanvas, {
  onPlayerPosition: updatePlayerCoordinates,
  inventory: gameState.inventory,
  getBossHits: id => platformer.getBossHits(id),
  onBossProgress(hits, id) {
    platformer.setBossHits(hits, id);
  },
  onAction: playActionSound,
  onSpringBounce: playActionSound,
  onHazardHit() { gameAudio.play("ow"); },
  onPickup(item) { setInventoryItem(item, true); },
  onStepBack(exit) { transitionScreen("STEP_BACK", exit); },
});
const boxFrame = document.querySelector("#box-view");
const boxView = createBoxHost(boxFrame);
const boxControls = document.querySelector("#box-controls");
const toggleBoxButton = document.querySelector("#toggle-box");
const videoContainer = document.querySelector("#intro-video");
const outroVideoContainer = document.querySelector("#completion-video");
const startButton = document.querySelector("#start-game");
startButton.textContent = gameState.kidMode ? "Start Game · Kids" : "Start Game";
if (gameState.kidMode) startButton.setAttribute("data-kid-mode", "true");
const kidModeCheckbox = document.querySelector("#kid-mode");
if (kidModeCheckbox) kidModeCheckbox.checked = gameState.kidMode;
kidModeCheckbox?.addEventListener("change", () => {
  if (kidModeCheckbox.checked === gameState.kidMode) return;
  const url = new URL(window.location.href);
  if (kidModeCheckbox.checked) url.searchParams.set("kid", "");
  else url.searchParams.delete("kid");
  window.location.assign(url.href);
});
const playerNameInput = document.querySelector("#player-name");
if (playerNameInput) playerNameInput.value = gameState.playerName === "Player" ? "" : gameState.playerName;
function savePlayerName() {
  gameState.playerName = normalizePlayerName(playerNameInput?.value ?? gameState.playerName);
  try { window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, JSON.stringify(gameState.playerName)); }
  catch { /* The name remains available for this run without storage. */ }
  updateStartGate();
}
playerNameInput?.addEventListener("input", savePlayerName);
function updateStartGate() {
  // Temporary access check; later require only a trimmed name of at least 3 characters.
  startButton.disabled = playerNameInput?.value.trim() !== "Fintel";
}
updateStartGate();
const splashHeader = document.querySelector("#splash-header");
const gameHeader = document.querySelector("#game-header");
const gameTimer = document.querySelector("#game-timer");
const gameDirective = document.querySelector("#game-directive");
let timerInterval;

if (gameState.mode === "physical" || gameState.kidMode) {
  boxFrame.remove();
  boxControls.remove();
} else {
  toggleBoxButton.addEventListener("click", () => transitionScreen("TOGGLE_BOX"));
}

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
    // A saved virtual-box screen resumes the game when using the physical box.
    gameState.screen = savedScreen === "box" && (gameState.mode === "physical" || gameState.kidMode) ? gameState.gameScreen : savedScreen;
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

function openDetail(id) {
  if (!Object.hasOwn(DETAIL_VIEWS, id) || !["home", "go-home", "get-to-playground"].includes(gameState.screen)) return false;
  if (gameState.kidMode && DETAIL_VIEWS[id].kind === "puzzle") return false;
  if (DETAIL_VIEWS[id].kind === "arena" && (gameState.screen === "home" || !gameState.inventory.stick || gameState.inventory[DETAIL_VIEWS[id].keyItem])) return false;
  gameState.detail = {
    id, returnScreen: gameState.screen,
    returnPoint: gameState.screen === "home" ? null : platformer.getReturnPoint(),
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
  if (event === "START" && startButton.disabled) return false;
  if (event === "START") savePlayerName();
  if (event === "TOGGLE_BOX" && (gameState.mode !== "digital" || gameState.kidMode)) return false;
  const transitions = screenTransitions[gameState.screen];
  if (!Object.hasOwn(transitions, event)) return false;
  let nextScreen = transitions[event];
  if (event === "ENTER_HOME" && gameState.kidMode) {
    if (gameState.inventory.medKit) {
      platformer.setJourney("get-to-playground");
      platformer.enterFromHome();
      return setScreen("get-to-playground");
    }
    setInventoryItem("medKit", true);
    return openDetail("kid-med-kit");
  }
  if (event === "START" || (gameState.screen === "box" && event === "TOGGLE_BOX")) {
    nextScreen = gameState.gameScreen;
  } else if (event === "LEAVE_HOUSE") {
    nextScreen = gameState.inventory.medKit ? "get-to-playground" : "go-home";
    platformer.setJourney(nextScreen);
    platformer.enterFromHome();
  } else if (event === "STEP_BACK") {
    const view = DETAIL_VIEWS[gameState.detail.id];
    if (view.kind === "pickup") {
      setInventoryItem("medKit", true);
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
      (nextScreen === "box" && (gameState.mode !== "digital" || gameState.kidMode)) ||
      (gameState.kidMode && nextScreen === "home")) return false;
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
    if (!gameState.kidMode) home.preload();
  }
  else platformer.stop();
  const directive = gameState.gameScreen === "detail" ? DETAIL_VIEWS[gameState.detail.id].title
    : { home: "Find Med Kit", "go-home": "Run Home", "get-to-playground": "Get to Playground", congratulations: "You helped Griffin!" }[gameState.gameScreen];
  gameDirective.textContent = directive;
  gameCanvas.setAttribute("aria-label", gameState.gameScreen === "home"
    ? "Home panoramas. Drag to look around and click targets to move between rooms."
    : `${directive} platformer. Move with A/D or Left/Right, hold Left Shift to run, hold W or Up to jump higher, and act with Space. Touch controls are in the bottom strip.`);
  if (gameState.screen === "home") home.start();
  if (gameState.screen === "detail") detailView.start(gameState.detail.id, getPlatformerTheme(gameState.detail.returnPoint?.x ?? 0, gameState.inventory));
  gameCanvas.hidden = isBox;
  if (isBox && gameState.mode === "digital" && !gameState.kidMode) boxView.start();
  else boxView.stop();
  boxControls.hidden = isSplash || isComplete || gameState.mode !== "digital" || gameState.kidMode;
  const finalScores = document.querySelector("#completion-high-scores");
  if (finalScores) finalScores.hidden = !isComplete;
  updateOutroVideo(isComplete);
  toggleBoxButton.textContent = isBox ? "Return to Game" : "View Puzzle Box";

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

let highScores = [];
let scoresLoading = false;
let scoresFailed = false;
let scoreRefreshPending = false;
function renderHighScores() {
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

const developmentMode = document.querySelector("#development-mode");
if (developmentMode) developmentMode.textContent = `${gameState.mode}${gameState.kidMode ? " · kids" : ""}`;

for (const [item, selector] of Object.entries(INVENTORY_CONTROLS)) {
  const checkbox = document.querySelector(selector);
  if (checkbox) {
    checkbox.checked = gameState.inventory[item];
    checkbox.addEventListener("change", () => setInventoryItem(item, checkbox.checked));
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
    option.disabled = (screen === "box" && (gameState.mode !== "digital" || gameState.kidMode)) ||
      (screen === "home" && gameState.kidMode);
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

const toggleModeButton = document.querySelector("#toggle-mode");
if (toggleModeButton) {
  toggleModeButton.textContent = gameState.mode === "physical" ? "Switch to Digital Mode" : "Switch to Physical Mode";
  toggleModeButton.addEventListener("click", () => {
    const url = new URL(window.location.href);
    if (gameState.mode === "physical") {
      url.searchParams.delete("physical");
    } else {
      url.searchParams.set("physical", "");
    }
    window.location.assign(url.href);
  });
}

document.querySelector("#reset-save")?.addEventListener("click", () => {
  try {
    const storage = window.localStorage;
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
    for (const key of keys) {
      if (key?.startsWith(STORAGE_PREFIX) && (gameState.kidMode || !key.startsWith("med-kit:kid:"))) storage.removeItem(key);
    }
    window.location.reload();
  } catch {
    const status = document.querySelector("#development-status");
    if (status) status.textContent = "Unable to reset saved data. Check that this browser allows local storage.";
  }
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
    if (gameState.screen === "splash") {
      const status = document.querySelector("#controller-status");
      const detected = ["ready", "unmapped"].includes(state.status);
      const message = detected ? "Controller detected! Input:" : "Controllers are supported - none detected";
      if (status && status.textContent !== message) status.textContent = message;
      const output = document.querySelector("#controller-input");
      if (output) {
        output.hidden = !detected;
        const unused = (state.buttons ?? []).filter(index => state.status !== "ready" || ![0, 1, 4, 5, 9, 12, 13, 14, 15].includes(index));
        const labels = (state.testControls ?? [...controls]).map(control => GAMEPAD_CONTROL_LABELS[control]);
        if (unused.length) labels.push("Unassigned button");
        const text = labels.join(" · ") || "—";
        if (output.textContent !== text) output.textContent = text;
      }
      if (startPressed) transitionScreen("START");
    }
  },
});
gamepadControls.start();
void loadHighScores();
