import { useState, useEffect } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { GameStore } from "./GameStore";

function Popup({ children }) {
  return (
    <div className="game-popup-container">
      <div className="game-popup">{children}</div>
    </div>
  );
}

export const Game = observer(() => {
  const [game] = useState(() => new GameStore());

  useEffect(() => {
    if (game.isPaused) {
      return;
    }

    const intervalId = setInterval(() => {
      game.moveBlockDown();
    }, 480);

    return () => {
      clearInterval(intervalId);
    };
  }, [game.isPaused]);

  /**
   *
   * @param {KeyboardEvent} event
   */
  function handleKeyDown(event) {
    if (event.key === "ArrowDown") {
      return game.moveBlockDown();
    }

    if (event.key === "ArrowLeft") {
      return game.moveBlockLeft();
    }

    if (event.key === "ArrowRight") {
      return game.moveBlockRight();
    }

    if (event.key === "ArrowUp") {
      return game.rotateBlock();
    }

    if (event.key === "Escape") {
      return game.togglePause();
    }
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  function handleKeyUp(event) {
    if (event.key === " ") {
      return game.dropBlock();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function onRestartGame() {
    document.querySelector(".game-area").focus();
    game.start();
  }

  return (
    <>
      {game.isGameOver && (
        <Popup>
          <div>Game over!</div>
          <div>Your score: {game.totalScore}</div>
          <button onClick={onRestartGame}>Start New Game</button>
        </Popup>
      )}

      {game.isPaused ? <Popup>Paused!</Popup> : null}

      <div className="game-layout">
        <div className="game-layout__start" />

        <div className="game-layout__middle">
          <div tabIndex="0" className="game-area">
            {game.canvas.map((color, rowIndex) => {
              return (
                <div
                  key={rowIndex}
                  className={cn("area-cell", color, color && "element")}
                />
              );
            })}
          </div>
        </div>

        <div className="game-layout__end">
          <div>Score: {game.totalScore}</div>
          <button onClick={onRestartGame}>Restart Game</button>
        </div>
      </div>
    </>
  );
});
