export const checkGuess = (guess, target) => {
  const guessChars = guess.split('');
  const targetChars = target.split('');
  const status = Array(5).fill('absent'); // 'correct', 'present', 'absent'

  // First pass: find correct letters
  guessChars.forEach((char, i) => {
    if (char === targetChars[i]) {
      status[i] = 'correct';
      targetChars[i] = null; // consume this letter
      guessChars[i] = null; // consume guess letter
    }
  });

  // Second pass: find present letters
  guessChars.forEach((char, i) => {
    if (char !== null && targetChars.includes(char)) {
      status[i] = 'present';
      targetChars[targetChars.indexOf(char)] = null; // consume
    }
  });

  return status;
};

export const saveGameState = (state) => {
  localStorage.setItem('wordle-id-state', JSON.stringify(state));
};

export const loadGameState = () => {
  const state = localStorage.getItem('wordle-id-state');
  return state ? JSON.parse(state) : null;
};

export const saveStats = (stats) => {
  localStorage.setItem('wordle-id-stats', JSON.stringify(stats));
};

export const loadStats = () => {
  const stats = localStorage.getItem('wordle-id-stats');
  return stats ? JSON.parse(stats) : {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  };
};
