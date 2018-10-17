// runs only on node
const { compose, twoDIterate, setColIn2DArr, getColFrom2DArr, } = require("../src/util");
const { insert2Or4InRandEmptyCell, squishUp, squishDown, squishBoardUp,
squishBoardDown, squishBoardLeft, squishBoardRight, addUp, addDown, downMove, rightMove, leftMove,
addLeft, addRight, upMove, checkIfWon, gameTransmitter, new4X4Board, cleanBoard } = require("../src/game");



describe("insert2Or4InRandEmptyCell()", function() {
    it("inserts 2 or 4 into the board", function() {
        let board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
        
        let newBoard = insert2Or4InRandEmptyCell(board);
        let flag = false;
        twoDIterate(
            newBoard,
            (i, j, val) => (flag = (val >= 2) ? !flag : flag)
        );
        return flag;
    })
});

describe("squishUp()", function() {
    it("squishes board bottom up", function() {
        let board = [
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
        ];

        let newBoard = squishUp(board, 0);        
        expect(newBoard).toEqual([
            [2, 0, 0, 0],
            [4, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ])
    })
});

describe("squishDown()", function() {
    it("squishes board top down", function() {
        let board = [
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
        ];

        let newBoard = squishDown(board, 0);        
        expect(newBoard).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [4, 0, 0, 0],
        ]);
    });
});

describe("getColFrom2DArr()", function() {
    it("returns a board's column as an array", function() {
        let board = [
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
        ];

        let firstCol = getColFrom2DArr({ twoDArray: board, colNo: 0 });
        expect(firstCol).toEqual([2, 0, 0, 4]);
    })
});

describe("setColIn2DArr()", function() {
    it("sets column values in a 2d board", function() {
        let board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        let newBoard = setColIn2DArr(board, 0, [2, 0, 0, 4]);
        expect(newBoard).toEqual([
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
        ]);
    })
})

describe("compose()", function() {
    it("composes the functions and returns their cumulative result", function() {
        let fn = () => 1;
        let fn1 = a => a * 2;
        expect(compose(fn1, fn)()).toEqual(2);
    })
})

describe("squishBoardUp()", function() {
    it("squishes the whole board up", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 4, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = squishBoardUp(board);
        expect(newBoard).toEqual([
            [2, 2, 2, 2],
            [4, 4, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]);
        
    });
});

describe("squishBoardDown()", function() {
    it("squishes the whole board down", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 4, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = squishBoardDown(board);
        expect(newBoard).toEqual([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [4, 4, 2, 2],
        ]);
        
    });
});

describe("squishBoardRight()", function() {
    it("squishes the whole board to the right", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 4, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = squishBoardRight(board);
        expect(newBoard).toEqual([
            [0, 0, 2, 2],
            [0, 0, 2, 2],
            [0, 0, 4, 2],
            [0, 0, 4, 2],
        ]);        
    });
});

describe("squishBoardLeft()", function() {
    it("squishes the whole board to the right", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 4, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = squishBoardLeft(board);
        expect(newBoard).toEqual([
            [2, 2, 0, 0,],
            [2, 2, 0, 0,],
            [4, 2, 0, 0,],
            [4, 2, 0, 0,],
        ]);        
    });
});

describe("addUp()", function() {
    it("Adds two numbers if they are the same in the UP direction.", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = addUp(board);
        expect(newBoard).toEqual([
            [2, 0, 2, 0],
            [0, 4, 0, 2],
            [0, 0, 2, 0],
            [4, 0, 0, 2],
        ]);        
    })
})

describe("addDown()", function() {
    it("Adds two numbers if they are the same in the DOWN direction.", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = addDown(board);
        expect(newBoard).toEqual([
            [2, 0, 2, 0],
            [0, 0, 0, 2],
            [0, 4, 2, 0],
            [4, 0, 0, 2],
        ]);        
    })
});

describe("addLeft()", function() {
    it("Adds two numbers if they are the same in the LEFT direction.", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = addLeft(board);
        expect(newBoard).toEqual([
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 4, 0, 0],
            [4, 0, 0, 2],
        ]);        
    })
});

describe("addRight()", function() {
    it("Adds two numbers if they are the same in the RIGHT direction.", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = addRight(board);
        expect(newBoard).toEqual([
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 0, 4, 0],
            [4, 0, 0, 2],
        ]);        
    })
});

describe("upMove()", function() {
    it("Makes the upward move", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = upMove(board);
        expect(newBoard[0][0]).toEqual(2);
        expect(newBoard[0][1]).toEqual(4);
        expect(newBoard[0][2]).toEqual(4);
        expect(newBoard[0][3]).toEqual(4);
        expect(newBoard[1][0]).toEqual(4);        
    })
});

describe("downMove()", function(){
    it("Makes the downward move", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = downMove(board);
        // [0, 0, 0, 0],
        // [0, 0, 0, 0],
        // [2, 0, 0, 0],
        // [4, 4, 4, 4],
        expect(newBoard[2][0]).toEqual(2);
        expect(newBoard[3][0]).toEqual(4);
        expect(newBoard[3][1]).toEqual(4);
        expect(newBoard[3][2]).toEqual(4);
        expect(newBoard[3][3]).toEqual(4);        
    });
})

describe("rightMove()", function(){
    it("Makes the rightward move", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = rightMove(board);

        expect(newBoard[0][3]).toEqual(4);
        expect(newBoard[1][3]).toEqual(4);
        expect(newBoard[2][3]).toEqual(4);
        expect(newBoard[3][2]).toEqual(4);
        expect(newBoard[3][3]).toEqual(2);
    });
})

describe("leftMove()", function(){
    it("Makes the leftward move", function() {
        let board = [
            [2, 0, 2, 0],
            [0, 2, 0, 2],
            [0, 2, 2, 0],
            [4, 0, 0, 2],
        ];

        let newBoard = leftMove(board);
        expect(newBoard[0][0]).toEqual(4);
        expect(newBoard[1][0]).toEqual(4);
        expect(newBoard[2][0]).toEqual(4);
        expect(newBoard[3][0]).toEqual(4);
        expect(newBoard[3][1]).toEqual(2);
    });
});

describe("new4X4Board()", function() {
    it("Creates a new 4X4 board", function() {
        let board = new4X4Board();
        expect(board.length).toEqual(4);
        expect(board[0].length).toEqual(4);
    });
});

