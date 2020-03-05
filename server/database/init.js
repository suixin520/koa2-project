const mongoose = require('mongoose')
const db = `yours mongodb database`

mongoose.Promise = global.Promise

const maxConnectTimes = 5

exports.connect = () => {

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes--
      if (maxConnectTimes > 0) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库尝试重新连接失败！')
      }
    })

    mongoose.connection.on('error', err => {
      throw new Error('数据库连接过程中发生错误！')
    })

    mongoose.connection.once('open', () => {
      console.log('数据库连接成功！')

      const Dog = mongoose.model('Dog', { name: String })
      const dog1 = new Dog({ name: '阿尔法猫' })
      dog1.save().then(() => {
        console.log('存储成功！')
      })
      resolve()
    })
  })
}