import React from 'react';
import Row from './Row';

const Grid = ({ guesses, currentGuess, currentGuessIndex, statuses, flippingRowIndex, invalidRowIndex }) => {
  const empties = guesses.length < 5 
    ? Array.from({ length: 5 - currentGuessIndex }) 
    : [];

  return (
    <div className="grid-container">
      {guesses.map((guess, i) => (
        <Row 
          key={i} 
          guess={guess} 
          statusArray={statuses[i]} 
          isFlipping={i === flippingRowIndex}
        />
      ))}
      
      {currentGuessIndex < 6 && (
        <Row 
          key={currentGuessIndex} 
          guess={currentGuess} 
          isInvalid={currentGuessIndex === invalidRowIndex}
        />
      )}

      {empties.map((_, i) => (
        <Row key={`empty-row-${i}`} guess="" />
      ))}
    </div>
  );
};

export default Grid;
