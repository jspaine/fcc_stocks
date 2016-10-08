import 'react-toolbox/lib/commons.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './containers/app/App'
import {autocomplete} from 'lib/yahooClient'

const root = document.getElementById('app')

if (__DEVELOPMENT__) {
  const RedBox = require('redbox-react').default
  try {
    render(<App />, root)
  } catch (err) {
    render(<RedBox error={err} />, root)
  }
} else {
  render(<App />)
}

if (__DEVELOPMENT__ && module.hot) {
  module.hot.accept('./containers/app/App', () => {
    const NextApp = require('./containers/app/App').default
    render(<NextApp />)
  })
}

function render(component) {
  ReactDOM.render(
    <AppContainer>
      {component}
    </AppContainer>,
    root
  )
}
