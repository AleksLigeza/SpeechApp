import React, { Component } from 'react';
import { AudioVisualiser } from './AudioVisualiser';
import { HubClient } from './HubClient';
import { moveLeft, moveRight, moveUp, moveDown, reset } from '../redux/actions/index'
import { connect } from 'react-redux';
import { left, right, up, down } from '../game/gameConstants';

class AudioAnalyser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioData: new Uint8Array(0),
            isAudioDetected: false,
            messages: [],
        };

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.tick = this.tick.bind(this);
        this.onMsgHandler = this.onMsgHandler.bind(this);
    }

    componentDidMount() {
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.sourceIn = this.audioContext.createMediaStreamSource(this.props.audio);
        this.sourceIn.connect(this.analyser);
        this.sourceOut = this.audioContext.createMediaStreamSource(this.props.audio);
        this.sourceOut.connect(this.audioContext.destination);
        this.rafId = requestAnimationFrame(this.tick);
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);

        let isDetected = false;
        if (this.dataArray.some(x => x !== 128)) {
            isDetected = true;
        }

        this.setState({ isAudioDetected: isDetected });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.sourceIn.disconnect();
        this.sourceOut.disconnect();
    }

    onMsgHandler(message) {
        const messages = this.state.messages.concat([message]);
        this.setState({ messages });
        console.log(message);
        switch (message) {
            case left: this.props.moveLeft(); break;
            case up: this.props.moveUp(); break;
            case right: this.props.moveRight(); break;
            case down: this.props.moveDown(); break;
            case reset: this.props.reset(); break;
            default: return;
        }
    }

    render() {
        return (
            <div>
                {this.state.isAudioDetected.toString()}
                <br />
                <AudioVisualiser audioData={this.state.audioData} />
                <HubClient onMsgHandler={this.onMsgHandler} audioContext={this.audioContext} audio={this.props.audio} />
                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: 'block' }} key={index}> {message} </span>
                    ))}
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(AudioAnalyser);