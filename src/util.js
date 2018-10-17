// Works both in cli and browser
let compose = (...fns) => (args) => fns.reduceRight((accumulator, fn) => fn(accumulator), args);

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

// Get col from 2d array
// NOTE: error prone if the given column is out of range.
const getColFrom2DArr = ({ twoDArray, colNo }) => twoDArray.map(row => row[colNo]);
const setColIn2DArr = (twoDArray, colNo, col) => twoDArray.map(
    // [all before columns, our number, all after columns]
    (row, index) => [...row.slice(0, colNo), col[index], ...row.slice(colNo+1)]
);

// return non zero values in an array.
const getNonZeroNumbers = (minNumber, arr) => arr.filter(num => num >= minNumber);
const getNumbersGreaterThan2 = getNonZeroNumbers.bind(null, 2);

const getArrayOfZeros = numberOfZeros =>
    Array.apply(null, Array(numberOfZeros)).map(Number.prototype.valueOf, 0);

// extends an array
const extend = (arr, otherArr) => arr.push(...otherArr);

const bloatArrayWithZeros = (zerosComeFirst, arr, numberOfZeros) => {        
    if (zerosComeFirst) { // zeros, non zero numbers
        let newArr = [];    
        newArr = getArrayOfZeros(numberOfZeros);
        extend(newArr, arr);
        return newArr;
    } else { // non zero numbers, zeros        
        let newArr = arr.slice(); // shallow copy or we'll endup pushing into arr.        
        extend(newArr, getArrayOfZeros(numberOfZeros));        
        return newArr;        
    }
};
const bloatZerosThenNumbers = bloatArrayWithZeros.bind(null, true);
const bloatNumbersThenZeros = bloatArrayWithZeros.bind(null, false);


module.exports = {
    bloatArrayWithZeros, bloatNumbersThenZeros, bloatZerosThenNumbers, compose, curry,
    getColFrom2DArr, getNonZeroNumbers, selectInt, randInt, setColIn2DArr, 
    setColIn2DArr, twoDIterate, getNumbersGreaterThan2
};
