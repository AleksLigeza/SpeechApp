import { expect } from 'chai'
import { GameBoard } from './GameBoard';
import { left, right, up, down } from './gameConstants';
import { GameTile } from './GameTile';

function getBoard(tiles = GameBoard.getInitState()) {
    return new GameBoard(tiles);
}

function getBeforeEndTiles() {
    return [
        2, 4, 2, 4,
        4, 2, 4, 2,
        2, 4, 2, 8,
        4, 2, 8, 8
    ].map(x => new GameTile(x));
}

it('after reset is with single tile', () => {
    var board = getBoard();

    board.reset();

    expect(board.tiles.filter(x => x.value > 0)).to.have.lengthOf(1);
});

it('three tiles - moves properly', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[4].value = tiles[8].value = tiles[12].value = 2;
    board.tiles = tiles;
    
    board.move(down);

    expect(board.tiles[12].value).to.be.equals(4);
    expect(board.tiles[8].value).to.be.equals(2);
});

it('four tiles - cant move', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[0].value = tiles[4].value = tiles[8].value = tiles[12].value = 8;
    board.tiles = tiles;

    board.move(left);

    expect(board.tiles.filter(x => x.value > 0)).to.have.length(4);
});

it('is not totally blocked before the end', () => {
    var board = getBoard();

    board.move(up);

    expect(board.isTotallyBlocked).to.be.eq(false);
});

it('is totally blocked after the end', () => {
    var board = getBoard();
    board.tiles = getBeforeEndTiles();

    board.move(up);

    expect(board.isTotallyBlocked).to.be.eq(true);
});

it('doesnt join multiple tiles', () => {
    var board = getBoard();
    var tiles = GameBoard.getEmptyArray();
    tiles[0].value = 2;
    tiles[2].value = 2;
    tiles[3].value = 4;
    board.tiles = tiles;

    board.move(left);

    expect(board.tiles.filter(x => x.value === 8)).to.have.length(0);
});

it('doesnt end without blocked tiles', () => {
    var board = getBoard();
    board.tiles = [
        2, 2, 2, 0,
        4, 4, 4, 4,
        2, 2, 2, 2,
        4, 4, 4, 4,
    ].map(x => new GameTile(x));

    board.move(up);

    expect(board.isTotallyBlocked).to.be.eq(false);
});