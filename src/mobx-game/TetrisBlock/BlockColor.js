export class BlockColor {
  static #COLORS = ["cyan", "blue", "orange", "yellow", "green", "pink", "red"];

  static get random() {
    const randomIndex = Math.floor(Math.random() * BlockColor.#COLORS.length);

    return BlockColor.#COLORS[randomIndex];
  }
}
