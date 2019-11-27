import React, { Component } from 'react';
import TilesBoard from './TilesBoard';
import KeyboardInput from './KeyboardInput';
import GameDashboard from './GameDashboard';
import '../styles/game.scss';
import '../styles/gameDashboard.scss'
import { MicrophoneInput } from './MicrophoneInput';

export class Game extends Component {
    static displayName = Game.name;
    render() {
        return (
            <div className="game">
                <KeyboardInput />
                <GameDashboard />
                <TilesBoard />
                <MicrophoneInput />
            </div>
        );
    }
}
