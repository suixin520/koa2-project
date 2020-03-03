const { readFile } = require('fs')
const EventEmitter = require('events')

class EE extends EventEmitter {}

const eventObj = new EE()

process.nextTick(() => {
  console.log('process.nextTick 的回调')
})

eventObj.on('event', () => {
  console.log('触发EventEmitter中的event事件')
})

Promise.resolve()
  .then(() => {
    eventObj.emit('event')

    process.nextTick(() => {
      console.log('Promise第一次回调中的process.nextTick回调') // promise第二次回调结束后执行
    })

    console.log('Promise 的第 1 次回调')
  })
  .then(() => {
    console.log('Promise 的第 2 次回调')
  })

setTimeout(() => {
  console.log('执行0毫秒延迟的setTimeout')
}, 0)

readFile('../package.json', data => {
  console.log('完成第一个文件读取回调')
})

readFile('../README.md', data => {
  console.log('完成第二个文件读取回调')
})

setImmediate(() => {
  console.log('立即执行setImmediate')
})

setTimeout(() => {
  console.log('执行100毫秒延迟的setTimeout')
}, 100)

setTimeout(() => {
  console.log('执行200毫秒延迟的setTimeout')
}, 200)