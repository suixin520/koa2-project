const request = require('request-promise-native')

async function fetch(item) {
  const url = `https://douban.uieee.com/v2/movie/subject/${item.doubanId}`
  const res = await request(url, [])
  return res
}

;(async () => {
  let movies = [
    {
      doubanId: 27010768,
      title: '寄生虫',
      rate: 8.7,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2561439800.jpg'
    },
    {
      doubanId: 26794435,
      title: '哪吒之魔童降世',
      rate: 8.5,
      poster: 'https://img9.doubanio.com/view/photo/l_ratio_poster/public/p2563780504.jpg'
    }
  ]

  movies.map(async (movie) => {
    let movieData = await fetch(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.summary)
    } catch (err) {
      console.log(err)
    }
  })
})()