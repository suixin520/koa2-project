const Koa = require('koa')
const views = require('koa-views')
const { resolve } = require('path')
const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']
const { connect, initSchemas, initAdmin } = require('./database/init')

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect()
  initSchemas()
  await initAdmin()
  // require('./task/movie')
  // require('./task/api')
  // require('./task/traller')
  // require('./task/qiqiu')
  const app = new Koa()
  await useMiddlewares(app)

  app.listen(7735)
})()