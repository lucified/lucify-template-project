import { createStore } from 'redux';

import rootReducer, { StateTree } from './reducers';

declare var window: {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
};
declare var module: { hot: any };

function configureStore(initialState: StateTree) {
  /**
   * Use composeEnhancers if you wish to use middleware. See:
   * https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
   */
  const store = createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = (require('./reducers') as any).default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
