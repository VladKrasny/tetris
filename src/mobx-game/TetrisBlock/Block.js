import { action, computed, observable } from "mobx";

/**
 * @typedef {0 | 1} Bool
 * @typedef {Bool[][]} BlockShape
 */

export class Block {
  /**
   * @type {BlockShape}
   */
  @observable accessor _shape;

  /**
   * @type {string}
   */
  @observable accessor _color;

  /**
   * @type {number}
   */
  @observable accessor _offsetX;

  /**
   * @type {number}
   */
  @observable accessor _offsetY;

  /**
   * @param {BlockShape} shape
   */
  constructor(shape, color) {
    this._shape = shape;
    this._color = color;
  }

  @computed get shape() {
    return this._shape;
  }

  @computed get color() {
    return this._color;
  }

  @computed get width() {
    return this._shape[0].length;
  }

  @computed get height() {
    return this._shape.length;
  }

  @computed get offsetX() {
    return this._offsetX;
  }

  @computed get offsetY() {
    return this._offsetY;
  }

  /**
   * @return {number[][]}
   */
  @computed get coordinatesOnCanvas() {
    const result = [];

    this._shape.forEach((row, indexY) => {
      row.forEach((col, indexX) => {
        if (col === 1) {
          result.push([this._offsetX + indexX, this._offsetY + indexY]);
        }
      });
    });

    return result;
  }

  @action spawn(columns) {
    this._offsetX = Math.floor((columns - this.width) / 2);
    this._offsetY = this.height * -1;
  }

  @action moveLeft() {
    this._offsetX = this._offsetX - 1;
  }

  @action moveRight() {
    this._offsetX = this._offsetX + 1;
  }

  @action moveDown() {
    this._offsetY = this._offsetY + 1;
  }

  @action rotateClockwise() {
    const updatedShape = [];

    for (let col = 0; col < this.width; col += 1) {
      const nextRow = [];

      for (let row = this.height - 1; row >= 0; row -= 1) {
        nextRow.push(this._shape[row][col]);
      }

      updatedShape.push(nextRow);
    }

    this._shape = updatedShape;
  }
}
