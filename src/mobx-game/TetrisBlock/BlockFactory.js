import { Block } from "./Block";
import { BlockColor } from "./BlockColor";

/**
 * @typedef {'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'} BlockName
 */

export class BlockFactory {
  /**
   * @type {BlockName[]}
   */
  static #BLOCK_NAMES = ["I", "J", "L", "O", "S", "T", "Z"];

  /**
   * @param {BlockName} blockName
   * @returns {Block}
   *
   * @throws argument `blockName` must be known to the factory
   */
  static create(blockName) {
    switch (blockName) {
      case "I": {
        return new Block([[1, 1, 1, 1]], BlockColor.random);
      }
      case "J": {
        return new Block(
          [
            [1, 0, 0],
            [1, 1, 1],
          ],
          BlockColor.random
        );
      }
      case "L": {
        return new Block(
          [
            [0, 0, 1],
            [1, 1, 1],
          ],
          BlockColor.random
        );
      }
      case "O": {
        return new Block(
          [
            [1, 1],
            [1, 1],
          ],
          BlockColor.random
        );
      }
      case "S": {
        return new Block(
          [
            [0, 1, 1],
            [1, 1, 0],
          ],
          BlockColor.random
        );
      }
      case "T": {
        return new Block(
          [
            [0, 1, 0],
            [1, 1, 1],
          ],
          BlockColor.random
        );
      }
      case "Z": {
        return new Block(
          [
            [1, 1, 0],
            [0, 1, 1],
          ],
          BlockColor.random
        );
      }
      default: {
        throw new Error("Unregistered block cannot be created");
      }
    }
  }

  /**
   * @returns {Block}
   */
  static createRandom() {
    const randomBlockNameIndex = Math.floor(
      Math.random() * BlockFactory.#BLOCK_NAMES.length
    );

    const randomBlockName = BlockFactory.#BLOCK_NAMES[randomBlockNameIndex];

    return BlockFactory.create(randomBlockName);
  }
}
