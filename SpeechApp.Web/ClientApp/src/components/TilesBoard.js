import React, { Component } from 'react';
import { TilesList } from './TilesList';
import GameMessage from './GameMessage';
import { connect } from 'react-redux';
import { reset, initialize } from '../redux/actions/index'
import KeyboardInput from './KeyboardInput';

class TilesBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {tiles:[]};
    }

    componentDidMount() {
        this.props.initialize();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({tiles : nextProps.tiles})
    }

    render() {
        return (
            <div>
                <KeyboardInput />
                <button onClick={this.props.reset}>Restart</button>
                <div className="board">
                    {this.props.isTotallyBlocked && <GameMessage />}
                    <TilesList tiles={this.state.tiles}/>
                </div>
                {React.version}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        tiles: state.gameBoardReducers.tiles,
        isTotallyBlocked: state.gameBoardReducers.isTotallyBlocked
    };
  }

const mapDispatchToProps = {
    reset,
    initialize
};

export default connect(mapStateToProps, mapDispatchToProps)(TilesBoard);