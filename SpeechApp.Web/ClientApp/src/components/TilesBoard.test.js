import React from 'react';
import { mount } from 'enzyme';
import TilesBoard from './TilesBoard';
import { storeFactory } from '../redux/storeFactory';
import { Provider } from 'react-redux';
import GameMessage from './GameMessage';
import { expect } from 'chai'

function getBoard() {
    return mount(
            <Provider store={storeFactory}>
                <TilesBoard />
            </Provider>
        )
        .find(TilesBoard)
        .children()
        .first();
}

it('renders without crashing', () => {
    getBoard();
});

it('is with message after the end', () => {
    
    var board = getBoard();
    board.instance().setState({ isTotallyBlocked: true });
    board.update();
    expect(board.find(GameMessage).exists()).to.be.eq(true);
});


it('is without message before the end', () => {
    var board = getBoard();
    expect(board.find(GameMessage).exists()).to.be.eq(false);
});