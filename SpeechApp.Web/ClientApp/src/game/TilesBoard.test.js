import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai'
import { TilesBoard } from './TilesBoard';
import { upArrow, downArrow, leftArrow, rightArrow } from '../Settings.js';
import { GameMessage } from './GameMessage';

function simulateKeyDown(keyCode) {
    var event = new KeyboardEvent('keydown', { keyCode: keyCode });
    document.dispatchEvent(event);
}

function getEmptyTiles() {
    return [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
}

function getBeforeEndTiles() {
    return [
        2, 4, 2, 4,
        4, 2, 4, 2,
        2, 4, 2, 8,
        4, 2, 8, 8
    ];
}

function getComponent() {
    return shallow(<TilesBoard />);
}

function getTiles() {
    return getComponent().state('tiles');
}

it('renders without crashing', () => {
    shallow(<TilesBoard />);
});

it('renders with single tile', () => {
    var tiles = getTiles().filter(x => x > 0);
    expect(tiles).to.have.lengthOf(1);
});

it('three tiles - moves properly', () => {
    var wrapper = getComponent();
    var tiles = getEmptyTiles();
    tiles[4] = tiles[8] = tiles[12] = 2;
    wrapper.setState({ tiles });
    simulateKeyDown(downArrow);

    expect(wrapper.state('tiles')[12]).to.be.equals(4);
    expect(wrapper.state('tiles')[8]).to.be.equals(2);
});

it('four tiles - cant move', () => {
    var wrapper = getComponent();
    var tiles = getEmptyTiles();
    tiles[0] = tiles[4] = tiles[8] = tiles[12] = 8;
    wrapper.setState({ tiles });
    simulateKeyDown(leftArrow);
    expect(wrapper.state('tiles').filter(x => x > 0)).to.have.length(4);
});

it('is not totally blocked before the end', () => {
    var wrapper = getComponent();
    simulateKeyDown(upArrow);
    expect(wrapper.state('isTotallyBlocked')).to.be.eq(false);
});

it('is totally blocked after the end', () => {
    var wrapper = getComponent();
    wrapper.setState({ tiles: getBeforeEndTiles() });
    simulateKeyDown(upArrow);
    expect(wrapper.state('isTotallyBlocked')).to.be.eq(true);
});

it('is with message after the end', () => {
    var wrapper = getComponent();
    wrapper.setState({ isTotallyBlocked: true });
    expect(wrapper.find(GameMessage).exists()).to.be.eq(true);
});


it('is without message before the end', () => {
    var wrapper = getComponent();
    expect(wrapper.find(GameMessage).exists()).to.be.eq(false);
});

it('doesnt join multiple tiles', () => {
    var wrapper = getComponent();
    var tiles = getEmptyTiles();
    tiles[0] = 2;
    tiles[2] = 2;
    tiles[3] = 4;
    wrapper.setState({ tiles });

    simulateKeyDown(leftArrow);
    console.log(wrapper.state('tiles'))
    expect(wrapper.state('tiles').filter(x => x === 8)).to.have.length(0);
});