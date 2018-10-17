// runs only in browser
const { insert2Or4InRandEmptyCell, upMove, downMove, rightMove, leftMove, gameTransmitter,
    alertWon, new4X4Board
} = require("./game");
const { compose } = require("./util");

const init = () => compose(
        insert2Or4InRandEmptyCell,
        insert2Or4InRandEmptyCell,
        new4X4Board
    )();

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
    Array.prototype.forEach.call(board, row => { table.appendChild(createRow(row)); } );
    boardDiv.innerHTML = "";
    boardDiv.appendChild(table);    
}

let board = init();
updateBoard(board);

document.addEventListener('keydown', event => {
    let hasClickedDirKey = true;
    console.log(event.key.toLowerCase())
    if (event.key.toLowerCase() == "arrowup") {
        board = upMove(board)
    } else if (event.key.toLowerCase() == "arrowdown") {
        board = downMove(board);
    } else if (event.key.toLowerCase() == "arrowleft") {
        board = leftMove(board)
    } else if (event.key.toLowerCase() == "arrowright") {
        board = rightMove(board)
    } else {
        hasClickedDirKey = false;
    }
    
    if (hasClickedDirKey)
        updateBoard(board);
});

gameTransmitter().on('WIN', () => board = compose(new4X4Board, alertWon)());