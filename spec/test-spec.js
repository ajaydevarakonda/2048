const { insert2Or4InRandEmptyCell, twoDIterate, squishUp, squishDown, getColAsArr } = require("../lib");

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

describe("getColAsArr()", function() {
    it("returns a board's column as an array", function() {
        let board = [
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
        ];

        let firstCol = getColAsArr(board, 0);
        expect(firstCol).toEqual([2, 0, 0, 4]);
    })
})