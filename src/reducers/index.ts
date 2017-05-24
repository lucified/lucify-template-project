import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import { StateTree } from './types';

const defaultState: StateTree = {
  routing: {} as any,
};

export const initialState = defaultState;

export default combineReducers<StateTree>({
  routing: routerReducer,
});

export * from './types';
