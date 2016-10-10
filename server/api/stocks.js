import Router from 'koa-router'
import fetch from 'isomorphic-fetch'

import config from '~/config'

const router = new Router

router.get('/:symbols', async (ctx) => {
  const symbols = JSON.parse(ctx.params.symbols)
  const results = await Promise.all(
    symbols.map(async symbol =>
      await fetch(quandlUrl(symbol)).then(res => res.json())
    )
  )
  const formatted = Array.prototype.concat.apply([],
    results.map(result =>
      result.dataset.data.map(data => ({
        symbol: result.dataset.dataset_code,
        date: data[0],
        close: data[1]
      }))
    )
  )
  ctx.body = formatted
})

export default router

function quandlUrl(symbol) {
  return  `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}.json` +
          `?column_index=4&start_date=${yearsAgo(1)}` +
          `&api_key=${config.quandlKey}`
}

function yearsAgo(num) {
  const now = new Date
  const year = now.getFullYear()
  now.setFullYear(year - num)
  return now.toISOString().slice(0,10)
}
