// Add future sound effects here. Music can be added separately when it is needed.
const GAME_SOUNDS = { ow: "assets/ow.m4a", ya: "assets/ya.m4a", spring: "assets/spring.mp3" };
// Register a new clip above, then change just its outcome mapping here.
const ACTION_SOUNDS = { empty: "ya", gate: "ya", enemy: "ya", inspect: "ya", tree: "ya", pickup: "ya", cast: "ya" };
// Register clips in GAME_SOUNDS, then assign their IDs here. Each object/effect
// can have its own clip. Null keeps unarmed interactions and bounces silent.
const OBJECT_SOUNDS = {
  "05": { gate: null },
  "33": { tree: null, pickup: null },
  "75": { inspect: null },
  "78": { gate: null },
  "79": { gate: null, pickup: null },
  "02": { drop: null, pickup: null },
  "81": { inspect: null },
  "71": { bounce: "spring" },
  "07": { bounce: "spring" },
  griffin: { inspect: null, "give-bandage": null },
  "arena-boss": { enemy: null },
  "boss-key": { pickup: null },
};

function getInteractionSound(result) {
  return OBJECT_SOUNDS[result.targetId]?.[result.effect] ??
    (result.armed ? ACTION_SOUNDS[result.effect] ?? ACTION_SOUNDS.empty : null);
}

function createGameAudio(sources = GAME_SOUNDS) {
  const clips = new Map(Object.entries(sources).map(([name, source]) => {
    const clip = new Audio(source);
    clip.preload = "auto";
    clip.volume = 0.8;
    return [name, clip];
  }));
  let unlocked = false;
  let unlocking = null;

  // Call from a user gesture, including when a saved game resumes on page load.
  function unlock() {
    if (unlocked) return Promise.resolve(true);
    if (unlocking) return unlocking;
    unlocking = Promise.all([...clips.values()].map(async clip => {
      clip.muted = true;
      try {
        await clip.play();
        clip.pause();
        clip.currentTime = 0;
        return true;
      } catch {
        return false;
      } finally {
        clip.muted = false;
      }
    })).then(results => {
      unlocked = results.every(Boolean);
      unlocking = null;
      return unlocked;
    });
    return unlocking;
  }

  return {
    unlock,
    async play(name) {
      const clip = clips.get(name);
      if (!clip) return false;
      try {
        if (unlocking) await unlocking;
        clip.pause();
        clip.currentTime = 0;
        await clip.play();
        return true;
      } catch {
        // Autoplay restrictions, missing files, or unsupported audio must not stop play.
        return false;
      }
    },
  };
}
