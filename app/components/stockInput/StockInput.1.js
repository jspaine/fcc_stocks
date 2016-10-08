import React, {PropTypes, Component} from 'react'
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
      focused: false,
      valid: false,
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
  handleShowResults(show) {
    return () => setTimeout(() => this.setState({showResults: show}), 200)
  }
  handleKeyPress(ev) {
    ev.preventDefault()
    console.log('ev', ev)

    switch(ev.keyCode) {
      case ARR_DN:
        this.setState({
          selected: this.state.selected + 1
        }, () => console.log('this.state.selected', this.state.selected)
        )
      case ARR_UP:
        this.setState({
          selected: (this.state.selected === null) ? this.state.results.length - 1 : (this.state.selected + this.state.results.length - 1) % this.state.results.length
        })
      case END:
        this.setState({
          selected: this.state.results.length - 1
        })
      case HOME:
        this.setState({
          selected: 0
        })
    }


  }
  render() {
    const {term, updateTerm, fetching, results} = this.props
    const {selected} = this.state
    return (
      <div className={style.autocomplete}>
        <NativeListener
          onKeyPress={this.handleKeyPress}
        >
          <Input
            icon="search"
            label="Search stocks"
            value={term}
            onChange={updateTerm}
            onFocus={this.handleShowResults(true)}
            onBlur={this.handleShowResults(false)}
          />
        </NativeListener>
        <Card
          className={this.state.showResults && (results.length > 0 && !fetching) ?
                     style.results : style.results + ' ' + style.hidden}
        >
          <List selectable ripple theme={unpaddedList}>
            {results.map((result, i) =>
              <ListItem
                className={style.result + ' ' + (i === selected ? style.selected : '')}
                key={result.symbol}
                caption={result.symbol}
                legend={result.name}
                onClick={() => {
                  updateTerm(result.symbol, false)
                  this.handleShowResults(false)
                }}
              />
            )}
          </List>
        </Card>
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

