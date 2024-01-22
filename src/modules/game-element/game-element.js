import { AREA_COLUMNS } from "../../game.config";
import {
  getShapeSize,
  getRandomShape,
  rotateShapeRight,
  rotateShapeLeft,
} from "../shape/shape";
import { COLOR_CLASSES } from "./game-element.const";

/**
 * @typedef {import('../shape/shape.js').Shape} Shape
 */

/**
 * @typedef {Object} GameElement
 * @property {Shape} shape
 * @property {number} x
 * @property {number} y
 * @property {string} color
 */

/**
 * @returns {Shape}
 */
export function getRandomColor() {
  const list = Object.values(COLOR_CLASSES);
  const randomListIndex = Math.floor(Math.random() * list.length);

  return JSON.parse(JSON.stringify(list[randomListIndex]));
}

/**
 * @param {Shape} shape
 * @returns {GameElement}
 */
export function creteGameElement(shape) {
  const { width, height } = getShapeSize(shape);

  return {
    color: getRandomColor(),
    shape: JSON.parse(JSON.stringify(shape)),
    x: Math.floor((AREA_COLUMNS - width) / 2),
    y: -height,
  };
}

export function getRandomGameElement() {
  return creteGameElement(getRandomShape());
}

/**
 * @param {GameElement} gameElement
 * @param {number} y
 * @returns {GameElement}
 */
export function teleportGameElementOnY(gameElement, y) {
  return {
    ...gameElement,
    y: y - gameElement.shape.length,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function flowGameElement(gameElement) {
  return {
    ...gameElement,
    y: gameElement.y + 1,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function leftGameElement(gameElement) {
  return {
    ...gameElement,
    x: gameElement.x - 1,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rightGameElement(gameElement) {
  return {
    ...gameElement,
    x: gameElement.x + 1,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rotateGameElementRight(gameElement) {
  const shape = rotateShapeRight(gameElement.shape);

  return {
    ...gameElement,
    ...getShapeSize(shape),
    shape,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {GameElement}
 */
export function rotateGameElementLeft(gameElement) {
  const shape = rotateShapeLeft(gameElement.shape);

  return {
    ...gameElement,
    ...getShapeSize(shape),
    shape,
  };
}

/**
 * @param {GameElement} gameElement
 * @returns {([number, number])[]}
 */
export function getElementCells(gameElement) {
  const elementCellsOnField = [];

  gameElement.shape.forEach((row, indexY) => {
    row.forEach((value, indexX) => {
      if (value === 1) {
        elementCellsOnField.push([
          gameElement.x + indexX,
          gameElement.y + indexY,
        ]);
      }
    });
  });

  return elementCellsOnField;
}
