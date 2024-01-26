import { useState, useEffect } from "react";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import { GameStore } from "./GameStore";

export const Game = observer(() => {
  const [game] = useState(() => new GameStore());

  useEffect(() => {
    const intervalId = setInterval(() => {
      game.moveBlockDown();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      // TODO
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

  return (
    <div className="game-layout">
      <div className="game-layout__start"></div>

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

      <div className="game-layout__end"></div>
    </div>
  );
});
