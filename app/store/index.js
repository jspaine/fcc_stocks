import {createStore, applyMiddleware, compose} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {rootReducer, rootEpic} from './modules'

export default () => {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(epicMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules', () => {
      store.replaceReducer(require('./modules/index').rootReducer);
    });

    if (window.devToolsExtension) {
      window.devToolsExtension.updateStore(store);
    }
  }

  return store
}
