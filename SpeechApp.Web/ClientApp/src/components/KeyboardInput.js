import { Component } from 'react';
import { upArrow, downArrow, leftArrow, rightArrow } from '../Settings.js';
import { moveLeft, moveRight, moveUp, moveDown } from '../redux/actions/index'
import { connect } from 'react-redux';

class KeyboardInput extends Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
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
        return null;
    }
}

function mapStateToProps(state) {
    return {};
  }

const mapDispatchToProps = {
    moveLeft,
    moveRight,
    moveDown,
    moveUp
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardInput);