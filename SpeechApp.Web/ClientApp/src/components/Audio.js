import React, { Component } from 'react';
import AudioAnalyser from './AudioAnalyser';
import TilesBoard from './TilesBoard';

export class Audio extends Component {
    static displayName = Audio.name;

    constructor(props) {
        super(props);
        this.state = {
            currentCount: 0,
            audio: null
        };
        this.toggleMicrophone = this.toggleMicrophone.bind(this);
    }

    async getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        this.setState({ audio });
    }

    stopMicrophone() {
        this.state.audio.getTracks().forEach(track => track.stop());
        this.setState({ audio: null });
    }

    toggleMicrophone() {
        if (this.state.audio) {
            this.stopMicrophone();
        } else {
            this.getMicrophone();
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.toggleMicrophone}>
                    {this.state.audio ? 'Stop microphone' : 'Get microphone input'}
                </button>

                {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}

                <TilesBoard />

            </div>
        );
    }
}
