function doSync (sth, time) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(sth)
      resolve()
    }, time)
  })
}

function doAsync (sth, time, cb) {
  setTimeout(() => {
    console.log(sth)
    cb && cb()
  }, time)
}

function doElse (sth) {
  console.log(sth)
}

const Obj1 = { doSync, doAsync, doElse }
const Obj2 = { doSync, doAsync, doElse }

;(async () => {
  console.log('case1: 同步阻塞>>>')
  await Obj1.doSync('第一个人做事情', 2000)
  await Obj2.doSync('第二个人做事情', 2000)
  Obj2.doElse('第二个人做其他事情')

  console.log('case1: 异步非阻塞>>>')
  await Obj1.doAsync('第一个人做事情', 2000, () => {
    Obj2.doAsync('第二个人做事情', 2000)
  })
  Obj2.doElse('第二个人做其他事情')
})()