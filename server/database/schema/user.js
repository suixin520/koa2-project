const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed
const SALT_WORK_FACTOR = 10 // 盐值长度，越大密码越难破解，相应的计算机存储时候的运算能力就会变大，耗费资源变多
const MAX_LOGIN_ATTEMPTS = 5 // 最大尝试登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 最大锁定登录时间

const userSchema = new Schema({
  username: { // 用户名，unique表示此字段必须唯一，require表示此字段必须有值
    unique: true,
    required: true,
    type: String
  },
  email: { // 邮箱
    unique: true,
    required: true,
    type: String
  },
  password: { // 密码
    required: true,
    type: String
  },
  loginAttempts: { // 尝试登录次数
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number, // 锁定时间到什么时候
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.virtual('isLocked').get(function () { // schema中创建虚拟字段，不会被真正存储，但是可以访问。
  return !!(this.lockUntil && this.lockUntil > Date.now()) // 如果锁定时间大于现在时间，则锁定状态返回true
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next() // isModified是schema内置方法，用于判断该字段是否被修改过

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => { // 存储密码时候进行加密处理
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
})

userSchema.methods = { // schema.methods是往创建的schema上挂载操作方法，用于操作数据
  comparePassword: (_password, password) => { // 往userSchema上挂载密码比对方法
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },

  incLoginAttepts: (user) => { // 往userSchema上挂载限制登录方法
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) { // 如果当前用户是已经解锁状态
        this.update({ // 调用schema的update方法
          $set: {
            loginAttempts: 1 // $set修改器为强制设置某个字段值，没有则创建，甚至可以改变值类型
          },
          $unset: {
            lockUntil: 1 // $unset修改器为删除某个键无论值为多少  so=>这里为什么要删除lockUtil
          }
        }, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1 // $inc修改器为增加或减少某个字段值
          }
        }
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)