const compose = (...fns) => {
    args => fns.reduceRight(
        (arg, fn) => fn(arg),
        args
    );
}

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

const fillArr = (arr, el, times) => {
    let newArr = arr.slice(); // shallow copy
    for (let i = 0; i < times; ++i) 
        newArr.push(el);
    return newArr;
}

// NOTE: error prone if the given column is out of range.
const getColAsArr = (board, col) => board.map((row) => row[col]);

const squishLeft = arr => {
    // first fill without zeros and pad with zeros
    let numbersArr = arr.filter(el => el !== 0);
    return fillArr(numbersArr, 0, arr.length - numbersArr.length);
}

const squishRight = arr => {    
    // first pad with necessary number of zeros and then add numbers.
    let numbersArr = arr.filter(el => el !== 0);
    let newArr = [];
    newArr = fillArr(newArr, 0, arr.length - numbersArr.length);
    newArr.push(...numbersArr);
    return newArr;
}

/**
 * Use this incase you have a board and you need to 
 */
const getNonZeroNumbers = (board, col) => {
    let numbersArr = [];
    for (let row = 0; row < board.length; ++row)
        if (board[row][col] >= 2)
            numbersArr.push(board[row][col]);

    return numbersArr;
}

const squishDown = (board, col) => {
    let numbersArr = getNonZeroNumbers(board, col);
    let newArr = [];
    newArr = fillArr(newArr, 0, board.length - numbersArr.length);        
    newArr.push(...numbersArr);
    let newBoard = board.slice();    
    for (let row = 0; row < board.length; ++row)
        newBoard[row][col] = newArr[row];
    return newBoard;
}

/**
 * Moves all the numbers past zero cells to the top of the board for a given column.
 * Note: This function does not squish the whole board.
 * @param {Array}   board 
 * @param {int}     col 
 * @returns {Array}         Returns a new board with given column squished to the top.
 */
const squishUp = (board, col) => {
    let numbersArr = getNonZeroNumbers(board, col);
    let newArr = fillArr(numbersArr, 0, board.length - numbersArr.length);        
    let newBoard = board.slice();
    for (let row = 0; row < board.length; ++row)
        newBoard[row][col] = newArr[row];    
    return newBoard;
}

module.exports = {
    curry, selectInt, selRandEmptyCell, placenew, insert2Or4InRandEmptyCell,
    squishLeft, squishRight, squishUp, twoDIterate, squishDown, getColAsArr
};