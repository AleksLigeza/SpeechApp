import { left, right, up, down } from './gameConstants';
import { GameTile } from './GameTile';
import { MovingTile } from './MovingTile';

export class GameBoard {
    constructor({ tiles, isTotallyBlocked }) {
        this.tiles = [...tiles.map(x => new GameTile(x.value))];
        this.isTotallyBlocked = isTotallyBlocked;
    }

    static getEmptyArray() {
        return new Array(16).fill(0).map(x => new GameTile(x));
    }

    static getInitState() {
        return {
            tiles: GameBoard.getEmptyArray(),
            isTotallyBlocked: false
        }
    }

    toResult() {
        return {
            tiles: this.tiles,
            isTotallyBlocked: this.isTotallyBlocked
        };
    }

    reset() {
        var initState = GameBoard.getInitState();
        this.tiles = initState.tiles;
        this.isTotallyBlocked = initState.isTotallyBlocked;

        this.generateNewTile();
    }

    checkEndOfTheGame() {
        var indexes = this.findEmptyTiles();
        if (indexes.length === 0 
            && this.isEveryTileBlocked(up) 
            && this.isEveryTileBlocked(down) 
            && this.isEveryTileBlocked(left) 
            && this.isEveryTileBlocked(right)) {
            this.isTotallyBlocked = true;
            return;
        }
    }

    generateNewTile() {
        var indexes = this.findEmptyTiles();
        var index = indexes[Math.floor(Math.random() * indexes.length)];
        var value = Math.random() > 0.89 ? 4 : 2;
        this.tiles[index] = new GameTile(value);
    }

    moveTiles(direction) {
        var tiles = this.tiles;
        var transform = this.getTransform(direction);

        var index = 0;
        if (direction === down || direction === right) {
            for (index = tiles.length - 1; index >= 0; index--) {
                this.moveSingleTile(index, transform)
            }
        } else {
            for (index = 0; index < tiles.length; index++) {
                this.moveSingleTile(index, transform)
            }
        }
    }

    getTransform(direction) {
        switch (direction) {
            case left: return this.getLeftIndex;
            case up: return this.getUpIndex;
            case right: return this.getRightIndex;
            case down: return this.getDownIndex;
            default: return null;
        }
    }

    moveSingleTile(index, transform) {
        var value = this.tiles[index].value;
        if (value === 0) {
            return;
        }

        var neighbor = transform(index);
        if (neighbor === -1) {
            return;
        }

        var neighborTile = this.tiles[neighbor];
        var neighborValue = neighborTile.value;
        if (neighborValue === value && !neighborTile.isMerged) {
            neighborTile.value += value;
            neighborTile.setMerged();
            this.tilesToMove = [].concat(new MovingTile(value, value * 2, index, neighbor));
        } else if (neighborValue === 0) {
            neighborTile.value = value;
            this.moveSingleTile(neighbor, transform);
        } else {
            return;
        }

        this.tiles[index].value = 0;
    }

    isEveryTileBlocked(direction) {
        var tiles = this.tiles;
        var transform = this.getTransform(direction);
        for (var index = 0; index < tiles.length; index++) {
            var value = tiles[index].value;
            if (value === 0) {
                continue;
            }

            var isBlocked = this.isTileBlocked(index, transform);
            if (!isBlocked) {
                return false;
            }
        }
        return true;
    }

    isTileBlocked(index, transform) {
        var tiles = this.tiles;
        var value = tiles[index].value;

        var neighbor = transform(index);
        if (neighbor === -1) {
            return true;
        }

        var neighborValue = tiles[neighbor].value;
        if (neighborValue === value) {
            return false;
        } else if (neighborValue === 0) {
            return false;
        }

        return true;
    }

    findEmptyTiles() {
        var indexes = [];
        this.tiles.forEach((entry, i) => {
            if (entry.value === 0) {
                indexes.push(i);
            }
        });
        return indexes;
    }

    getLeftIndex(index) {
        var fromLeft = index % 4;
        if (fromLeft === 0) {
            return -1;
        }
        return index - 1;
    }

    getRightIndex(index) {
        var fromLeft = index % 4;
        if (fromLeft === 3) {
            return -1;
        }
        return index + 1;
    }

    getUpIndex(index) {
        if (index < 4) {
            return -1;
        }
        return index - 4;
    }

    getDownIndex(index) {
        if (index > 11) {
            return -1;
        }
        return index + 4;
    }

    move(direction) {
        if (direction && !this.isEveryTileBlocked(direction)) {
            this.moveTiles(direction);
            this.generateNewTile(direction);
            this.checkEndOfTheGame();
        }
    }
}