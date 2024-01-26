import { useEffect } from "react";
import cn from "classnames";
import { createStore, createEvent } from "effector";
import { useUnit } from "effector-react";

import {
  leftGameElement,
  rightGameElement,
  rotateGameElementLeft,
  rotateGameElementRight,
} from "./modules/game-element/game-element.js";
import {
  createGame,
  updateGameCanvas,
  updateGameElement,
  checkFieldAndElementIntersection,
  isElementOutOfFieldByX,
  isElementReachBottom,
  toggleGamePause,
  gameUpdate,
  teleportActiveElement,
} from "./modules/game/game.js";

const startNewGame = createEvent();
const gameTick = createEvent();
const teleport = createEvent();
const moveLeft = createEvent();
const moveRight = createEvent();
const rotateLeft = createEvent();
const rotateRight = createEvent();
const togglePause = createEvent();

/**
 * @typedef {import('./modules/game/game.js').Game} Game
 */

/**
 * @param {Function} reducer
 * @returns {(game: Game) => Game}
 */
export function withRotateChecks(reducer) {
  return (game) => {
    const futureElement = reducer(game.activeElement);

    if (
      isElementReachBottom(game.area, futureElement) ||
      checkFieldAndElementIntersection(game.area, futureElement)
    ) {
      return game;
    }

    if (isElementOutOfFieldByX(game.area, futureElement)) {
      return game;
    }

    const updatedGame = updateGameElement(game, reducer);

    return updateGameCanvas(updatedGame);
  };
}

/**
 * @param {Function} reducer
 * @returns {(game: Game) => Game}
 */
export function withMoveChecks(reducer) {
  return (game) => {
    const futureElement = reducer(game.activeElement);
    if (checkFieldAndElementIntersection(game.area, futureElement)) {
      return game;
    }

    if (isElementOutOfFieldByX(game.area, futureElement)) {
      return game;
    }

    const updatedGame = updateGameElement(game, reducer);

    return updateGameCanvas(updatedGame);
  };
}

const $game = createStore(createGame())
  .on(startNewGame, createGame)
  .on(gameTick, gameUpdate)
  .on(teleport, (state) => gameUpdate(teleportActiveElement(state)))
  .on(moveLeft, withMoveChecks(leftGameElement))
  .on(moveRight, withMoveChecks(rightGameElement))
  .on(rotateLeft, withRotateChecks(rotateGameElementLeft))
  .on(rotateRight, withRotateChecks(rotateGameElementRight))
  .on(togglePause, toggleGamePause);

/**
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (event.key === "ArrowDown") {
    return gameTick();
  }

  if (event.key === "ArrowLeft") {
    return moveLeft();
  }

  if (event.key === "ArrowRight") {
    return moveRight();
  }

  if (event.key === "ArrowUp") {
    return rotateRight();
  }

  if (event.key === "Escape") {
    return togglePause();
  }
}

/**
 * @param {KeyboardEvent} event
 */
function handleKeyUp(event) {
  if (event.key === " ") {
    return teleport();
  }
}

function useControls() {
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });
}

function YourScore({ value }) {
  return <div>Your score: {value}</div>;
}

function Popup({ children }) {
  return (
    <div className="game-popup-container">
      <div className="game-popup">{children}</div>
    </div>
  );
}

function GamePopup({ game, onGameReset }) {
  if (game.gameOver) {
    return (
      <Popup>
        <div>Game over!</div>
        <YourScore value={game.score} />
        <button onClick={onGameReset}>Start New Game</button>
      </Popup>
    );
  }

  if (game.paused) {
    return <Popup>Paused!</Popup>;
  }

  return null;
}

export function Game() {
  const game = useUnit($game);

  useControls();

  const onRestartGame = () => {
    document.querySelector(".game-area").focus();
    startNewGame();
  };

  useEffect(() => {
    if (!game.paused) {
      const id = setInterval(gameTick, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [game.timestamp, game.paused]);

  return (
    <>
      <GamePopup game={game} onGameReset={onRestartGame} />

      <div className="game-layout">
        <div className="game-layout__start" />

        <div className="game-layout__middle">
          <div tabIndex="0" className="game-area">
            {game.canvas.flat().map((color, rowIndex) => {
              return (
                <div
                  className={cn("area-cell", color, color && "element")}
                  key={rowIndex}
                />
              );
            })}
          </div>
        </div>

        <div className="game-layout__end">
          <YourScore value={game.score} />
          <button onClick={onRestartGame}>Start New Game</button>
        </div>
      </div>
    </>
  );
}
