const {
    compose, selectInt, getColFrom2DArr, setColIn2DArr, randInt, getNonZeroNumbers, 
    bloatZerosThenNumbers, bloatNumbersThenZeros, getNumbersGreaterThan2
} = require("../src/util");

const EventEmitter = require("events");

const createEventEmitter = () => {
    let gameTransmitter = new EventEmitter();
    return () => gameTransmitter;
}

const gameTransmitter = createEventEmitter();

/**
 * Updates board's given cell with given value.
 * @param {Array}   board 
 * @param {int}     row
 * @param {int}     col
 * @param {int}     value
 * @returns {Object} Returns new state of board with new tile's value.
 */
const placenew = (board, row, col, value) => {
    let dupBoard = board.slice(); // shallow copy.
    dupBoard[row][col] = value;
    return dupBoard;
};

const selRandEmptyCell = board => {
    let emptyCells = [];
    for (let row = 0; row < board.length; ++row)
        for (let col = 0; col < board[0].length; ++col)
            if (board[row][col] === 0)
                emptyCells.push({ row, col });

    let randomCell = randInt(emptyCells.length);
    return emptyCells[randomCell];
};

const insert2Or4InRandEmptyCell = (board) => {
    let dupBoard = board.slice(); // shallow copy.
    let { row, col } = selRandEmptyCell(dupBoard);
    return placenew(dupBoard, row, col, selectInt(2, 4, 0.6));    
};

const squishLeft = arr => {
    // TODO: simplify using compose and the new functions
    // first fill without zeros and pad with zeros
    let numbersArr = arr.filter(el => el !== 0);
    return bloatNumbersThenZeros(numbersArr, arr.length - numbersArr.length);
}

const squishRight = arr => {    
    // TODO: simplify using compose and the new functions
    // first pad with necessary number of zeros and then add numbers.
    let numbersArr = arr.filter(el => el !== 0);
    let newArr = [];
    newArr = bloatNumbersThenZeros(newArr, arr.length - numbersArr.length);
    newArr.push(...numbersArr);
    return newArr;
}

const squishDown = (board, colNo) => {
    let setThisColInBoard = setColIn2DArr.bind(null, board, colNo);
    
    return compose(
        setThisColInBoard, // most local function.
        (nonZerosArr => bloatZerosThenNumbers(nonZerosArr, board.length - nonZerosArr.length)),
        getNumbersGreaterThan2,
        getColFrom2DArr,
    )({ twoDArray: board, colNo });
}

/**
 * Moves all the numbers past zero cells to the top of the board for a given column.
 * Note: This function does not squish the whole board.
 * @param   {Array}   board 
 * @param   {int}     col 
 * @returns {Array}         Returns a new board with given column squished to the top.
 */
const squishUp = (board, colNo) => {    
    let setThisColInBoard = setColIn2DArr.bind(null, board, colNo);

    return compose(
        setThisColInBoard, // most local function
        (nonZerosArr => bloatNumbersThenZeros(nonZerosArr, board.length - nonZerosArr.length)),
        getNumbersGreaterThan2,
        getColFrom2DArr,
    )({ twoDArray: board, colNo });
    
}

const squishBoardUp = board => {
    let newBoard = board.slice();
    // as a board as many columns as rows
    for (let colNo = 0; colNo < board.length; ++colNo)
        newBoard = squishUp(newBoard, colNo);        
    return newBoard;
}

const squishBoardDown = board => {
    let newBoard = board.slice();
    for (let colNo = 0; colNo < board.length; ++colNo)
        newBoard = squishDown(newBoard, colNo);        
    return newBoard;
}

const squishBoardRight = board => board.map((row) => squishRight(row));
const squishBoardLeft = board => board.map((row) => squishLeft(row));

const addUp = (board) => {
    let newBoard = board.slice();    
    for (let row = 1; row < newBoard.length; ++row) {
        for (let col = 0; col < newBoard[row].length; ++col) {            
            if (newBoard[row][col] === newBoard[row-1][col]) {                                
                newBoard[row-1][col] *= 2;
                newBoard[row][col] = 0;
            }
        }
    }    
    return newBoard;
}

const addDown = board => {    
    let newBoard = board.slice();    
    for (let row = 0; row < newBoard.length - 1; ++row) {
        for (let col = 0; col < newBoard[row].length; ++col) {            
            if (newBoard[row][col] === newBoard[row+1][col]) {                                
                newBoard[row+1][col] *= 2;
                newBoard[row][col] = 0;
            }
        }
    }    
    return newBoard;
}

const addRight = (board) => {
    let newBoard = board.slice();    
    for (let row = 0; row < newBoard.length; ++row) {
        for (let col = 0; col < newBoard[row].length - 1; ++col) {            
            if (newBoard[row][col] === newBoard[row][col+1]) {                                
                newBoard[row][col+1] *= 2;
                newBoard[row][col] = 0;
            }
        }
    }    
    return newBoard;
}

const addLeft = (board) => {
    let newBoard = board.slice();    
    for (let row = 0; row < newBoard.length; ++row) {
        for (let col = 0; col < newBoard[row].length; ++col) {                        
            if (newBoard[row][col] === newBoard[row][col-1]) {                                
                newBoard[row][col-1] *= 2;
                newBoard[row][col] = 0;
            }
        }
    }
   return newBoard;
}

const upMove = (board) => 
    compose(checkIfWon, insert2Or4InRandEmptyCell, squishBoardUp, addUp, squishBoardUp)(board);

const downMove = (board) => 
    compose(checkIfWon, insert2Or4InRandEmptyCell, squishBoardDown, addDown, squishBoardDown)(board);

const rightMove = board =>
    compose(checkIfWon, insert2Or4InRandEmptyCell, squishBoardRight, addRight, squishBoardRight)(board);

const leftMove = board =>
    compose(checkIfWon, insert2Or4InRandEmptyCell, squishBoardLeft, addLeft, squishBoardLeft)(board);

const checkIfWon = board => {    
    board.forEach(row =>
        row.forEach(cell => {
            if (cell === 2048)
                gameTransmitter().emit('WIN');
        })
    );
    return board;
}

const alertWon = () => alert("2048! You've won!");
const cleanBoard = (rows, cols) => (new Array(rows)).map(() => getArrayOfZeros(cols))
const new4X4Board = cleanBoard.bind(4, 4);

module.exports = {
    placenew, selRandEmptyCell, insert2Or4InRandEmptyCell, squishLeft, squishRight,
    squishDown, squishUp, squishBoardUp, squishBoardDown, squishBoardLeft, squishBoardRight,
    addUp, addDown, addLeft, addRight, upMove, downMove, rightMove, leftMove, 
    gameTransmitter, new4X4Board
}