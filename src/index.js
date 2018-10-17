/**
 * Normal game code, less functions, more monolithic.
 * Level 2 abstraction
 */

const { insert2Or4InRandEmptyCell, upMove, downMove, rightMove, leftMove, gameTransmitter,
    alertWon, alertLost, new4X4Board
} = require("./game");
const { compose } = require("./util");

const init = () => compose(
    insert2Or4InRandEmptyCell,
    insert2Or4InRandEmptyCell,
    new4X4Board
)();

var boardApp = new Vue({
    el: '#board-app',
    data: {
        board: init()
    }
});

document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() == "arrowup")
        boardApp.board = upMove(boardApp.board)
    else if (event.key.toLowerCase() == "arrowdown")
        boardApp.board = downMove(boardApp.board);
    else if (event.key.toLowerCase() == "arrowleft")
        boardApp.board = leftMove(boardApp.board)
    else if (event.key.toLowerCase() == "arrowright")
        boardApp.board = rightMove(boardApp.board)
});

gameTransmitter().on('WIN', () => boardApp.board = compose(init, alertWon)());
gameTransmitter().on('LOSE', () => boardApp.board = compose(init, alertLost)());

