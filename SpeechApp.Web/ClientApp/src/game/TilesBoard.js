import React, { Component } from 'react';
import { Tile } from './Tile'

export class TilesBoard extends Component {
    constructor() {
        super();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.restart = this.restart.bind(this);

        this.state = {
            isTotallyBlocked: false,
            tiles: []
        }
    }

    restart() {
        this.setState({ tiles: [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ] }, 
            () => this.generateNewTile('down'));
    }

    generateNewTile(direction) {
        var indexes = this.findEmptyTiles();

        if (indexes.length == 0 && this.isEveryTileBlocked(direction)) {
            this.setState({ isTotallyBlocked: true });
            return;
        }

        var index = indexes[Math.floor(Math.random() * indexes.length)];
        var tiles = this.state.tiles;
        tiles[index] = Math.random() > 0.89 ? 4 : 2;
        this.setState({ tiles });
    }

    isEveryTileBlocked(direction) {
        var tiles = this.state.tiles;
        var transform = this.getTransform(direction);
        for (var index = 0; index < tiles.length; index++) {
            var isBlocked = this.isTileBlocked(index, transform);
            if (!isBlocked) {
                return false;
            }
        }
        return false;
    }

    moveTiles(direction) {
        var tiles = this.state.tiles;
        var transform = this.getTransform(direction);

        if (direction == 'down' || direction == 'right') {
            for (var index = tiles.length - 1; index >= 0; index--) {
                this.moveSingleTile(tiles, index, transform)
            }
        } else {
            for (var index = 0; index < tiles.length; index++) {
                this.moveSingleTile(tiles, index, transform)
            }
        }
    }

    getTransform(direction) {
        switch (direction) {
            case 'left': return this.getLeftIndex;
            case 'up': return this.getUpIndex;
            case 'right': return this.getRightIndex;
            case 'down': return this.getDownIndex;
            default: return null;
        }
    }

    moveSingleTile(tiles, index, transform) {
        var value = tiles[index];
        if (value === 0) {
            return;
        }

        var neighbor = transform(index);
        if (neighbor === -1) {
            return;
        }

        var neighborValue = tiles[neighbor];
        if (neighborValue === value) {
            tiles[neighbor] += value;

        } else if (neighborValue === 0) {
            tiles[neighbor] = value;
            this.moveSingleTile(tiles, neighbor, transform);
        } else {
            return;
        }

        tiles[index] = 0;
    }

    isTileBlocked(index, transform) {
        var tiles = this.state.tiles;
        var value = tiles[index];
        if (value === 0) {
            return false;
        }

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
        this.state.tiles.some(function (entry, i) {
            if (entry === 0) {
                indexes.push(i);
            }
        });
        return indexes;
    }

    getLeftIndex(index) {
        var fromLeft = index % 4;
        if (fromLeft == 0) {
            return -1;
        }
        return index - 1;
    }

    getRightIndex(index) {
        var fromLeft = index % 4;
        if (fromLeft == 3) {
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

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentDidMount() {
        this.restart();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        let direction = '';
        switch (e.keyCode) {
            case 37: direction = 'left'; break;
            case 38: direction = 'up'; break;
            case 39: direction = 'right'; break;
            case 40: direction = 'down'; break;
            default: return;
        }

        if (direction) {
            this.moveTiles(direction);
            this.generateNewTile(direction);
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.restart}>Restart</button>
                <div className="board">
                    {this.state.tiles.map((tileValue, i) => (
                        <Tile key={i} value={tileValue} />
                    ))}
                </div>
            </div>
        );
    }
}