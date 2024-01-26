import { action, computed, observable } from "mobx";

/**
 * @typedef {0 | 1} Bool
 * @typedef {Bool[][]} ShapeStructure
 * @typedef {'clockwise' | 'counterclockwise'} RotationDirection
 * @typedef {1 | 2 | 3 | 4} RotationVariant
 */

export class BlockShape {
  /**
   * @type {RotationVariant[]}
   */
  static #ROTATION_VARIANTS = [1, 2, 3, 4];

  /**
   * @return {RotationVariant}
   */
  static get randomRotationVariant() {
    const randomIndex = Math.floor(
      Math.random() * BlockShape.#ROTATION_VARIANTS.length
    );

    return BlockShape.#ROTATION_VARIANTS[randomIndex];
  }

  /**
   * @type {Map<RotationVariant, ShapeStructure>}
   */
  @observable accessor _rotatedShapes;

  /**
   * @type {RotationVariant}
   */
  @observable accessor _rotationVariant;

  /**
   * @param {RotationDirection} rotationDirection
   * @param {ShapeStructure} shapeStructure
   */
  constructor(rotationDirection, shapeStructure) {
    this._rotatedShapes = new Map([[1, shapeStructure]]);

    for (let rotationVariant = 2; rotationVariant <= 4; rotationVariant += 1) {
      const prevShape = this._rotatedShapes.get(rotationVariant - 1);

      this._rotatedShapes.set(
        rotationVariant,
        rotationDirection === "clockwise"
          ? this._rotateClockwise(prevShape)
          : this._rotateCounterclockwise(prevShape)
      );
    }

    this._rotationVariant = BlockShape.randomRotationVariant;
  }

  /**
   * @return {ShapeStructure}
   */
  @computed get structure() {
    return this._rotatedShapes.get(this._rotationVariant);
  }

  @action rotateBackward() {
    const nextRotationVariant = this._rotationVariant - 1;

    this._rotationVariant = nextRotationVariant < 1 ? 4 : nextRotationVariant;
  }

  @action rotateForward() {
    const nextRotationVariant = this._rotationVariant + 1;

    this._rotationVariant = nextRotationVariant > 4 ? 1 : nextRotationVariant;
  }

  /**
   * @param {ShapeStructure} shapeStructure
   *
   * @return {ShapeStructure}
   */
  _rotateClockwise(shapeStructure) {
    const rotatedShape = [];

    const shapeWidth = shapeStructure[0].length;
    const shapeHeight = shapeStructure.length;

    for (let col = 0; col < shapeWidth; col += 1) {
      const nextRow = [];

      for (let row = shapeHeight - 1; row >= 0; row -= 1) {
        nextRow.push(shapeStructure[row][col]);
      }

      rotatedShape.push(nextRow);
    }

    return rotatedShape;
  }

  /**
   * @param {ShapeStructure} shapeStructure
   *
   * @return {ShapeStructure}
   */
  _rotateCounterclockwise(shapeStructure) {
    const rotatedShape = [];

    const shapeWidth = shapeStructure[0].length;
    const shapeHeight = shapeStructure.length;

    for (let col = shapeWidth - 1; col >= 0; col -= 1) {
      let nextRow = [];

      for (let row = 0; row < shapeHeight; row += 1) {
        nextRow.push(shapeStructure[row][col]);
      }

      rotatedShape.push(nextRow);
    }

    return rotatedShape;
  }
}
