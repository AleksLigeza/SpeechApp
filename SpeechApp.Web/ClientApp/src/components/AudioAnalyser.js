import React, { Component } from 'react';
import { AudioVisualiser } from './AudioVisualiser';
import { HubClient } from './HubClient';
import { moveLeft, moveRight, moveUp, moveDown, reset } from '../redux/actions/index'
import { connect } from 'react-redux';
import { left, right, up, down, resetMsg } from '../game/gameConstants';
import Slider from 'rc-slider';
import "rc-slider/assets/index.css";

class AudioAnalyser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioData: new Uint8Array(0),
            volume: 0
        };

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.tick = this.tick.bind(this);
        this.onMsgHandler = this.onMsgHandler.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentDidMount() {
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.sourceIn = this.audioContext.createMediaStreamSource(this.props.audio);
        this.sourceIn.connect(this.analyser);

        this.sourceOut = this.audioContext.createMediaStreamSource(this.props.audio);
        this.gainNode = this.audioContext.createGain();
        this.sourceOut.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.rafId = requestAnimationFrame(this.tick);

        this.handleVolumeChange(0);
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({ audioData: this.dataArray });
        this.rafId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.sourceIn.disconnect();
        this.sourceOut.disconnect();
        this.gainNode.disconnect();
    }

    onMsgHandler(message) {
        console.log(message);
        switch (message) {
            case left: this.props.moveLeft(); break;
            case up: this.props.moveUp(); break;
            case right: this.props.moveRight(); break;
            case down: this.props.moveDown(); break;
            case resetMsg: this.props.reset(); break;
            default: return;
        }
    }

    handleVolumeChange(value) {
        this.setState({ volume: value });
        this.gainNode.gain.value = value / 100;
    }

    render() {
        return (
            <div>
                <div className="volumeSlider">
                    <Slider
                        value={this.state.volume}
                        onChange={this.handleVolumeChange}
                        dotStyle={{ borderColor: 'orange' }} activeDotStyle={{ borderColor: 'yellow' }} />
                </div>
                <AudioVisualiser audioData={this.state.audioData} />
                <HubClient onMsgHandler={this.onMsgHandler} audioContext={this.audioContext} audio={this.props.audio} />
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
    moveUp,
    reset
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioAnalyser);