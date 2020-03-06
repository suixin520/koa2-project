const request = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetch(item) {
  const url = `https://douban.uieee.com/v2/movie/${item.doubanId}`
  let res = await request(url, [])
  if (typeof(res) === 'string') {
    res = JSON.parse(res)
  }
  return res
}

;(async () => {
  let movies = await Movie.find({ // 查询数据库中存在的数据，且该数据满足以下任意一条数据即可
    $or: [
      { summary: { $exists: false } }, // summary字段不存在
      { summary: null }, // summary字段值为null
      { year: { $exists: false } }, // year字段不存在
      { title: '' }, // title字段值为空字符串
      { summary: '' } // summary字段值为空字符串
    ]
  })

  for (let i = 0; i < movies.length; i++) {
  // for (let i = 0; i < [movies[0]].length; i++) {
    let movie = movies[i]
    let movieData = await fetch(movie)

    if (movieData) {
      let tags = movieData.tags || []
      movie.tags = movie.tags || []
      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.year = Number(movieData.attrs.year[0]) || 2500
        movie.movieTypes = movieData.attrs.movie_type || []
        console.log('获取到的movietype', movieData.attrs.movie_type)
        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates
      }
      // console.log('将要存入到数据库的movie>>>>>>>', movie)
      await movie.save()
    }
  }

  // let movies = [
  //   {
  //     doubanId: 27010768,
  //     title: '寄生虫',
  //     rate: 8.7,
  //     poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2561439800.jpg'
  //   },
  //   {
  //     doubanId: 26794435,
  //     title: '哪吒之魔童降世',
  //     rate: 8.5,
  //     poster: 'https://img9.doubanio.com/view/photo/l_ratio_poster/public/p2563780504.jpg'
  //   }
  // ]

  // movies.map(async (movie) => {
  //   let movieData = await fetch(movie)

  //   try {
  //     movieData = JSON.parse(movieData)
  //     console.log(movieData.tags)
  //     console.log(movieData.summary)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
})()