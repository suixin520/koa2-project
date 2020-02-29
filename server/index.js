const Koa = require('koa')
const app = new Koa()
const ejs = require('ejs')
const pug = require('pug')

const { htmlTpl, ejsTpl, pugTpl} = require('./tpl')

app.use(async (ctx, next) => {
  ctx.body = pug.render(pugTpl, {
    you: '你好',
    me: '随心'
  })
  await next()
})

app.listen(7735)