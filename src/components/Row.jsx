import React from 'react';
import Box from './Box';

const Row = ({ guess, statusArray, isFlipping, isInvalid }) => {
  // Pad the guess array to always have 5 elements
  const letters = guess ? guess.split('') : [];
  const emptyBoxes = Array.from({ length: 5 - letters.length });
  
  const classes = ['row'];
  if (isInvalid) classes.push('shake');

  return (
    <div className={classes.join(' ')}>
      {letters.map((letter, i) => (
        <Box 
          key={i} 
          value={letter} 
          status={statusArray ? statusArray[i] : null} 
          isFlipping={isFlipping}
          animationDelay={i * 100}
        />
      ))}
      {emptyBoxes.map((_, i) => (
        <Box key={`empty-${i}`} />
      ))}
    </div>
  );
};

export default Row;
