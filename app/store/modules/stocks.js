import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/retry'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/observable/of'

import {getStocks} from 'lib/yahooClient'
//import stock from './stock'

const SET_STOCKS = 'stocks/SET_STOCK'
const LOADED_STOCKS = 'stocks/LOADED_STOCKS'
const ERROR_STOCKS = 'stocks/ERROR_STOCKS'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STOCKS:
      return [
        ...Object.keys(action.stocks).map(stock => {
          const old = state.find(s => s.symbol === stock)
          return {
            symbol: stock,
            name: action.stocks[stock],
            data: old ? old.data : [],
            loading: !old
          }
        })
      ]
    case LOADED_STOCKS:
      return state.map(stock => {
        const data = action.data.filter(d => d['Symbol'] === stock.symbol)

        if (data.length === 0) return stock
        return {
          ...stock,
          loading: false,
          data
        }
      })
    default: return state
  }
}

export const setStocks = (stocks) => ({
  type: SET_STOCKS,
  stocks
})

const loadedStocks = (data) => ({
  type: LOADED_STOCKS,
  data
})

const errorStocks = (error) => ({
  type: ERROR_STOCKS,
  error
})

export const loadStocksEpic = (action$, store) =>
  action$.ofType(SET_STOCKS)
    .mergeMap(action => {
      const stocks = store.getState().stocks
      const missing = stocks.filter(stock => stock.data.length === 0)
        .map(stock => stock.symbol)
      return getStocks(missing)
        .retry(100)
        .map(loadedStocks)
        .catch(err => Observable.of(errorStocks(err)))

    })

