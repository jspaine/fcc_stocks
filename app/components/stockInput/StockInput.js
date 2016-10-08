import React, {PropTypes, Component} from 'react'
import ReactDOM from 'react-dom'
import NativeListener from 'react-native-listener'
import {Card, CardText} from 'react-toolbox/lib/card'
import {Input} from 'react-toolbox/lib/input'
import {List, ListItem} from 'react-toolbox/lib/list'

import style from './StockInput.scss'
import unpaddedList from 'theme/unpaddedList.scss'

const ENTER = 13
const ARR_DN = 40
const ARR_UP = 38
const PG_DN = 34
const PG_UP = 33
const HOME = 36
const END = 35
const ESC = 27

class StockInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showResults: false,
      selected: null,
      results: []
    }
    this.handleShowResults = this.handleShowResults.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.fetching && !nextProps.fetching) {
      this.setState({results: nextProps.results})
    }
  }
  componentDidUpdate(prevState) {
    if (this.refs.selected &&
        this.state.selected !== prevState.selected) {
      const selected = ReactDOM.findDOMNode(this.refs.selected)
      selected.scrollIntoViewIfNeeded()
    }
  }
  handleShowResults(show) {
    return () =>
      setTimeout(
        () => this.setState({
          showResults: show,
          selected: show ? 0 : null
        }),
        show ? 0 : 200
      )
  }
  handleKeyPress(ev) {
    if (this.props.fetching) return

    const {selected, results} = this.state
    const len = results.length
    switch(ev.keyCode) {
      case ARR_DN:
        this.setState({
          selected: selected === null ? 0 : (selected + 1) % len
        })
        ev.preventDefault()
        ev.stopPropagation()
        return
      case ARR_UP:
        this.setState({
          selected: selected === null ? len - 1 : (selected + len - 1) % len
        })
        ev.preventDefault()
        ev.stopPropagation()
        return
      case END:
        this.setState({
          selected: len - 1
        })
        ev.preventDefault()
        return
      case HOME:
        this.setState({
          selected: 0
        })
        ev.preventDefault()
        return
      case ESC:
        this.setState({
          showResults: false,
          selected: null,
          results: []
        })
        return
      case ENTER:
        this.props.onSelect({
          symbol: results[selected].symbol,
          name: results[selected].name
        })
        this.props.updateTerm('', false)
        this.handleShowResults(false)
    }
  }
  render() {
    const {term, updateTerm, fetching, onSelect} = this.props
    const {selected, results} = this.state
    return (
      <div className={style.autocomplete}>
        <NativeListener
          onKeyUp={this.handleKeyPress}
        >
          <div>
          <Input
            icon="search"
            label="Search stocks"
            value={term}
            onChange={updateTerm}
            onFocus={this.handleShowResults(true)}
            onBlur={this.handleShowResults(false)}
          />

          <Card
            className={this.state.showResults && (results.length > 0 && !fetching) ?
                      style.results : style.results + ' ' + style.hidden}
          >
            <List selectable ripple theme={unpaddedList}>
              {results.map((result, i) =>
                <ListItem
                  className={style.result + ' ' + (i === selected ? style.selected : '')}
                  key={result.symbol}
                  ref={i === selected ? 'selected' : null}
                  caption={result.symbol}
                  legend={result.name}
                  onClick={() => {
                    onSelect({
                      symbol: result.symbol,
                      name: result.name
                    })
                    updateTerm('', false)
                    this.handleShowResults(false)
                  }}
                />
              )}
            </List>
          </Card>
          </div>
        </NativeListener>
      </div>
    )
  }
}

export default StockInput


function addOne(curr, len) {
  if (curr === null) return 0
  return (curr + 1) % len
}

function subOne(curr, len) {
  if (curr === null) return len - 1
  return (curr + len - 1) % len
}

