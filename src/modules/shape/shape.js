import * as SHAPE from "./shape.const";

/**
 * @typedef {number[][]} Shape
 */

/**
 * @param {Shape} shape
 * @returns {{width: number; height: number;}}
 */
export function getShapeSize(shape) {
  return {
    width: shape[0].length,
    height: shape.length,
  };
}

/**
 * @returns {Shape}
 */
export function getRandomShape() {
  const list = Object.values(SHAPE);
  const randomListIndex = Math.floor(Math.random() * list.length);

  return JSON.parse(JSON.stringify(list[randomListIndex]));
}

/**
 * @param {Shape} shape
 * @returns {Shape}
 */
export function rotateShapeRight(shape) {
  const result = [];
  let rowLen = shape.length;
  let colLen = shape[0].length;

  for (let col = 0; col < colLen; col++) {
    let nextRow = [];

    for (let row = rowLen - 1; row >= 0; row--) {
      nextRow.push(shape[row][col]);
    }

    result.push(nextRow);
  }

  return result;
}

/**
 * @param {Shape} shape
 * @returns {Shape}
 */
export function rotateShapeLeft(shape) {
  const result = [];
  let rowLen = shape.length;
  let colLen = shape[0].length;

  for (let col = colLen - 1; col >= 0; col--) {
    let nextRow = [];

    for (let row = 0; row < rowLen; row++) {
      nextRow.push(shape[row][col]);
    }

    result.push(nextRow);
  }

  return result;
}
