import { action, computed, observable } from "mobx";
import { BlockFactory } from "./TetrisBlock";

/**
 * @typedef {import('./TetrisBlock').Block} Block
 * @typedef {(string|0)[][]} Canvas
 */

export class GameStore {
  #ROWS = 21;
  #COLUMNS = 12;

  /**
   * @type {Canvas}
   */
  @observable accessor _mainCanvas;

  /**
   * @type {Block}
   */
  @observable accessor _fallingBlock;

  constructor() {
    this._mainCanvas = this._createEmptyCanvas();

    this._fallingBlock = BlockFactory.createRandom();

    this._fallingBlock.spawn(this.#COLUMNS);

    this._updateCanvas();
  }

  @computed get canvas() {
    return this._mainCanvas.flat();
  }

  @computed get _canFallingBlockMoveLeft() {
    return !this._fallingBlock.coordinatesOnCanvas.some(([x]) => {
      return x === 0;
    });
  }

  @computed get _canFallingBlockMoveRight() {
    return !this._fallingBlock.coordinatesOnCanvas.some(([x]) => {
      return x >= this.#COLUMNS - 1;
    });
  }

  @computed get _canFallingBlockMoveDown() {
    return !this._fallingBlock.coordinatesOnCanvas.some(([x, y]) => {
      return y >= this.#ROWS - 1;
    });
  }

  @action moveBlockLeft() {
    if (this._canFallingBlockMoveLeft) {
      this._fallingBlock.moveLeft();
      this._updateCanvas();
    }
  }

  @action moveBlockRight() {
    if (this._canFallingBlockMoveRight) {
      this._fallingBlock.moveRight();
      this._updateCanvas();
    }
  }

  @action moveBlockDown() {
    if (this._canFallingBlockMoveDown) {
      this._fallingBlock.moveDown();
      this._updateCanvas();
    }
  }

  @action _updateCanvas() {
    this._mainCanvas = this._createEmptyCanvas();

    this._fallingBlock.coordinatesOnCanvas.forEach(([x, y]) => {
      if (x >= 0 && y >= 0) {
        this._mainCanvas[y][x] = this._fallingBlock.color;
      }
    });
  }

  /**
   * @return {Canvas}
   */
  _createEmptyCanvas() {
    return new Array(this.#ROWS).fill(new Array(this.#COLUMNS).fill(0));
  }
}
