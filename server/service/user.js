const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({ email })
  if (user) {
    match = await user.comparePassword(password, user.password)
  }
  return {
    match,
    user
  }
}