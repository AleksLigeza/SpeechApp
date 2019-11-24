import { left, right, up, down } from './gameConstants';

export class GameBoard {
    constructor({ tiles, isTotallyBlocked }) {
        this.tiles = [...tiles];
        this.isTotallyBlocked = isTotallyBlocked;
    }

    static getEmptyArray() {
        return new Array(16).fill(0);
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

    restart() {
        var initState = GameBoard.getInitState();
        this.tiles = initState.tiles;
        this.isTotallyBlocked = initState.isTotallyBlocked;

        this.generateNewTile();
    }

    checkEndOfTheGame(direction) {
        var indexes = this.findEmptyTiles();
        if (indexes.length === 0 && this.isEveryTileBlocked(direction)) {
            this.isTotallyBlocked = true;
            return;
        }
    }

    generateNewTile() {
        var indexes = this.findEmptyTiles();
        var index = indexes[Math.floor(Math.random() * indexes.length)];
        var tiles = this.tiles;
        tiles[index] = Math.random() > 0.89 ? 4 : 2;
        this.tiles = tiles;
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
        var value = this.tiles[index];
        if (value === 0) {
            return;
        }

        var neighbor = transform(index);
        if (neighbor === -1) {
            return;
        }

        var neighborValue = this.tiles[neighbor];
        if (neighborValue === value) {
            this.tiles[neighbor] += value;

        } else if (neighborValue === 0) {
            this.tiles[neighbor] = value;
            this.moveSingleTile(neighbor, transform);
        } else {
            return;
        }

        this.tiles[index] = 0;
    }

    isEveryTileBlocked(direction) {
        var tiles = this.tiles;
        var transform = this.getTransform(direction);
        for (var index = 0; index < tiles.length; index++) {
            var value = tiles[index];
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
        var value = tiles[index];

        var neighbor = transform(index);
        if (neighbor === -1) {
            return true;
        }

        var neighborValue = tiles[neighbor];
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
            if (entry === 0) {
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
            this.checkEndOfTheGame(direction);
        }
    }
}