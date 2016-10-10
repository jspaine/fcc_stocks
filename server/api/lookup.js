import Router from 'koa-router'
import fetch from 'isomorphic-fetch'

const router = new Router

router.get('/:term', async (ctx) => {
  console.log('lookup/')
  const url = `http://d.yimg.com/aq/autoc?query=${ctx.params.term}&region=US&lang=en-US&format=json`
  const results = await fetch(url).then(res => res.json())
  if (results['ResultSet'] && results['ResultSet']['Result']) {
    ctx.body = results['ResultSet']['Result']
  } else {
    ctx.body = {
      error: 'no results'
    }
  }
})

export default router
