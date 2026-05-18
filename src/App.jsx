import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import StatsModal from './components/StatsModal';
import { getRandomWord, WORDLIST } from './constants';
import { checkGuess, saveGameState, loadGameState, saveStats, loadStats } from './utils';

const App = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  });

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [flippingRowIndex, setFlippingRowIndex] = useState(-1);
  const [invalidRowIndex, setInvalidRowIndex] = useState(-1);

  useEffect(() => {
    const loadedStats = loadStats();
    setStats(loadedStats);

    const loadedState = loadGameState();
    if (loadedState && loadedState.gameStatus === 'playing') {
      setTargetWord(loadedState.targetWord);
      setGuesses(loadedState.guesses);
      setStatuses(loadedState.statuses);
      setGameStatus(loadedState.gameStatus);
    } else {
      startNewGame();
    }
  }, []);

  const startNewGame = () => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setStatuses([]);
    setGameStatus('playing');
    setIsStatsModalOpen(false);
    setFlippingRowIndex(-1);
    
    saveGameState({
      targetWord: newWord,
      guesses: [],
      statuses: [],
      gameStatus: 'playing'
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const onChar = useCallback((char) => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + char);
    }
  }, [currentGuess, gameStatus]);

  const onDelete = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => prev.slice(0, -1));
  }, [currentGuess, gameStatus]);

  const onEnter = useCallback(() => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length !== 5) {
      showToast('Kurang huruf');
      setInvalidRowIndex(guesses.length);
      setTimeout(() => setInvalidRowIndex(-1), 500);
      return;
    }

    if (!WORDLIST.includes(currentGuess)) {
      showToast('Kata tidak ada di kamus');
      setInvalidRowIndex(guesses.length);
      setTimeout(() => setInvalidRowIndex(-1), 500);
      return;
    }

    const newStatus = checkGuess(currentGuess, targetWord);
    const newStatuses = [...statuses, newStatus];
    const newGuesses = [...guesses, currentGuess];

    setStatuses(newStatuses);
    setGuesses(newGuesses);
    setFlippingRowIndex(newGuesses.length - 1);
    setCurrentGuess('');

    let newGameStatus = 'playing';
    let newStats = { ...stats };

    if (currentGuess === targetWord) {
      newGameStatus = 'won';
      newStats.gamesPlayed += 1;
      newStats.gamesWon += 1;
      newStats.currentStreak += 1;
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
      newStats.guesses[newGuesses.length] += 1;
      showToast('Luar biasa!');
    } else if (newGuesses.length === 6) {
      newGameStatus = 'lost';
      newStats.gamesPlayed += 1;
      newStats.currentStreak = 0;
    }

    setGameStatus(newGameStatus);
    if (newGameStatus !== 'playing') {
      setStats(newStats);
      saveStats(newStats);
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, 1500); // Wait for flip animation
    }

    saveGameState({
      targetWord,
      guesses: newGuesses,
      statuses: newStatuses,
      gameStatus: newGameStatus
    });
  }, [currentGuess, gameStatus, guesses, statuses, targetWord, stats]);

  // Compute keyboard colors
  const keyStatuses = {};
  guesses.forEach((guess, i) => {
    const statusArray = statuses[i];
    if (!statusArray) return;
    
    for (let j = 0; j < 5; j++) {
      const char = guess[j];
      const currentStatus = keyStatuses[char];
      const newStatus = statusArray[j];

      // Update to best status (correct > present > absent)
      if (newStatus === 'correct' || currentStatus === 'correct') {
        keyStatuses[char] = 'correct';
      } else if (newStatus === 'present' || currentStatus === 'present') {
        keyStatuses[char] = 'present';
      } else {
        keyStatuses[char] = 'absent';
      }
    }
  });

  return (
    <>
      <header>
        <h1>Wordle ID</h1>
        <button className="stats-btn" onClick={() => setIsStatsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
          </svg>
        </button>
      </header>

      {toastMessage && (
        <div className="toast-container">
          <div className="toast">{toastMessage}</div>
        </div>
      )}

      <main>
        <Grid 
          guesses={guesses}
          currentGuess={currentGuess}
          currentGuessIndex={guesses.length}
          statuses={statuses}
          flippingRowIndex={flippingRowIndex}
          invalidRowIndex={invalidRowIndex}
        />
      </main>

      <Keyboard 
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        keyStatuses={keyStatuses}
      />

      <StatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
        isGameOver={gameStatus !== 'playing'}
        onPlayAgain={startNewGame}
        targetWord={targetWord}
      />
    </>
  );
};

export default App;
