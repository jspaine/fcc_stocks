import fetchJsonp from 'fetch-jsonp'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/fromPromise'

const yqlRoot = 'https://query.yahooapis.com/v1/public/yql?'
const select = 'select * from yahoo.finance.historicaldata'

const autocompleteUrl = (term) =>
  `http://d.yimg.com/aq/autoc?query=${term}&region=US&lang=en-US&format=jsonp`

const stocksUrl = (symbols, start, end) => {
  const where = `where symbol in ${wrapSymbols(symbols)}`
  const and = `and startDate = ${start} and endDate = ${end}`

  const query = 'q=' + encodeURIComponent(`${select} ${where} ${and}`)
  const params = [
    'format=json',
    'diagnostics=true',
    'env=' + encodeURIComponent('store://datatables.org/alltableswithkeys')
  ].join('&')
  return `${yqlRoot}${query}&${params}`
}

export function autocomplete(term) {
  return Observable.fromPromise(
    fetchJsonp(autocompleteUrl(term))
      .then(res => res.json())
      .then(res => res['ResultSet']['Result'])
      .catch(err => {
        throw {
          status: err.status,
          text: err.statusText
        }
      })
  )
}

export function getStocks(symbols) {
  let start = new Date()
  let end = new Date()
  start.setYear(start.getYear() - 1)
  start = convertDate(start)
  end = convertDate(end)

  return Observable.fromPromise(
    fetchJsonp(stocksUrl(symbols, start, end))
      .then(res => res.json())
      .then(res => res.query.results.quote)
      .catch(err => {
        throw {
          status: err.status,
          text: err.statusText
        }
      })
  )
}

function wrapSymbols(symbols) {
  return `(${symbols.map(s => '"' + s + '"').join(', ')})`
}

function convertDate(date) {
  return `"${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}"`
}
