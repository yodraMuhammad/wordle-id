import React from 'react';

const StatsModal = ({ isOpen, onClose, stats, isGameOver, onPlayAgain, targetWord }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>STATISTIK</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{stats.gamesPlayed}</span>
            <span className="stat-label">Main</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {stats.gamesPlayed > 0 
                ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
                : 0}
            </span>
            <span className="stat-label">Win %</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.maxStreak}</span>
            <span className="stat-label">Max</span>
          </div>
        </div>

        {isGameOver && (
          <div style={{ marginTop: '20px' }}>
            {targetWord && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.9rem' }}>Kata Rahasia:</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>{targetWord}</p>
              </div>
            )}
            <button className="play-again-btn" onClick={onPlayAgain}>
              MAIN LAGI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
