import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {Layout, Panel} from 'react-toolbox/lib/layout'

import {Nav, StockList, StockInput, Chart} from 'components'
import {addStock, removeStock} from 'lib/socketClient'
import {updateSearch} from 'store/modules/search'
import style from './Home.scss'

const stateToProps = (state) => ({
  stocks: state.stocks,
  term: state.search.term,
  results: state.search.results,
  fetching: state.search.fetching
})

const dispatchToProps = (dispatch) => ({
  updateSearch: (term) => dispatch(updateSearch(term))
})

class App extends Component {
  render() {
    return (
      <Layout className={style.layout}>
        <Panel className={style.panel}>
          <Nav />
          <StockInput
            term={this.props.term}
            updateTerm={this.props.updateSearch}
            results={this.props.results}
            fetching={this.props.fetching}
            onSelect={addStock}
          />
          <Chart stocks={this.props.stocks} />
          <StockList stocks={this.props.stocks} remove={removeStock} />
        </Panel>
      </Layout>
    )
  }

  static propTypes = {
  }
}

export default connect(stateToProps, dispatchToProps)(App)
