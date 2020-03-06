const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose')

router.get('/movies', async (ctx, next) => {
  const Movie = mongoose.model('Movie')

  const movies = await Movie.find({}).sort({
    'meta.createdAt': -1
  })

  ctx.body = {
    movies
  }
})

router.get('/movies/:id', async (ctx, next) => {
  let id = ctx.params.id
  const Movie = mongoose.model('Movie')

  const movie = await Movie.find({
    _id: id
  })

  ctx.body = {
    movie
  }
})

module.exports = router