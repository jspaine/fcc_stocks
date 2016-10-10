import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'

import api from 'lib/apiClient'

const UPDATE_SEARCH = 'search/UPDATE_SEARCH'
const SET_SEARCH = 'search/SET_SEARCH'
const AUTOCOMPLETE_RECEIVE = 'search/AUTOCOMPLETE_RECEIVE'
const AUTOCOMPLETE_FAILURE = 'search/AUTOCOMPLETE_FAILURE'

const initialState = {
  term: '',
  results: [],
  fetching: false,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH:
      return {
        term: action.term,
        results: [],
        fetching: action.shouldSearch,
        error: null
      }
    case AUTOCOMPLETE_RECEIVE:
      return {
        ...state,
        results: action.results,
        fetching: false,
        error: null
      }
    case AUTOCOMPLETE_FAILURE:
      return {
        ...state,
        results: [],
        fetching: false,
        error: action.error
      }
    default: return state
  }
}

export const updateSearch = (term, shouldSearch = true) => ({
  type: UPDATE_SEARCH,
  term,
  shouldSearch
})

export const autocompleteReceive = (results) => ({
  type: AUTOCOMPLETE_RECEIVE,
  results
})

export const autocompleteFailure = (error) => ({
  type: AUTOCOMPLETE_FAILURE,
  error
})

export const searchEpic = action$ =>
  action$.ofType(UPDATE_SEARCH)
    .filter(action => action.shouldSearch)
    .debounceTime(300)
    .switchMap(action =>
      api.get(`api/lookup/${action.term}`)
        .map(autocompleteReceive)
        .catch(err => Observable.of(autocompleteFailure))
    )
