const User = require('../../src/models/user.js')
const Quiz = require('../../src/models/quiz.js')
const connectToDB = require('../../src/utils/connectToDB.js')

connectToDB().then(async () => {
    await User.deleteMany({})
    await Quiz.deleteMany({})
    console.log('finished clearing database')
})