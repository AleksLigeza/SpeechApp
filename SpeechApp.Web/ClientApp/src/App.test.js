import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { storeFactory } from './redux/storeFactory';
import { Provider } from 'react-redux';

it('renders without crashing', async () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Provider store={storeFactory}>
        <App />
      </Provider>
    </MemoryRouter>, div);
  await new Promise(resolve => setTimeout(resolve, 1000));
});
