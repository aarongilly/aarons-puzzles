// Static-page version of Aaron's shared Lib/api.js transport contract:
// https://github.com/aarongilly/aarons-puzzles/blob/main/Lib/api.js
const HIGH_SCORE_URL = "https://script.google.com/macros/s/AKfycbxEMiKvUvMsmtYTQKv57QMBxjmdNbooOwBNkD2IOoqrqEakxmCLPDFHh-s9kp2NsB6Y/exec";

function normalizeMedKitScores(data) {
  if (!Array.isArray(data)) throw new Error("Invalid leaderboard response");
  return data.filter(row => typeof row?.team_name === "string" && row.team_name.trim() &&
    Number.isFinite(row.duration_ms) && row.duration_ms >= 0)
    .map(row => ({ name: row.team_name.trim(), elapsedMs: row.duration_ms }))
    .sort((a, b) => a.elapsedMs - b.elapsedMs);
}

function formatMedKitScoreTime(elapsedMs) {
  const ms = Math.max(0, Math.floor(elapsedMs));
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
}

async function fetchMedKitScores(game) {
  const response = await fetch(`${HIGH_SCORE_URL}?game=${encodeURIComponent(game)}`);
  if (!response.ok) throw new Error("Unable to load scores");
  return normalizeMedKitScores(await response.json());
}

async function postMedKitScore(game, name, elapsedMs) {
  const response = await fetch(HIGH_SCORE_URL, {
    method: "POST", headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ sheet: game, data: [name, elapsedMs] }),
  });
  if (!response.ok) throw new Error("Unable to submit score");
  const result = await response.json();
  if (!result || typeof result !== "object" || Array.isArray(result) ||
      result.error || result.success === false || result.status === "error") throw new Error("Score submission rejected");
  return result;
}
