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

async function createPhil() {
    const passwordHash = await bcrypt.hash('abc123', 10)
    const phil =  await User.create({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: passwordHash
    })
    return phil
}

async function loginPhil() {
    const phil = await createPhil()
    let token
    await api
            .post('/login')
            .send({username: phil.username, password: 'abc123'})
            .then((response, _) => {
                token = response.body['token']
            })
    return {token, phil}
}

beforeAll(async () => {
    await connectToDB()
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
})

afterEach(async () => {
    console.log('testing...')
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

test('POST /login', async () => {

    const password = 'abc123'
    const passwordHash = await bcrypt.hash(password, 10)

    await User.create({
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

test('POST /user', async () => {
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

test('GET quiz/all-names', async () => {

    const {phil, token} = await loginPhil()

    await Quiz.create({
        name: 'math',
        user: phil._id
    })
    await Quiz.create({
        name: 'animals',
        user: phil._id
    })
    await Quiz.create({
        name: 'geography',
        user: phil._id
    })

    await api
            .get('/quiz/all-names')
            .send({token})
            .expect(200)
            .then((response, _) => {
                expect(response.body.names.length).toBe(3)
                expect(response.body.names.includes('math')).toBe(true)
                expect(response.body.names.includes('animals')).toBe(true)
                expect(response.body.names.includes('geography')).toBe(true)
            })
})

test('GET /quiz', async () => {
    const {phil, token} = await loginPhil()

    const quiz = new Quiz({
        name: 'arithmetic',
        user: phil._id
    })

    const q1 = {
        question: 'What is 2+2?',
        choices: ['0', '2', '4', '8'],
        answer: '4'
    }
    
    const q2 = {
        question: 'What is 4+4?',
        choices: ['0', '2', '4', '8'],
        answer: '8'
    }
        
    const q3 = {
        question: 'What is 1+1?',
        choices: ['0', '2', '4', '8'],
        answer: '2'
    }

    quiz.questions.push(...[q1, q2, q3])
    await quiz.save()

    await api
            .get('/quiz/' + quiz._id)
            .send({token})
            .expect(200)
            .then((response) => {
                const quiz = response.body.quiz
                expect(quiz.name).toBe('arithmetic')
                expect(quiz.questions.length).toBe(3)
                expect(quiz.questions[2].answer).toBe('2')
            })
})

test('POST /quiz', async () => {
    const {token} = await loginPhil()

    const q1 = {
        question: 'What is 2+2?',
        choices: ['0', '2', '4', '8'],
        answer: '4'
    }
    
    const q2 = {
        question: 'What is 4+4?',
        choices: ['0', '2', '4', '8'],
        answer: '8'
    }
        
    const q3 = {
        question: 'What is 1+1?',
        choices: ['0', '2', '4', '8'],
        answer: '2'
    }

    const requestBody = {
        token: token,
        name: 'arithmetic',
        questions: [q1, q2, q3]
    }

    await api
            .post('/quiz')
            .send(requestBody)
            .expect(200)
            .then((response) => {
                const quiz = response.body.quiz
                expect(quiz.name).toBe('arithmetic')
                expect(quiz.questions.length).toBe(3)
                expect(quiz.questions[2].answer).toBe('2')
            })
})

test('POST /quiz/question', async () => {
    const {token, phil} = await loginPhil()

    const quiz = await Quiz.create({
        name: 'arithmetic',
        user: phil._id
    })

    const question = {
        question: 'What is 2+2?',
        choices: ['0', '2', '4', '8'],
        answer: '4'
    }

    const requestBody = {token, question, quizId: quiz._id}

    await api
            .post('/quiz/question')
            .send(requestBody)
            .expect(200)
            .then((response) => {
                const quiz = response.body.quiz
                expect(quiz.name).toBe('arithmetic')
                expect(quiz.questions[0].question).toBe('What is 2+2?')
            })
})