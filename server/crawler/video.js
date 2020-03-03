// 本段代码为爬取豆瓣电影API，仅供学习使用，请不要恶意访问，如给作者造成不遍，请联系Me删除代码，695568126@qq.com
const puppeteer = require('puppeteer')

const base = 'https://movie.douban.com/subject/'
const doubanId = '26794435'
// const baseUrl ='https://movie.douban.com/trailer/250477/#content'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('start visit a new douban page>>>')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })  // 注册一个浏览器

  const page = await browser.newPage() // 在浏览器中打开一个页面

  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'
  })

  await sleep(2000)

  const result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.related-pic-video')
    if (items) {
      let reg = /\((.+?)\)/g
      let link = items.attr('href')
      let cover = items.attr('style').match(reg)
      // let cover = it.find('.related-pic-video').attr('style')

      return {
        link,
        cover: cover[0].substring(1, cover[0].length - 1)
        // cover
      }
    }
  })

  let video
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)
    video = await page.evaluate(() => {
      let $ = window.$
      let item = $('source')
      if (item) {
        return item.attr('src')
      }

      return ''
    })
  }

  await browser.close()
  console.log('stop !!!')

  process.send({
    doubanId,
    cover: result.cover,
    video
  })
  process.exit(0)
})()