const connectToDB = require('../src/utils/connectToDB.js')
const User = require('../src/models/user.js')
const Quiz = require('../src/models/quiz.js')
const { default: mongoose } = require('mongoose')


beforeAll(async () => {
    connectToDB()
    await User.deleteMany({})
    await Quiz.deleteMany({})
})

afterAll(async () => {
    await User.deleteMany({}).then((_, err) => {if (err) {throw err}})
    await Quiz.deleteMany({}).then((_, err) => {if (err) {throw err}})
    mongoose.connection.close()
})

test('User.username must be unique', async () => {

    const dragonMaster = User({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: 'abc123'
    })

    await dragonMaster.save()

    const dragonMaster2 = User({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: 'abc123'
    })
    
    let saveErr
    try {
        await dragonMaster2.save()
    } catch (err) {
        saveErr = err
    }
    expect(saveErr).toBeTruthy()
    expect(saveErr.code).toBe(11000)
})