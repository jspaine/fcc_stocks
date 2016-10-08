import React, {PropTypes, Component} from 'react'
import {Card, CardText} from 'react-toolbox/lib/card'
import fauxDOM from 'react-faux-dom'
import {
  axisBottom,
  axisLeft,
  extent,
  line as d3Line,
  max,
  scaleLinear,
  scaleTime,
  select,
  timeFormat
} from 'd3'

import style from './Chart.scss'

const colors = [
  '#1776B6',
  '#FF7F00',
  '#D8241F',
  '#9564BF',
  '#8D5649',
  '#E574C3',
  '#7F7F7F',
  '#BCBF00',
  '#00BED1'
]

class PollChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: Math.min(window.innerWidth - 100, 960),
      height: Math.min(window.innerWidth - 100, 430) / 2
    }
    this.handleResize = this.handleResize.bind(this)
  }
  handleResize(e) {
    const size = Math.min(window.innerWidth - 100, 430)
    this.setState({
      width: size,
      height: size / 2
    })
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    return (
      <Card
        style={{
          width: this.state.width + 10 + 'px',
          height: this.state.height + 10 + 'px'
        }}
      >
        {this.graph().toReact()}
      </Card>
    )
  }

  graph() {
    const {stocks} = this.props
    const el = new fauxDOM.Element('svg')
    if (stocks.length === 0) return el

    const formatted = stocks.map(stock => ({
      ...stock,
      data: stock.data.map(d => ({
        date: new Date(d['Date']),
        close: +d['Close']
      }))
    }))

    const merged = Array.prototype.concat.apply(
      [],
      formatted.map(stock => stock.data)
    )

    const margin = {top: 10, right: 0, bottom: 20, left: 50}
    const width = this.state.width - margin.left - margin.right
    const height = this.state.height - margin.top - margin.bottom

    const x = scaleTime().range([0, width])
      .domain(extent(merged, d => d.date))

    const y = scaleLinear().range([height, 0])
      .domain(extent(merged, d => d.close))
    const xAxis = axisBottom().scale(x)
    const yAxis = axisLeft().scale(y)

    const line = d3Line()
      .x(d => x(d.date))
      .y(d => y(d.close))

    const svg = select(el)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g').call(xAxis)
      .attr('transform', `translate(0,${height})`)
    g.append('g').call(yAxis)

    const stock = g.selectAll('.stock')
      .data(formatted)
      .enter().append('g')

    stock.append('path')
      .attr('class', style.line)
      .attr('d', d => line(d.data))
      .style('stroke', (d, i) => colors[i % colors.length])

    return el
  }
}

export default PollChart
