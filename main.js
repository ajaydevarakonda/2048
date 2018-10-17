(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],2:[function(require,module,exports){
// Works both in cli and browser
const {
    compose, selectInt, getColFrom2DArr, setColIn2DArr, randInt, getNonZeroNumbers, 
    bloatZerosThenNumbers, bloatNumbersThenZeros, getNumbersGreaterThan2, getArrayOfZeros    
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

    let emptyRows = 0;
    board.forEach(row => {
        if (getNumbersGreaterThan2(row).length < 1)
            ++emptyRows;
    });

    if (emptyRows == 4)
        gameTransmitter().emit('LOSE');

    return board;
}

const alertWon = () => alert("2048! You've won!");
const alertLost = () => alert("Oops! You lost!");

const cleanBoard = (rows, cols) => getArrayOfZeros(rows).map(() => getArrayOfZeros(cols));
const new4X4Board = cleanBoard.bind(null, 4, 4);

module.exports = {
    placenew, selRandEmptyCell, insert2Or4InRandEmptyCell, squishLeft, squishRight,
    squishDown, squishUp, squishBoardUp, squishBoardDown, squishBoardLeft, squishBoardRight,
    addUp, addDown, addLeft, addRight, upMove, downMove, rightMove, leftMove, 
    gameTransmitter, new4X4Board, alertWon, alertLost, cleanBoard
};

},{"../src/util":4,"events":1}],3:[function(require,module,exports){
// runs only in browser
const { insert2Or4InRandEmptyCell, upMove, downMove, rightMove, leftMove, gameTransmitter,
    alertWon, alertLost, new4X4Board
} = require("./game");
const { compose } = require("./util");

const init = () => compose(
    insert2Or4InRandEmptyCell,
    insert2Or4InRandEmptyCell,
    new4X4Board
)();

// const createRow = row => {
//     let tr = document.createElement("tr");
//     row.forEach(element => {
//         let td = document.createElement("td");
//         td.innerText = element;
//         tr.appendChild(td);
//     });
//     return tr;
// }

// const updateBoard = board => {
//     let boardDiv = document.getElementById("board");
//     let table = document.createElement("table");
//     Array.prototype.forEach.call(board, row => { table.appendChild(createRow(row)); });
//     boardDiv.innerHTML = "";
//     boardDiv.appendChild(table);
// }

var app2 = new Vue({
    el: '#app-2',
    data: {
        board: init()
    }
});

// let board = init();
// updateBoard(board);

document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() == "arrowup")
        app2.board = upMove(app2.board)
    else if (event.key.toLowerCase() == "arrowdown")
        app2.board = downMove(app2.board);
    else if (event.key.toLowerCase() == "arrowleft")
        app2.board = leftMove(app2.board)
    else if (event.key.toLowerCase() == "arrowright")
        app2.board = rightMove(app2.board)
});

gameTransmitter().on('WIN', () => app2.board = compose(init, alertWon)());
gameTransmitter().on('LOSE', () => app2.board = compose(init, alertLost)());


},{"./game":2,"./util":4}],4:[function(require,module,exports){
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
    setColIn2DArr, twoDIterate, getNumbersGreaterThan2, getArrayOfZeros
};

},{}]},{},[2,3,4]);
