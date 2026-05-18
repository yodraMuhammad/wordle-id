import React from 'react';

const Box = ({ value, status, isFlipping, animationDelay }) => {
  const classes = ['box'];
  
  if (value) classes.push('filled');
  if (status) classes.push(status);
  if (isFlipping) classes.push('flip');

  const style = isFlipping ? { animationDelay: `${animationDelay}ms` } : {};

  return (
    <div className={classes.join(' ')} style={style}>
      {value}
    </div>
  );
};

export default Box;
