import { createStore } from 'redux';
import reducers from './reducers';

export const storeFactory = createStore(reducers);