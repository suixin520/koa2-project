const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const { resolve } = require('path')
const mongoose =require('mongoose')

const { connect, initSchemas, initAdmin } = require('./database/init')

;(async () => {
  await connect()
  initSchemas()
  await initAdmin()
  // require('./task/movie')
  // require('./task/api')
  // require('./task/traller')
  // require('./task/qiqiu')
})()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: '你好',
    me: '随心'
  })
  await next()
})

app.listen(7735)