import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import rootReducer, { StateTree } from './reducers';

declare var window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };
declare var module: { hot: any };

function configureStore(initialState: StateTree, history: History) {
  const routerMiddlewareObject = routerMiddleware(history);
  const composeEnhancers =
    (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddlewareObject,
      ),
    ),
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
