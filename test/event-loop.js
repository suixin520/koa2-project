const { readFile, readFileSync } = require('fs')
const { resolve } = require('path')

/**
 * node.js事件循环验证归纳：
 * 第一：首先执行process.nextTick()
 * 第二：开始执行Micro task中的Promise
 * 第三：开始执行时间循环阶段
 *  {
 *    1. timer >>> setTimeout
 *    2. IO >>> 文件读写
 *    3. callback >>> setImmediate
 *  }
 * 原则：代码顺序按照上面顺序执行，然后在执行某一阶段过程中，又遇到类似Procee执行的话，会优先加入任务队列，在此阶段执行完成后会立马执行。同步阻塞的
 *      的任务会优先于process。
 */

setImmediate(() => console.log('[阶段3.immediate] immediate 回调1'))
setImmediate(() => console.log('[阶段3.immediate] immediate 回调2'))
setImmediate(() => console.log('[阶段3.immediate] immediate 回调3'))

Promise.resolve().then(() => {
  console.log('[...待切入下一阶段] promise 回调1')

  setImmediate(() => console.log('[阶段3.immediate] promise 回调1 增加的 immediate 回调4'))
})

readFile('../package.json', 'utf-8', data => {
  console.log('[阶段2...IO 回调] 读文件回调1')

  readFile('../video.mp4', 'utf-8', data => {
    console.log('[阶段2...IO 回调] 读文件回调2')

    setImmediate(() => console.log('[阶段3.immediate] 读文件回调2 增加的 immediate 回调4'))
  })

  setImmediate(() => {
    console.log('[阶段3.immediate] immediate 回调5')

    Promise.resolve().then(() => {
      console.log('[...待切入下一阶段] promise 回调2')
      process.nextTick(() => console.log('[...待切入下一阶段] promise 回调2 增加的 nextTick 回调5'))
    })
    .then(() => {
      console.log('[...待切入下一阶段] promise 回调3')
    })
  })
  setImmediate(() => {
    console.log('[阶段3.immediate] immediate 回调6')

    process.nextTick(() => console.log('[...待切入下一阶段] immediate 回调6 增加的 nextTick 回调7'))
    console.log('[...待切入下一阶段] 这块正在同步阻塞的读一个大文件')
    const video = readFileSync(resolve(__dirname, '../package-lock.json'), 'utf-8')
    process.nextTick(() => console.log('[...待切入下一阶段] immediate 回调6 增加的 nextTick 回调8'))

    readFile('../package.json', 'utf-8', data => {
      console.log('[阶段2...IO 回调] 读文件回调3')

      setImmediate(() => console.log('[阶段3.immediate] 读文件回调3 增加的 immediate 回调6'))
      setTimeout(() => console.log('[阶段1....定时器] 读文件回调3 增加的定时器回调8'), 0)
    })
  })

  process.nextTick(() => {
    console.log('[...待切入下一阶段] 读文件回调1 增加的 nextTick 回调6')
  })

  setTimeout(() => console.log('[阶段1....定时器] 定时器 回调5'), 0)
  setTimeout(() => console.log('[阶段1....定时器] 定时器 回调6'), 0)
})

setTimeout(() => console.log('[阶段1....定时器] 定时器 回调1'), 0)
setTimeout(() => {
  console.log('[阶段1....定时器] 定时器 回调2')

  process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调5')
  })
})
setTimeout(() => console.log('[阶段1....定时器] 定时器 回调3'), 0)
setTimeout(() => console.log('[阶段1....定时器] 定时器 回调4'), 0)

process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调1'))
process.nextTick(() => {
  console.log('[...待切入下一阶段] nextTick 回调2')
  process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调4'))
})
process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调3'))