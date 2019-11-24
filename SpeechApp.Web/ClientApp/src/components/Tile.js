import React, { Component } from 'react';

export class Tile extends Component {
    render() {
        return (
            <div className={"tile tile-"+ this.props.value}>
                {this.props.value !== 0 && <span>{this.props.value}</span>}
            </div>
        );
    }
}