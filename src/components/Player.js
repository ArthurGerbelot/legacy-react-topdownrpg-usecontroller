import React from 'react';

import Character from './Character';
import useControllable from '../hooks/useControllable';

const Player = () => {
  const { position, direction, isWalking, positionX, positionY }  = useControllable();
  console.log({position, direction, isWalking, positionX, positionY})

  return <Character position={{x:positionX, y:positionY}} skin={1} direction={direction} isWalking={isWalking} />
};

export default Player;