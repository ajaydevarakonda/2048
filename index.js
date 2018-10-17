// runs only in browser
import { insert2Or4InRandEmptyCell, upMove, downMove, rightMove, leftMove, gameTransmitter,
    alertWon, new4X4Board
} from "./src/game";

const init = () => compose(
        insert2Or4InRandEmptyCell,
        new4X4Board
    );

const createRow = row => {
    let tr = document.createElement("tr");
    row.forEach(element => {
        let td = document.createElement("td");
        td.innerText = element;
        tr.appendChild(td);    
    });
    return tr;
}

const updateBoard = board => {
    let boardDiv = document.getElementById("board");
    let table = document.createElement("table");

    board.forEach(row => table.appendChild(createRow(row)));
    boardDiv.appendChild(table);
    console.log(boardDiv)
}

let board = init();
updateBoard(board);

document.addEventListener('keydown', event => {
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
    updateBoard(board);
});

gameTransmitter().addEventListener('WIN', () => board = compose(new4X4Board, alertWon));