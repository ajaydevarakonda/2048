const { insert2Or4InRandEmptyCell, upMove, downMove, rightMove, leftMove } = require("./src/game");

let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

// add 2 new numbers (2 or 4, based on some probab) to board.
board = insert2Or4InRandEmptyCell(board);
board = insert2Or4InRandEmptyCell(board);

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 38:
            board = upMove(board);
            break;
        case 40:
            board = downMove(board);
            break;
        case 37: 
            board = leftMove(board);
        case 39:
            board = rightMove(board);
    }
});

