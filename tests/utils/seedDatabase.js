const bcrypt = require('bcrypt')
const User = require('../../src/models/user.js')
const Quiz = require('../../src/models/quiz.js')

const connectToDB = require('../../src/utils/connectToDB.js')


const philUsername = 'dragonMaster'
const philPassword = 'abc123'
let philPasswordHash

connectToDB().then(async () => {
    const hash = await bcrypt.hash(philPassword, 10)
    philPasswordHash = hash
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await User.create({
        name: 'Phil',
        username: philUsername,
        passwordHash: philPasswordHash
    })
    console.log('finished seeding database')
})

// connectToDB().then(() => {
//     return bcrypt.hash(philPassword, 10)
// }).
// then((hash) => {
//     philPasswordHash = hash
// }).
// then(() => {
//     return User.deleteMany({})
// }).
// then(() => Quiz.deleteMany()).
// then(() => {
//     return User.create({
//         name: 'Phil',
//         username: philUsername,
//         passwordHash: philPasswordHash
//     })
// }).
// then(() => console.log('finished seeding database'))