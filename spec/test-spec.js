const { insert2Or4InRandEmptyCell, twoDIterate } = require("../lib");

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