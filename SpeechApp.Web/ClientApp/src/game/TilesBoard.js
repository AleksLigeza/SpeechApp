import React, { Component } from 'react';
import { TilesList } from './TilesList';
import { Tile } from './Tile';
import { upArrow, downArrow, leftArrow, rightArrow } from '../Settings.js';
import { GameMessage } from './GameMessage';
import { connect } from 'react-redux';
import { moveLeft, moveRight, moveUp, moveDown, reset, initialize } from '../redux/actions/index'

class TilesBoard extends Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.state = {tiles:[]};
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentDidMount() {
        this.props.initialize();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({tiles : nextProps.tiles})
       }

    handleKeyDown(e) {
        switch (e.keyCode) {
            case leftArrow: this.props.moveLeft(); break;
            case upArrow: this.props.moveUp(); break;
            case rightArrow: this.props.moveRight(); break;
            case downArrow: this.props.moveDown(); break;
            default: return;
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.props.reset}>Restart</button>
                <div className="board">
                    {this.props.isTotallyBlocked && <GameMessage />}
                    {/* <TilesList tiles={this.state.tiles}/> */}
                    {this.props.tiles && this.props.tiles.map((tileValue, i) => (
                        <Tile key={i} value={tileValue} />
                    ))}
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
    moveLeft,
    moveRight,
    moveDown,
    moveUp,
    reset,
    initialize
};

export default connect(mapStateToProps, mapDispatchToProps)(TilesBoard);