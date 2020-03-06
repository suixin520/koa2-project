// 本段代码为爬取豆瓣电影API，仅供学习使用，请不要恶意访问，如给作者造成不遍，请联系Me删除代码，695568126@qq.com
const puppeteer = require('puppeteer')
const base = 'https://movie.douban.com/subject/'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

process.on('message', async movies => {
  console.log('start visit a new douban page>>>')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })  // 注册一个浏览器
  const page = await browser.newPage() // 在浏览器中打开一个页面

  for (let i = 0; i < movies.length; i++) {
    let doubanId = movies[i].doubanId

    await page.goto(base + doubanId, {
      waitUntil: 'networkidle2'
    })
    await sleep(5000)
    const result = await page.evaluate(() => {
      let $ = window.$
      let it = $('.related-pic-video')

      if (it && it.length > 0) {
        let reg = /\((.+?)\)/g
        let link = it.attr('href')
        let cover = it.attr('style').match(reg)

        return {
          link,
          cover: cover[0].substring(1, cover[0].length - 1)
        }
      }
      return {}
    })

    let video
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(2000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }
    const data = {
      doubanId,
      cover: result.cover,
      video
    }
    process.send(data)
  }

  await browser.close()
  process.exit(0)
})