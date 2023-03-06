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
    await connectToDB()
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
    await mongoose.connection.close()
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

test('create new user', async () => {
    // create a user
    await api.
            post('/user').
            send({name: 'Phil', username: 'dragonMaster', password: 'abc123'}).
            expect(200).
            then((response) => {
                const user = response.body['user']
                expect(user).toBeTruthy()
                expect(user.passwordHash).toBe(undefined)
                expect(user._id).toBe(undefined)
                expect(user.__v).toBe(undefined)
                expect(user.name).toBe('Phil')
                expect(user.username).toBe('dragonMaster')
            })
    
    const user = await User.find({username: 'dragonMaster'})
    expect(user).toBeTruthy()
    
    // try to create a duplicate user
    await api.
            post('/user').
            send({name: 'Phil', username: 'dragonMaster', password: 'abc123'}).
            expect(400).
            then((response) => {
                expect(response.body['error']).toBe('username is taken')
            })
})