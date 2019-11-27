import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from '../redux/actions/index'

class GameMessage extends Component {
    render() {
        return (
            <div className='gameMessage'>
                <h2>Game over</h2>
                <button className='resetButton'
                    onClick={this.props.reset}>
                    Reset
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {
    reset,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameMessage);

