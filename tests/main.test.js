const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

const app = require('../src/app.js')

const User = require('../src/models/user.js')
const Quiz = require('../src/models/quiz.js')
const Question = require('../src/models/question.js')

const connectToDB = require('../src/utils/connectToDB.js')

const api = supertest(app)

mongoose.set('strictQuery', true)

beforeAll(async () => {
    connectToDB()
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
})

afterEach(async () => {
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
})

afterAll(async () => {
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
    mongoose.connection.close()
})

test('usernames must be unique', async () => {

    const user = User({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: 'abc123'
    })

    await user.save()

    const user2 = User({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: 'abc123'
    })
    
    let saveErr
    try {
        await user2.save()
    } catch (err) {
        saveErr = err
    }

    expect(saveErr).toBeTruthy()
    expect(saveErr.code).toBe(11000)
})

test('login', async () => {

    const password = 'abc123'
    const passwordHash = await bcrypt.hash(password, 10)

    User.create({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: passwordHash
    })

    // valid
    await api.
            post('/login').
            send({
                username: 'dragonMaster',
                password: password
            }).
            expect(200).
            then((response) => {
                expect(response.body['token']).toBeTruthy()
            })

    // username does not exist
    await api.
            post('/login').
            send({
                username: 'dragonMaster555',
                password: password
            }).
            expect(401).
            then((response) => {
                expect(response.body['error']).toBe('invalid username or password')
            })
    
    // incorrect password
    await api.
            post('/login').
            send({
                username: 'dragonMaster',
                password: password + 'a'
            }).
            expect(401).
            then((response) => {
                expect(response.body['error']).toBe('invalid username or password')
            })
})