const curry = (fn) => {
    // get number of function arguments.
    let arity = fn.length;

    return function $curry(...args) {
        if (args.length < arity) // we just need to curry, no fn execuction
            return fn.bind(null, args);
        return fn.call(null, args);
    };
};

/**
 * Return first or second integer based on probability.
 * Impure function, necessary evil.
 * @param   {int}   int1 
 * @param   {int}   int2
 * @param   {float} firstPercentInt   Percentage of times to select first integer.
 * @returns {int}                     First integer or second integer.
 */
const selectInt = (int1, int2, firstPercentInt=0.5) => 
    (Math.random() < firstPercentInt) ? int1 : int2;

const randInt = max => Math.floor(Math.random() * max);

const selRandEmptyCell = board => {
    let emptyCells = [];
    for (let row = 0; row < board.length; ++row)
        for (let col = 0; col < board[0].length; ++col)
            if (board[row][col] === 0)
                emptyCells.push({ row, col });

    let randomCell = randInt(emptyCells.length);
    return emptyCells[randomCell];
};

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

const insert2Or4InRandEmptyCell = (board) => {
    let dupBoard = board.slice(); // shallow copy.
    let { row, col } = selRandEmptyCell(dupBoard);
    return placenew(dupBoard, row, col, selectInt(2, 4, 0.6));    
};

// row wise iteration of 2d array
const twoDIterate = (twoDArray, cb, endOfRowCb=null) => {
    for (let i = 0; i < twoDArray.length; ++i) {
        for (let j = 0; j < twoDArray[i].length; ++j) {
            cb(i, j, twoDArray[i][j]);
            if (j === twoDArray[i].length - 1 && endOfRowCb)
                endofRowCb();
        }
    }
}

module.exports = { curry, selectInt, selRandEmptyCell, placenew, insert2Or4InRandEmptyCell, twoDIterate };