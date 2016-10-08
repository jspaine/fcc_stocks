import React from 'react'
import {Provider} from 'react-redux'
import io from 'socket.io-client'

import createStore from 'store'
import socketClient from 'lib/socketClient'
import {setStocks} from 'store/modules/stocks'
import {Home} from 'containers'

const store = createStore()
const socket = io()
socketClient(socket)

socket.on('stocks', stocks => store.dispatch(setStocks(stocks)))

const App = () =>
  <Provider store={store}>
    <Home />
  </Provider>

export default App
