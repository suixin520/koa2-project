const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = '初始化项目'
  await next()
})

app.listen(7735)