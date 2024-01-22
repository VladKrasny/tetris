import { AREA_COLUMNS, AREA_ROWS } from "../../game.config";
import {
  getRandomGameElement,
  getElementCells,
  flowGameElement,
  teleportGameElementOnY,
} from "../game-element/game-element";

/**
 * @typedef {import('../game-element/game-element.js').GameElement} GameElement
 */

/**
 * @typedef {(string|0)[][]} GameField
 */

/**
 * @typedef {Object} Game
 * @property {number} timestamp
 * @property {GameField} area
 * @property {GameField} canvas
 * @property {GameElement} activeElement
 * @property {number} score
 * @property {boolean} paused
 * @property {boolean} gameOver
 */

const defaultEmptyRow = Array(AREA_COLUMNS).fill(0);

function createEmptyRow() {
  return [...defaultEmptyRow];
}

/**
 * @returns {GameField}
 */
function createGameField() {
  return Array(AREA_ROWS).fill(createEmptyRow());
}

/**
 * @returns {Game}
 */
export function createGame() {
  return {
    timestamp: Date.now(),
    score: 0,
    paused: false,
    gameOver: false,
    area: createGameField(),
    canvas: createGameField(),
    activeElement: getRandomGameElement(),
  };
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function updateGameCanvas(game) {
  return {
    ...game,
    canvas: merge(game.area, game.activeElement),
  };
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function startNewElement(game) {
  return {
    ...game,
    area: merge(game.area, game.activeElement),
    activeElement: getRandomGameElement(),
  };
}

/**
 * @param {Game} game
 * @param {Function} reducer
 * @returns {Game}
 */
export function updateGameElement(game, reducer) {
  return {
    ...game,
    activeElement: reducer(game.activeElement),
  };
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function teleportActiveElement(game) {
  const elementCells = getElementCells(game.activeElement);
  const maxY = elementCells.reduce((result, [_, y]) => Math.max(result, y), 0);
  const searchY = maxY + 1;
  const columns = [...new Set(elementCells.map(([x]) => x))];

  const firstNotEmptyY = game.area
    .slice(searchY)
    .findIndex((row) => columns.some((x) => row[x]));

  const cellY = firstNotEmptyY !== -1 ? searchY + firstNotEmptyY : AREA_ROWS;

  return updateGameElement(game, (element) =>
    teleportGameElementOnY(element, cellY - 1)
  );
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {Boolean}
 */
export function checkFieldAndElementIntersection(field, element) {
  return getElementCells(element).some(([x, y]) => {
    return !!(field[y] && field[y][x]);
  });
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {Boolean}
 */
export function isElementOutOfFieldByX(field, element) {
  const columns = field[0].length;

  return getElementCells(element).some(([x]) => {
    return x < 0 || x >= columns;
  });
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {boolean}
 */
export function isElementReachBottom(field, element) {
  return getElementCells(element).some(([, y]) => {
    return y === field.length - 1;
  });
}

/**
 * @param {Game} game
 * @returns {boolean}
 */
export function isElementStuck(game) {
  return (
    isElementReachBottom(game.area, game.activeElement) ||
    checkFieldAndElementIntersection(
      game.area,
      flowGameElement(game.activeElement)
    )
  );
}

/**
 * @param {(string|0)[]} row
 * @returns {(string|0)[]}
 */
function replaceFullRow(row) {
  return row.every((x) => !!x) ? createEmptyRow() : row;
}

/**
 * Sort rows, put not empty at the bottom
 * @param {(string|0)[]} row1
 * @param {(string|0)[]} row2
 * @returns {number}
 */
function emptyFirst(row1, row2) {
  const isRow1Empty = row1.some((x) => !!x);
  const isRow2Empty = row2.some((x) => !!x);

  if (isRow1Empty && isRow2Empty) {
    return 0;
  }

  if (isRow1Empty && !isRow2Empty) {
    return 1;
  }

  if (isRow2Empty && !isRow1Empty) {
    return -1;
  }
}

/**
 * @param {GameField} gameField
 * @returns {GameField}
 */
function removeLinesFromArea(gameField) {
  return gameField.map(replaceFullRow).sort(emptyFirst);
}

/**
 * @param {GameField} gameField
 * @param {number} score - initial score
 * @returns {number}
 */
function incScore(gameField, score) {
  return gameField.reduce(
    (acc, row) => (row.every((x) => !!x) ? acc + 1 : acc),
    score
  );
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function removeGameLines(game) {
  return {
    ...game,
    area: removeLinesFromArea(game.area),
    score: incScore(game.area, game.score),
  };
}

/**
 * @param {GameField} field
 * @param {GameElement} element
 * @returns {GameField}
 */
export function merge(field, element) {
  const fieldCopy = JSON.parse(JSON.stringify(field));
  const elementCellsOnField = getElementCells(element);

  return elementCellsOnField.reduce((fieldResult, [x, y]) => {
    if (x >= 0 && y >= 0) {
      fieldResult[y][x] = element.color;
    }

    return fieldResult;
  }, fieldCopy);
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function toggleGamePause(game) {
  return { ...game, paused: !game.paused };
}

/**
 * @param {Game} game
 * @returns {Game}
 */
export function updateGameOver(game) {
  const gameOver = getElementCells(game.activeElement).some(([_, y]) => y < 0);
  return {
    ...game,
    gameOver,
    paused: gameOver || game.paused,
  };
}

/**
 * @param {Game} state
 */
export function gameUpdate(state) {
  if (
    isElementOutOfFieldByX(state.area, flowGameElement(state.activeElement))
  ) {
    return state;
  }

  if (isElementStuck(state)) {
    const nextState = updateGameOver(state);

    if (nextState.gameOver) {
      return nextState;
    }

    return removeGameLines(startNewElement(state));
  }

  const nextState = updateGameElement(state, flowGameElement);

  return updateGameCanvas(nextState);
}
