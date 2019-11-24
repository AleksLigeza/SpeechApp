import { expect } from 'chai'
import { GameBoard } from './GameBoard';
import { left, right, up, down } from './gameConstants';

function getBoard(tiles = GameBoard.getInitState().tiles) {
    return new GameBoard(tiles);
}

function getBeforeEndTiles() {
    return [
        2, 4, 2, 4,
        4, 2, 4, 2,
        2, 4, 2, 8,
        4, 2, 8, 8
    ];
}

it('init state is with single tile', () => {
    var tiles = GameBoard.getInitState().filter(x => x > 0);
    expect(tiles).to.have.lengthOf(1);
});

it('three tiles - moves properly', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[4] = tiles[8] = tiles[12] = 2;
    board.tiles = tiles;
    
    board.move(down);

    expect(board.state('tiles')[12]).to.be.equals(4);
    expect(board.state('tiles')[8]).to.be.equals(2);
});

it('four tiles - cant move', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[0] = tiles[4] = tiles[8] = tiles[12] = 8;
    board.setState({ tiles });
    board.move(left);
    expect(board.state('tiles').filter(x => x > 0)).to.have.length(4);
});

it('is not totally blocked before the end', () => {
    var board = getBoard();
    board.move(up);
    expect(board.state('isTotallyBlocked')).to.be.eq(false);
});

it('is totally blocked after the end', () => {
    var board = getBoard();
    board.setState({ tiles: getBeforeEndTiles() });
    board.move(up);
    expect(board.state('isTotallyBlocked')).to.be.eq(true);
});

it('doesnt join multiple tiles', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[0] = 2;
    tiles[2] = 2;
    tiles[3] = 4;
    board.setState({ tiles });

    board.move(left);
    console.log(board.state('tiles'))
    expect(board.state('tiles').filter(x => x === 8)).to.have.length(0);
});