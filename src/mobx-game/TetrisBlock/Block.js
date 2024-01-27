import { action, computed, observable } from "mobx";
import { BlockShape } from "./BlockShape";

/**
 * @typedef {import('./BlockShape').ShapeStructure} ShapeStructure
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
   * @param {ShapeStructure} shapeStructure
   * @param {string} color
   */
  constructor(shapeStructure, color) {
    this._shape = new BlockShape("clockwise", shapeStructure);

    this._color = color;
  }

  @computed get color() {
    return this._color;
  }

  @computed get leftEdgeOnCanvas() {
    return this._offsetX;
  }

  @computed get rightEdgeOnCanvas() {
    return this._offsetX + this._width;
  }

  @computed get bottomEdgeOnCanvas() {
    return this._offsetY + this._height;
  }

  /**
   * @return {number[][]}
   */
  @computed get coordinatesOnCanvas() {
    const result = [];

    this._shape.structure.forEach((row, indexY) => {
      row.forEach((col, indexX) => {
        if (col === 1) {
          result.push([this._offsetX + indexX, this._offsetY + indexY]);
        }
      });
    });

    return result;
  }

  @computed get _width() {
    return this._shape.structure[0].length;
  }

  @computed get _height() {
    return this._shape.structure.length;
  }

  @action spawn(columns) {
    this._offsetX = Math.floor((columns - this._width) / 2);
    this._offsetY = this._height * -1;
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
    this._shape.rotateForward();
  }

  @action rotateCounterclockwise() {
    this._shape.rotateBackward();
  }
}
