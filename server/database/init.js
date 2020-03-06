const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')
const db = `yours mongodb database`

mongoose.Promise = global.Promise

let maxConnectTimes = 5

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
  const User = mongoose.model('User')
  const user = await User.findOne({
    username: 'suixin'
  })
  if (!user) {
    const admin = new User({
      username: 'suixin',
      email: 'suixin@11.com',
      password: '123456'
    })
    await admin.save()
  }
}

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

      // const Dog = mongoose.model('Dog', { name: String })
      // const dog1 = new Dog({ name: '阿尔法猫' })
      // dog1.save().then(() => {
      //   console.log('存储成功！')
      // })
      resolve()
    })
  })
}