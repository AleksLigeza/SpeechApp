import React from 'react';
import { mount } from 'enzyme';
import TilesBoard from './TilesBoard';
import { storeFactory } from '../redux/storeFactory';
import { Provider } from 'react-redux';

it('renders without crashing', () => {
    mount(<Provider store={storeFactory}><TilesBoard /></Provider>);
});

it('is with message after the end', () => {
    var board = getBoard();
    board.setState({ isTotallyBlocked: true });
    expect(board.find(GameMessage).exists()).to.be.eq(true);
});


it('is without message before the end', () => {
    var board = getBoard();
    expect(board.find(GameMessage).exists()).to.be.eq(false);
});