// 本段代码为爬取孟坤博客，仅供学习使用，请不要恶意访问，如给作者造成不遍，请联系Me删除代码，695568126@qq.com
const puppeteer = require('puppeteer')

const URL = 'https://movie.douban.com/tag/#/'

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

  await page.goto(URL, {
    waitUntil: 'networkidle2'
  })

  await sleep(2000)

  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(2000)
    await page.click('.more')
  }

  const result = await page.evaluate(() => {
    let $ = window.$
    let items = $('.list-wp a')
    let links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  await browser.close()
  console.log('stop !!!')

  process.send({ result })
  process.exit(0)
})()