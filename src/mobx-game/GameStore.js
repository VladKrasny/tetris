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
   * @type {Canvas}
   */
  @observable accessor _backgroundCanvas;

  /**
   * @type {Block}
   */
  @observable accessor _fallingBlock;

  constructor() {
    this._mainCanvas = this._createEmptyCanvas();
    this._backgroundCanvas = this._createEmptyCanvas();

    this._spawnBlock();
    this._updateCanvas();
  }

  @computed get canvas() {
    return this._mainCanvas.flat();
  }

  @computed get _canFallingBlockMoveLeft() {
    const isTouchingMainCanvasOnLeft =
      this._fallingBlock.leftEdgeOnCanvas === 0;

    const isTouchingBackgroundCanvasOnLeft =
      this._checkIsFallingBlockIntersectBackgroundCanvas({
        offsetX: -1,
      });

    return !isTouchingMainCanvasOnLeft && !isTouchingBackgroundCanvasOnLeft;
  }

  @computed get _canFallingBlockMoveRight() {
    const isTouchingMainCanvasOnRight =
      this._fallingBlock.rightEdgeOnCanvas === this.#COLUMNS;

    const isTouchingBackgroundCanvasOnRight =
      this._checkIsFallingBlockIntersectBackgroundCanvas({
        offsetX: 1,
      });

    return !isTouchingMainCanvasOnRight && !isTouchingBackgroundCanvasOnRight;
  }

  @computed get _canFallingBlockMoveDown() {
    const isTouchingMainCanvasAtBottom =
      this._fallingBlock.bottomEdgeOnCanvas === this.#ROWS;

    const isTouchingBackgroundCanvasAtBottom =
      this._checkIsFallingBlockIntersectBackgroundCanvas({
        offsetY: 1,
      });

    return !isTouchingMainCanvasAtBottom && !isTouchingBackgroundCanvasAtBottom;
  }

  @action rotateBlock() {
    this._fallingBlock.rotateClockwise();
    this._updateCanvas();
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
    } else {
      this._pushFallingBlockToBackgroundCanvas();
      this._spawnBlock();
    }

    this._updateCanvas();
  }

  @action dropBlock() {
    while (this._canFallingBlockMoveDown) {
      this._fallingBlock.moveDown();
    }

    this.moveBlockDown();
  }

  @action _spawnBlock() {
    this._fallingBlock = BlockFactory.createRandom();

    this._fallingBlock.spawn(this.#COLUMNS);
  }

  @action _updateCanvas() {
    this._mainCanvas = JSON.parse(JSON.stringify(this._backgroundCanvas));

    this._fallingBlock.coordinatesOnCanvas.forEach(([x, y]) => {
      if (x >= 0 && y >= 0) {
        this._mainCanvas[y][x] = this._fallingBlock.color;
      }
    });
  }

  @action _pushFallingBlockToBackgroundCanvas() {
    this._fallingBlock.coordinatesOnCanvas.forEach(([x, y]) => {
      if (x >= 0 && y >= 0) {
        this._backgroundCanvas[y][x] = this._fallingBlock.color;
      }
    });
  }

  /**
   * @return {Canvas}
   */
  _createEmptyCanvas() {
    return new Array(this.#ROWS).fill(new Array(this.#COLUMNS).fill(0));
  }

  _checkIsFallingBlockIntersectBackgroundCanvas({
    offsetX = 0,
    offsetY = 0,
  } = {}) {
    return this._fallingBlock.coordinatesOnCanvas.some(([x, y]) => {
      return Boolean(this._backgroundCanvas[y + offsetY]?.[x + offsetX]);
    });
  }
}
