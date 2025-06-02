const defaultProgress = {
  aiQuest: false,
  grammarGalaxy: false,
  mysteryWords: false,
  debateClub: false,
  roleplayTheater: false,
  soundDetective: false,
  xp: 0,
};

export function getProgress() {
  const data = localStorage.getItem("englishHorizonProgress");
  return data ? JSON.parse(data) : defaultProgress;
}

export function saveProgress(newProgress) {
  localStorage.setItem("englishHorizonProgress", JSON.stringify(newProgress));
}

export function updateGameProgress(gameKey, xpEarned = 10) {
  const current = getProgress();
  const updated = {
    ...current,
    [gameKey]: true,
    xp: current.xp + xpEarned,
  };
  saveProgress(updated);
  return updated;
}
