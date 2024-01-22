# Tetris

It's a collaborative project initiated two years ago by myself and [Illia Obukhau](https://github.com/iobuhov). It was originally conceived as a simple experiment in which we explored the nuances of Effector for state management. The project, which started in a private repository, is now being exposed and shared publicly.

## Game Specs

1. The game field is a grid of 12 columns by 21 rows
2. There are 7 types of blocks
3. The game progresses at a steady speed, with one "tick" per second
4. There can only be one falling block at a time
5. Players can move the falling block left or right
6. Players can rotate the falling block clockwise
7. Completed horizontal lines clear, making room for new blocks
8. Players earn points for each cleared line
9. Players can pause the game and resume at any time
10. If a new block cannot enter the field, the game ends

### TODO

11. Players can see a preview of the next block that will enter the field
12. As players score more points, the game speed increases, creating a sense of progression
13. Keep track of high scores in a record table

## Controls

- **Left Arrow**: Move the falling block to the left
- **Right Arrow**: Move the falling block to the right
- **Up Arrow**: Rotate the falling block clockwise.
- **Down Arrow**: Accelerate the descent of the falling block
- **Spacebar**: Instantly drop the falling block to the lowest possible position
