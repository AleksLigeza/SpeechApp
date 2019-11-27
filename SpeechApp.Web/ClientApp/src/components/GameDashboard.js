import React, { Component } from 'react';
import { reset } from '../redux/actions/index';
import { connect } from 'react-redux';

class GameDashboard extends Component {
    render() {
        return (
            <div className="gameDashboard">
                <h1 className="title">Speech 2048</h1>
                <button onClick={this.props.reset}
                    className="resetButton">
                    Reset
                </button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {
    reset
};

export default connect(mapStateToProps, mapDispatchToProps)(GameDashboard);