import React, { Component } from 'react';

export class GameMessage extends Component {
    render() {
        return (
            <div className='gameMessage'>
                <h3>Game over</h3>
                <button className='resetButton'
                    onClick={this.props.resetHandler}>
                    Reset
                </button>
            </div>
        )
    }
}