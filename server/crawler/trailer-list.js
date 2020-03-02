// 本段代码为爬取孟坤博客，仅供学习使用，请不要恶意访问，如给作者造成不遍，请联系Me删除代码，695568126@qq.com
const puppeteer = require('puppeteer')

const URL = 'https://mkblog.cn/'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('start visit a new page>>>')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })  // 注册一个浏览器

  const page = await browser.newPage() // 在浏览器中打开一个页面

  await page.goto(URL, {
    waitUntil: 'networkidle2'
  })

  await sleep(2000)

  const result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.post-item-card')
    let links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        const it = $(item)
        let postUrl = it.find('.item-thumb').attr('href')
        let postTitle = it.find('.entry-title').text().trim()
        let postImg = it.find('.thumbnail').attr('style')
        let postNum = it.find('.entry-meta').text()

        links.push({
          postUrl,
          postTitle,
          postImg,
          postNum
        })
      })
    }

    return links
  })

  await browser.close()
  console.log('stop !!!')
  console.log(result)
})()