import React from 'react';

const Character = ({position, direction, isWalking}) => {
  return <div id="player" style={{top:position.y, left:position.y}} className={`${direction} ${isWalking ? 'walk' : ''}`}></div>
};

export default Character;