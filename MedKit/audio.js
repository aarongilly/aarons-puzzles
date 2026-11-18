// Add future sound effects here. Music can be added separately when it is needed.
const GAME_SOUNDS = { ow: "assets/ow.m4a" };

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
