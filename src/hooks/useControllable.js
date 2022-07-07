import { useEffect, useState } from "react";

const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

const FPS = 20;
const MOVE_TIME = 1000/FPS;   //
const MOVE_DISTANCE = 64/FPS; //  64px/sec


export default function useControllable (_position={x:0,y:0}, _direction=DIRECTION.DOWN) {

  // ----- Define States -----

  let [position, setPosition] = useState(_position);
  let [positionX, setPositionX] = useState(_position.x);
  let [positionY, setPositionY] = useState(_position.y);
  let [direction, setDirection] = useState(_direction);
  let [isWalking, setWalking] = useState(false);

  // ----- Intern vars -----

  let isDirectionPressed = {}; // [DIRECTION]: bool
  let timerId = null;
  let delayId = null;
  let lastMoveTime = 0;

  // ----- Engine -----

  const go = (dir) => {
    // If we already know that, avoid

    if (!dir || isDirectionPressed[dir] && isWalking) {
      return;
    }

    isDirectionPressed[dir] = true;
    clearTimers();

    setDirection(dir); // direction = dir;
    setWalking(true); // isWalking=true;
  }

  //// ---------------- TEST WITH INTERVAL ----------------

  //   // Do we start now ? Or wait (because we already move/stop during the delay - Low FPS)

  //   let now = new Date().getTime();
  //   let delay = Math.max(0, (lastMoveTime + MOVE_TIME) - now);
  //   delayId = setTimeout(() => {
  //     if (isWalking) {
  //       move();
  //       timerId = setInterval(() => {
  //         console.log("Tic with Timeout");
  //         move();
  //       }, MOVE_TIME);
  //     }
  //   }, delay);
  // }


  // const move = () => {

  //   lastMoveTime = new Date().getTime();

  //   if (direction === DIRECTION.UP) {
  //     setPosition({x: position.x, y: position.y - MOVE_DISTANCE});
  //     setPositionY(positionY - MOVE_DISTANCE);
  //     // position = {x: position.x, y: position.y - MOVE_DISTANCE};
  //   }
  //   else if (direction === DIRECTION.DOWN) {
  //     setPosition({x: position.x, y: position.y + MOVE_DISTANCE});
  //     setPositionY(positionY + MOVE_DISTANCE);
  //     // position = {x: position.x, y: position.y + MOVE_DISTANCE};
  //   }
  //   else if (direction === DIRECTION.LEFT) {
  //     setPosition({x: position.x - MOVE_DISTANCE, y: position.y});
  //     setPositionX(positionX - MOVE_DISTANCE);
  //     // position = {x: position.x - MOVE_DISTANCE, y: position.y};
  //   }
  //   else if (direction === DIRECTION.RIGHT) {
  //     setPosition({x: position.x + MOVE_DISTANCE, y: position.y});
  //     setPositionY(positionY + MOVE_DISTANCE);
  //     // position = {x: position.x + MOVE_DISTANCE, y: position.y};
  //   }
  // }

  //// ---------------- END TEST WITH INTERVAL ----------------

  const clearTimers = () => {
    clearInterval(timerId);
    timerId = null;
    clearTimeout(delayId);
    delayId = null;
  }

  // ----- Event Management -----

  const onKeyDown = (e) => {
    go(keyCodeToDirection(e.keyCode));
  };

  const onKeyUp = (e) => {
    const dir = keyCodeToDirection(e.keyCode);
    if (!dir) {
      return;
    }
    isDirectionPressed[dir] = false;

    // Stop here
    if (dir === direction) {
      if (isDirectionPressed[DIRECTION.UP]) setDirection(DIRECTION.UP); // direction = DIRECTION.UP
      else if (isDirectionPressed[DIRECTION.DOWN]) setDirection(DIRECTION.DOWN); // direction = DIRECTION.DOWN
      else if (isDirectionPressed[DIRECTION.LEFT]) setDirection(DIRECTION.LEFT); // direction = DIRECTION.LEFT
      else if (isDirectionPressed[DIRECTION.RIGHT]) setDirection(DIRECTION.RIGHT); // direction = DIRECTION.RIGHT
      else {
        setWalking(false); // isWalking=false;
        clearTimers();
      }
    }
  };

  const keyCodeToDirection = (keyCode) => {
    if (keyCode === 37) { return DIRECTION.LEFT }
    else if (keyCode === 38) { return DIRECTION.UP }
    else if (keyCode === 39) { return DIRECTION.RIGHT }
    else if (keyCode === 40) { return DIRECTION.DOWN }
  }

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyUp, onKeyDown]);

  //// ---------------- TEST WITH USE EFFET ----------------

  useEffect(() => {
    const id = setTimeout(() => {
      lastMoveTime = new Date().getTime(); // Make it recall later
    }, 1/FPS);

    console.log("Tic with useEffect + timeout");
    return () => {
      clearTimeout(id);
    }
  }, [lastMoveTime]);

  useEffect(() => {

    if (direction === DIRECTION.UP && isDirectionPressed[DIRECTION.UP]) {
      setPosition({x:position.x, y:position.y - MOVE_DISTANCE});
      setPositionY(positionY - MOVE_DISTANCE);
    }
    else if (direction === DIRECTION.DOWN && isDirectionPressed[DIRECTION.DOWN]) {
      setPosition({x:position.x, y:position.y + MOVE_DISTANCE});
      setPositionY(positionY + MOVE_DISTANCE);
    }
    else if (direction === DIRECTION.LEFT && isDirectionPressed[DIRECTION.LEFT]) {
      setPosition({x:position.x - MOVE_DISTANCE, y:position.y});
      setPositionX(positionX - MOVE_DISTANCE);
    }
    else if (direction === DIRECTION.RIGHT && isDirectionPressed[DIRECTION.RIGHT]) {
      setPosition({x:position.x + MOVE_DISTANCE, y:position.y});
      setPositionY(positionY + MOVE_DISTANCE);
    }
  }, [lastMoveTime, direction, isDirectionPressed, position, positionX, positionY]);

  //// ---------------- END TEST WITH USE EFFET ----------------

  return { position, direction, isWalking, positionX, positionY };
}
