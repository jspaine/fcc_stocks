import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'

import search, * as fromSearch from './search'
import stocks, * as fromStocks from './stocks'
import ui, * as fromUi from './ui'

export const rootReducer = combineReducers({
    search,
    stocks,
    ui
})

export const rootEpic = combineEpics(
  fromSearch.searchEpic,
  fromStocks.loadStocksEpic
)
