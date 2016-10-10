import Router from 'koa-router'

import lookup from './lookup'
import stocks from './stocks'

const router = new Router({
  prefix: '/api'
})

router.use('/lookup', lookup.routes())
router.use('/stocks', stocks.routes())

export default router
