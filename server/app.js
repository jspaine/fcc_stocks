import Koa from 'koa'
import serve from 'koa-static'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import convert from 'koa-convert'
import IO from 'koa-socket'
import http from 'http'

import webpackDevProxy from './lib/webpackDevProxy'
import webpackConfig from '../webpack.config'
import config from './config'

const env = process.env.NODE_ENV || 'development'

const app = new Koa()
const io = new IO()
app.use(conditional())
app.use(etag())
app.use(compress())

if (env === 'production') {
  app.use(serve('public'))
} else {
  app.use(convert(webpackDevProxy(webpackConfig.devServer.port)))
}

io.attach(app)

if (env === 'production') {
  app.listen(config.port, () => {
    console.log(`server listening on ${config.protocol}://${config.host}:${config.port}`)
  })
} else {
  app.listen(config.port, config.host, () => {
    console.log(`server listening on ${config.protocol}://${config.host}:${config.port}`)
  })
}

let stocks = {
  'GOOG': 'google inc'
}

app._io.on('connection', socket => {
  socket.emit('stocks', stocks)
  socket.on('add-stock', stock => {
    console.log('add-stock', stock)
    stocks = {
      ...stocks,
      [stock.symbol]: stock.name
    }
    console.log('stocks', stocks)

    io.broadcast('stocks', stocks)
  })
  socket.on('remove-stock', stock => {
    console.log('remove-stock', stock)
    if (stocks.hasOwnProperty(stock)) {
      delete stocks[stock]
    }
    io.broadcast('stocks', stocks)
  })
})

export default app
