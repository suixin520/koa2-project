const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  }, // 电影标识

  category: [{
    type: ObjectId,
    ref: 'Category'
  }],

  rate: Number, // 评分
  title: String, // 标题
  summary: String, // 简介
  video: String, // 视频源地址
  poster: String, // 海报源地址
  cover: String, // 封面图源地址

  videoKey: String, // 视频转存后地址
  posterKey: String, // 海报转存后地址
  coverKey: String, // 封面图转存后地址

  rawTitle: String, // 原标题
  movieTypes: [String], // 电影类型，用数组表示，数组中每个元素是String类型
  pubdate: Mixed, // 发布日期，Mixd为mongoose中特有类型，可以是任意类型
  year: Number, // 上映年份

  tags: [String], // 标签

  meta: {
    createdAt: { // 该数据创建时间
      type: Date,
      default: Date.now()
    },
    updatedAt: { // 该条数据更新时间
      type: Date,
      default: Date.now()
    }
  }
})

movieSchema.pre('save', function (next) { // 数据存储前先将创建时间和更新时间存入
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('Movie', movieSchema)