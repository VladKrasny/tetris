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

  /**
   * @type {boolean}
   */
  @observable accessor _isPaused = false;

  /**
   * @type {number}
   */
  @observable accessor _removedLinesCounter = 0;

  constructor() {
    this.start();
  }

  @computed get canvas() {
    return this._mainCanvas.flat();
  }

  @computed get isPaused() {
    return this._isPaused;
  }

  @computed get isGameOver() {
    const isBlockStuck = !this._canFallingBlockMoveDown;
    const isBlockOutOfCanvas = this._fallingBlock.bottomEdgeOnCanvas <= 0;

    return isBlockStuck && isBlockOutOfCanvas;
  }

  @computed get totalScore() {
    return this._removedLinesCounter;
  }

  @computed get _areControlsDisabled() {
    return this.isPaused || this.isGameOver;
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

  @action start() {
    this._mainCanvas = this._createEmptyCanvas();
    this._backgroundCanvas = this._createEmptyCanvas();

    this._spawnBlock();
    this._updateCanvas();
  }

  @action rotateBlock() {
    if (this._areControlsDisabled) {
      return;
    }

    this._fallingBlock.rotateClockwise();
    this._updateCanvas();
  }

  @action moveBlockLeft() {
    if (this._areControlsDisabled) {
      return;
    }

    if (this._canFallingBlockMoveLeft) {
      this._fallingBlock.moveLeft();
      this._updateCanvas();
    }
  }

  @action moveBlockRight() {
    if (this._areControlsDisabled) {
      return;
    }

    if (this._canFallingBlockMoveRight) {
      this._fallingBlock.moveRight();
      this._updateCanvas();
    }
  }

  @action moveBlockDown() {
    if (this._areControlsDisabled) {
      return;
    }

    if (this._canFallingBlockMoveDown) {
      this._fallingBlock.moveDown();
    } else {
      this._pushFallingBlockToBackgroundCanvas();
      this._removeLinesFromBackgroundCanvas();
      this._spawnBlock();
    }

    this._updateCanvas();
  }

  @action dropBlock() {
    if (this._areControlsDisabled) {
      return;
    }

    while (this._canFallingBlockMoveDown) {
      this._fallingBlock.moveDown();
    }

    this.moveBlockDown();
  }

  @action togglePause() {
    if (this.isGameOver) {
      return;
    }

    this._isPaused = !this._isPaused;
  }

  @action _removeLinesFromBackgroundCanvas() {
    this._backgroundCanvas = this._backgroundCanvas
      .map((canvasRow) => {
        const isEveryColumnColored = canvasRow.every((x) => Boolean(x));

        if (isEveryColumnColored) {
          this._removedLinesCounter += 1;

          return this._createEmptyCanvasRow();
        }

        return canvasRow;
      })
      .sort((row1, row2) => {
        const isRow1Empty = row1.some((x) => Boolean(x));
        const isRow2Empty = row2.some((x) => Boolean(x));

        if (isRow1Empty && isRow2Empty) {
          return 0;
        }

        if (isRow1Empty && !isRow2Empty) {
          return 1;
        }

        if (isRow2Empty && !isRow1Empty) {
          return -1;
        }
      });
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
    return new Array(this.#ROWS).fill(this._createEmptyCanvasRow());
  }

  /**
   * @return {0[]}
   */
  _createEmptyCanvasRow() {
    return new Array(this.#COLUMNS).fill(0);
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
