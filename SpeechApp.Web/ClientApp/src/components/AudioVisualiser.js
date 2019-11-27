import React, { Component } from 'react';

export class AudioVisualiser extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.oldAudioData = null;
    }

    draw() {
        const { audioData } = this.props;

        if (this.oldAudioData) {
            for (let i = 0; i < audioData.length; i++) {
                audioData[i] = (audioData[i] + this.oldAudioData[i] * 2) / 3;
            }
        }
        this.oldAudioData = audioData;

        const canvas = this.canvas.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;
        context.lineWidth = 2;
        var grad= context.createLinearGradient(0, 0, width, 0);
        var lightColor = '#faf8ef';
        var darkColor = '#776e65';
        grad.addColorStop(0, lightColor);
        grad.addColorStop(1/10, darkColor);
        grad.addColorStop(9/10, darkColor);
        grad.addColorStop(1, lightColor);
        context.strokeStyle = grad;
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.moveTo(0, height / 2);
        for (const item of audioData) {
            const place = x / width;
            const factor = -2 * place * place + 2 * place;
            let y = ((item - 128) * factor + 128) / 255.0 * height;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <canvas className="audioVisualizer" ref={this.canvas} />;
    }
}