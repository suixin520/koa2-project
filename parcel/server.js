const Koa = require('koa')
const app = new Koa()
const static = require('koa-static')
const { resolve } = require('path')

app.use(static(resolve(__dirname, './')))

app.listen(7736)