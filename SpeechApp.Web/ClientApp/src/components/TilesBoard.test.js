import React from 'react';
import { mount, shallow } from 'enzyme';
import TilesBoard from './TilesBoard';
import { Provider } from 'react-redux';
import GameMessage from './GameMessage';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';

function getInitialState(isBlocked) {
    return {
        gameBoardReducers: {
            tiles: [],
            isTotallyBlocked: isBlocked
        }
    };
}

function getBoard(initialState) {
    const mockStore = configureStore();
    var store = mockStore(initialState)

    return mount(
            <Provider store={store}>
                <TilesBoard />
            </Provider>
        )
        .find(TilesBoard)
        .children()
        .first();
}

it('renders without crashing', () => {
    getBoard(getInitialState(false));
});

it('is with message after the end', () => {
    var board = getBoard(getInitialState(true));

    expect(board.find(GameMessage).exists()).to.be.eq(true);
});

it('is without message before the end', () => {
    var board = getBoard(getInitialState(false));

    expect(board.find(GameMessage).exists()).to.be.eq(false);
});