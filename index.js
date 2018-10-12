const { insert2Or4InRandEmptyCell } = require("./lib");

let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

// add 2 new numbers (2 or 4, based on some probab) to board.
board = insert2Or4InRandEmptyCell(board);
board = insert2Or4InRandEmptyCell(board);
console.log(board)


