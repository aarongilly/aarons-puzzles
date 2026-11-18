const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=eF78uT01qW0";
// Reversible experiment: false restores the original 2D puzzle-box placeholder.
const BOX_3D_PROTOTYPE_ENABLED = true;

// Use this prefix for localStorage saves so reset only clears Med Kit data.
const STORAGE_PREFIX = "med-kit:";
const TIMER_STORAGE_KEY = `${STORAGE_PREFIX}timer`;
const SCREEN_STORAGE_KEY = `${STORAGE_PREFIX}screen`;
const BLOCKS_STORAGE_KEY = `${STORAGE_PREFIX}blocks`;
const GAME_SCREEN_STORAGE_KEY = `${STORAGE_PREFIX}game-screen`;
const HOME_STORAGE_KEY = `${STORAGE_PREFIX}home`;
const INVENTORY_STORAGE_KEY = `${STORAGE_PREFIX}inventory`;
const GAMEPLAY_SCREENS = ["go-home", "home", "get-to-playground"];
const gameAudio = createGameAudio();
document.addEventListener("pointerdown", () => { gameAudio.unlock(); }, { capture: true });
document.addEventListener("keydown", () => { gameAudio.unlock(); }, { capture: true });

// Add screens and their allowed events here as the player journey is implemented.
const screenTransitions = {
  splash: { START: "go-home" },
  "go-home": { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", ENTER_HOME: "home" },
  home: { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", LEAVE_HOUSE: "go-home" },
  "get-to-playground": { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "box", ENTER_HOME: "home" },
  box: { BACK_TO_SPLASH: "splash", TOGGLE_BOX: "go-home" },
};

// Both modes use this same game state and canvas. Hardware integration comes later.
// Presence of the query parameter selects physical mode, including a bare ?physical.
const gameState = {
  mode: new URLSearchParams(window.location.search).has("physical") ? "physical" : "digital",
  startedAt: null,
  screen: "splash",
  gameScreen: "go-home",
  home: restoreHomeState(null),
  inventory: { medKit: false },
};
try {
  const inventory = JSON.parse(window.localStorage.getItem(INVENTORY_STORAGE_KEY));
  gameState.inventory.medKit = inventory?.medKit === true;
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
  const checkbox = document.querySelector("#development-med-kit");
  if (checkbox) checkbox.checked = gameState.inventory.medKit;
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
  const saved = JSON.parse(window.localStorage.getItem(BLOCKS_STORAGE_KEY));
  if (saved && typeof saved === "object" && !Array.isArray(saved)) savedBlockStates = saved;
} catch {
  // Invalid or unavailable saves leave blocks in their default states.
}
const platformer = createPlatformer(gameCanvas, {
  blockStates: savedBlockStates,
  onHazardHit() { gameAudio.play("ow"); },
  onDestination(screen) {
    if (screen === "home") transitionScreen("ENTER_HOME");
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
const boxCanvas = document.querySelector("#box-canvas");
const boxPrototypeFrame = document.querySelector("#box-prototype");
const boxPrototype = createBoxPrototypeHost(boxCanvas, boxPrototypeFrame, { enabled: BOX_3D_PROTOTYPE_ENABLED });
const boxControls = document.querySelector("#box-controls");
const toggleBoxButton = document.querySelector("#toggle-box");
const videoContainer = document.querySelector("#intro-video");
const startButton = document.querySelector("#start-game");
const alphaCodeInput = document.querySelector("#alpha-code");
function updateAlphaGate() {
  startButton.disabled = alphaCodeInput.value.trim() !== "PANO";
}
alphaCodeInput.addEventListener("input", updateAlphaGate);
updateAlphaGate();
const splashHeader = document.querySelector("#splash-header");
const gameHeader = document.querySelector("#game-header");
const gameTimer = document.querySelector("#game-timer");
const gameDirective = document.querySelector("#game-directive");
let timerInterval;

if (gameState.mode === "physical") {
  boxCanvas.remove();
  boxPrototypeFrame.remove();
  boxControls.remove();
} else {
  const context = boxCanvas.getContext("2d");
  context.fillStyle = "#f4f4f5";
  context.fillRect(0, 0, boxCanvas.width, boxCanvas.height);
  context.fillStyle = "#27272a";
  context.font = "28px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Physical Box to be replicated here", boxCanvas.width / 2, boxCanvas.height / 2);
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
  const savedGameScreen = JSON.parse(window.localStorage.getItem(GAME_SCREEN_STORAGE_KEY));
  if (GAMEPLAY_SCREENS.includes(savedGameScreen)) gameState.gameScreen = savedGameScreen;
} catch {
  // Missing or invalid progress uses the initial platformer screen.
}

try {
  const savedScreen = JSON.parse(window.localStorage.getItem(SCREEN_STORAGE_KEY));
  if (typeof savedScreen === "string" && Object.hasOwn(screenTransitions, savedScreen)) {
    // A saved virtual-box screen resumes the game when using the physical box.
    gameState.screen = savedScreen === "box" && gameState.mode === "physical" ? gameState.gameScreen : savedScreen;
    if (GAMEPLAY_SCREENS.includes(gameState.screen)) gameState.gameScreen = gameState.screen;
  }
} catch {
  // Missing or invalid screen data falls back to the splash screen.
}

function transitionScreen(event) {
  if (event === "START" && startButton.disabled) return false;
  if (event === "TOGGLE_BOX" && gameState.mode !== "digital") return false;
  const transitions = screenTransitions[gameState.screen];
  if (!Object.hasOwn(transitions, event)) return false;
  let nextScreen = transitions[event];
  if (event === "START" || (gameState.screen === "box" && event === "TOGGLE_BOX")) {
    nextScreen = gameState.gameScreen;
  } else if (event === "LEAVE_HOUSE") {
    nextScreen = gameState.inventory.medKit ? "get-to-playground" : "go-home";
    platformer.setJourney(nextScreen);
    platformer.enterFromHome();
  }
  return setScreen(nextScreen);
}

// Shared save/render path. The development selector can bypass progression events.
function setScreen(nextScreen, moveFocus = true) {
  if (!Object.hasOwn(screenTransitions, nextScreen) ||
      (nextScreen === "box" && gameState.mode !== "digital")) return false;
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
  return true;
}

function renderScreen(moveFocus = false) {
  const isSplash = gameState.screen === "splash";
  const isBox = gameState.screen === "box";
  splash.hidden = !isSplash;
  splashHeader.hidden = !isSplash;
  game.hidden = isSplash;
  gameHeader.hidden = isSplash;
  const developmentTools = document.querySelector("#development-tools");
  if (developmentTools) developmentTools.hidden = isSplash;
  // Stop the previous controller before another one draws onto the shared canvas.
  if (gameState.screen !== "home") home.stop();
  if (["go-home", "get-to-playground"].includes(gameState.screen)) {
    platformer.setJourney(gameState.screen);
    platformer.start();
  }
  else platformer.stop();
  const directive = { home: "Find Med Kit", "go-home": "Go Home", "get-to-playground": "Get to Playground" }[gameState.gameScreen];
  gameDirective.textContent = directive;
  gameCanvas.setAttribute("aria-label", gameState.gameScreen === "home"
    ? "Home panoramas. Drag to look around and click targets to move between rooms."
    : `${directive} platformer. Move with A/D or Left/Right, hold W or Up to jump higher, and act with Space. Touch controls are in the bottom strip.`);
  if (gameState.screen === "home") home.start();
  gameCanvas.hidden = isBox;
  if (isBox && gameState.mode === "digital") boxPrototype.start();
  else boxPrototype.stop();
  boxControls.hidden = isSplash || gameState.mode !== "digital";
  toggleBoxButton.textContent = isBox ? "Return to Game" : "View Puzzle Box";

  const developmentScreen = document.querySelector("#development-screen");
  if (developmentScreen) developmentScreen.value = gameState.screen;

  const iframe = videoContainer.querySelector("iframe");
  if (isSplash) {
    clearInterval(timerInterval);
    if (iframe && embedUrl && !iframe.getAttribute("src")) iframe.src = embedUrl;
  } else {
    startTimer();
    // Removing the player stops video/audio when leaving the splash screen.
    if (iframe) iframe.removeAttribute("src");
  }
  if (moveFocus) {
    if (isBox) boxPrototype.focus();
    else (isSplash ? startButton : gameCanvas).focus();
  }
}

function updateTimer() {
  const seconds = Math.max(0, Math.floor((Date.now() - gameState.startedAt) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  gameTimer.textContent = [hours, minutes, seconds % 60]
    .map(value => String(value).padStart(2, "0")).join(":");
}

function startTimer() {
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
if (developmentMode) developmentMode.textContent = gameState.mode;

const developmentMedKit = document.querySelector("#development-med-kit");
if (developmentMedKit) {
  developmentMedKit.checked = gameState.inventory.medKit;
  developmentMedKit.addEventListener("change", () => setInventoryItem("medKit", developmentMedKit.checked));
}

const developmentScreenSelect = document.querySelector("#development-screen");
if (developmentScreenSelect) {
  for (const screen of Object.keys(screenTransitions)) {
    const option = document.createElement("option");
    option.value = screen;
    option.textContent = screen;
    option.disabled = screen === "box" && gameState.mode !== "digital";
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
      if (key?.startsWith(STORAGE_PREFIX)) storage.removeItem(key);
    }
    window.location.reload();
  } catch {
    const status = document.querySelector("#development-status");
    if (status) status.textContent = "Unable to reset saved data. Check that this browser allows local storage.";
  }
});

// Restore the saved screen on every load, including reloads triggered by edits.
renderScreen();
