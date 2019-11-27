import React, { Component } from 'react';
import { TilesList } from './TilesList';
import GameMessage from './GameMessage';
import { connect } from 'react-redux';
import { reset, initialize } from '../redux/actions/index'

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
                <div className="tilesBoard">
                    {this.props.isTotallyBlocked && <GameMessage />}
                    <TilesList tiles={this.state.tiles}/>
                </div>
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