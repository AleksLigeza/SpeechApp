import { Component } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import { ApiPath } from '../Settings'

export class HubClient extends Component {

    componentDidMount() {
        this.audioContext = this.props.audioContext;
        this.voiceHub = new HubConnectionBuilder()
            .withUrl(ApiPath + 'voice')
            .withHubProtocol(new MessagePackHubProtocol())
            .configureLogging(LogLevel.Information)
            .build();

        this.voiceHub.start()
            .then(() => {
                console.log('Connection started!');
                this.startRecording();
            })
            .catch(err => {
                console.log('Error while establishing connection.' + err);
            });

        this.voiceHub.on("IncomingTranscript", this.props.onMsgHandler);
    }

    componentWillUnmount() {
        this.stopRecording();
    }

    startRecording() {
        this.audioContext.onstatechange = (state) => { console.log(state); }
        this.voiceHub.send("AudioStart");

        this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);
        this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
            if (this.voiceHub.state !== HubConnectionState.Connected) {
                this.voiceHub.start();
            }

            this.processAudio(audioProcessingEvent);
        }

        this.stream = this.audioContext.createMediaStreamSource(this.props.audio);
        this.stream.connect(this.scriptNode);
        this.scriptNode.connect(this.audioContext.destination);
    }

    stopRecording() {
        if (this.stream) {
            this.stream.disconnect();
        }
        if (this.scriptNode) {
            this.scriptNode.disconnect();
        }
    }

    downsampleArray(irate, orate, input) {
        const ratio = irate / orate;
        const olength = Math.round(input.length / ratio);
        const output = new Int16Array(olength);

        var iidx = 0;

        for (var oidx = 0; oidx < output.length; oidx++) {
            const nextiidx = Math.round((oidx + 1) * ratio);

            var sum = 0;
            var cnt = 0;

            for (; iidx < nextiidx && iidx < input.length; iidx++) {
                sum += input[iidx];
                cnt++;
            }

            //saturate output between -1 and 1
            var newfval = Math.max(-1, Math.min(sum / cnt, 1));

            //multiply negative values by 2^15 and positive by 2^15 -1 (range of short)
            var newsval = newfval < 0 ? newfval * 0x8000 : newfval * 0x7FFF;

            output[oidx] = Math.round(newsval);
        }

        return output;
    }

    processAudio(audioProcessingEvent) {
        var inputBuffer = audioProcessingEvent.inputBuffer;

        var isampleRate = inputBuffer.sampleRate;
        var osampleRate = 16000;
        var inputData = inputBuffer.getChannelData(0);
        var output = this.downsampleArray(isampleRate, osampleRate, inputData);

        this.voiceHub.send("ReceiveAudio", new Uint8Array(output.buffer));
    }

    render() {
        return null;
    }
}