import React, { Component } from 'react';
import { Tile } from './Tile';

export class TilesList extends Component {
    render() {
        return (
            this.props.tiles.map((tileValue, i) => (
                <Tile key={i} value={tileValue} />
            ))
        );
    }
}