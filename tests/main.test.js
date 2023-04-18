const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../src/app.js')
const User = require('../src/models/user.js')
const Quiz = require('../src/models/quiz.js')
const Question = require('../src/models/question.js')
const QuizAttempt = require('../src/models/quizAttempt.js')

const connectToDB = require('../src/utils/connectToDB.js')
const {setTokenHeader, loginUser} = require('./utils.js')

const {createPhil, createErica, createMoses, philPassword} = require('./userData.js')
const {createArithmeticQuiz, createAnimalsQuiz, createGeographyQuiz} = require('./quizData.js')

const api = supertest(app)

mongoose.set('strictQuery', true)

// can increase this value if internet is slow
jest.setTimeout(5000)

// async function createPhil() {
//     const passwordHash = await bcrypt.hash('abc123', 10)
//     const phil =  await User.create({
//         username: 'dragonMaster',
//         name: 'Phil',
//         passwordHash: passwordHash
//     })
//     return phil
// }

// async function loginPhil() {
//     const phil = await createPhil()
//     let token
//     await api
//             .post('/login')
//             .send({username: phil.username, password: 'abc123'})
//             .then((response, _) => {
//                 token = response.body['token']
//             })
//     return {token, phil}
// }


beforeAll(async () => {
    await connectToDB()
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
    await QuizAttempt.deleteMany({})
})

afterEach(async () => {
    console.log('test complete')
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await Question.deleteMany({})
    await QuizAttempt.deleteMany({})
})

afterAll(async () => {
    await User.deleteMany({})
    await Quiz.deleteMany({})
    await mongoose.connection.close()
})

test('POST /login', async () => {

    const phil = await createPhil()

    // valid -> sets a 'token' cookie
    await api.
            post('/login').
            send({
                username: phil.username,
                password: philPassword
            }).
            expect(200).
            then((response) => {
                const cookies = response.headers['set-cookie']
                const tokenCookie = cookies.filter((cookie) => cookie.startsWith('token'))
                expect(tokenCookie.length).toBe(1)
            })

    // username does not exist -> throws a 401
    await api.
            post('/login').
            send({
                username: 'dragonMaster555',
                password: philPassword
            }).
            expect(401)
    
    // incorrect password -> throws a 401
    await api.
            post('/login').
            send({
                username: 'dragonMaster',
                password: philPassword + 'a'
            }).
            expect(401)
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
                expect(user.name).toBe('Phil')
                expect(user.username).toBe('dragonMaster')
            })
    
    const user = await User.find({username: 'dragonMaster'})
    expect(user).toBeTruthy() // user exists in db
    
    // try to create a duplicate user
    await api.
            post('/user').
            send({name: 'Phil', username: 'dragonMaster', password: 'abc123'}).
            expect(400).
            then((response) => {
                expect(response.body['error']).toBe('username is taken')
            })
})

// test('GET quiz/all-names', async () => {

//     const {phil, token} = await loginPhil()

//     await Quiz.create({
//         name: 'math',
//         user: phil._id
//     })
//     await Quiz.create({
//         name: 'animals',
//         user: phil._id
//     })
//     await Quiz.create({
//         name: 'geography',
//         user: phil._id
//     })

//     await api
//             .get('/quiz/all-names')
//             .set(setTokenHeader({}, token))
//             .send()
//             .expect(200)
//             .then((response, _) => {
//                 expect(response.body.names.length).toBe(3)
//                 expect(response.body.names.includes('math')).toBe(true)
//                 expect(response.body.names.includes('animals')).toBe(true)
//                 expect(response.body.names.includes('geography')).toBe(true)
//             })
// })

test('DELETE /user unpublished', async () => {
    const phil = await createPhil()
    const token = await loginUser(phil)
    const erica = await createErica()
    const moses = await createMoses()

    const philQuiz = await createArithmeticQuiz(phil)
    const ericaQuiz = await createAnimalsQuiz(erica)
    const mosesQuiz = await createGeographyQuiz(moses)
    const numPhilQuizzes = 1
    const initNumQuizzes = 3

    const initNumPhilQuestions = philQuiz.questions.length
    const initNumEricaQuestions = ericaQuiz.questions.length
    const initNumMosesQuestions = mosesQuiz.questions.length
    const initNumQuestions = initNumPhilQuestions + initNumEricaQuestions + initNumMosesQuestions

    await api
            .delete('/user')
            .set(setTokenHeader({}, token))
            .send({id: phil._id})
            .expect(200)
            .then(async () => {
                const notPhil = await User.find({username: phil.username})
                expect(notPhil.length).toBe(0)
                const quizzes = await Quiz.find({})
                expect(quizzes.length).toBe(initNumQuizzes-numPhilQuizzes)
                const questions = await Question.find({})
                expect(questions.length).toBe(initNumQuestions-initNumPhilQuestions)
            })
})

test('DELETE /user published', async () => {
    const phil = await createPhil()
    const token = await loginUser(phil)
    const erica = await createErica()
    const moses = await createMoses()

    const philUnpublishedQuiz = await createArithmeticQuiz(phil)
    const philPublishedQuiz = await createAnimalsQuiz(erica)
    const mosesQuiz = await createGeographyQuiz(moses)
    const numQuizzzesToBeDeleted = 1
    const initNumQuizzes = 3

    const initNumQuestions = philUnpublishedQuiz.questions.length 
    + philPublishedQuiz.questions.length + mosesQuiz.questions.length
    const numQuestionsToBeDeleted = philPublishedQuiz.questions.length


    await api
            .delete('/user')
            .set(setTokenHeader({}, token))
            .send({id: phil._id})
            .expect(200)
            .then(async () => {
                const notPhil = await User.find({username: phil.username})
                expect(notPhil.length).toBe(0)
                const quizzes = await Quiz.find({})
                expect(quizzes.length).toBe(initNumQuizzes-numQuizzzesToBeDeleted)
                const questions = await Question.find({})
                expect(questions.length).toBe(initNumQuestions-numQuestionsToBeDeleted)
            })
})

test('GET /quiz', async () => {
    const erica = await createErica()
    const token = await loginUser(erica)
    const ericaQuiz = await createArithmeticQuiz(erica)
    console.log(ericaQuiz._id)

    await api
            .get('/quiz')
            .set(setTokenHeader({}, token))
            .send({id: ericaQuiz._id})
            .expect(200)
            .then((response) => {
                const quiz = response.body.quiz
                console.log(quiz, 'quiz')
                expect(quiz.id).toBe(ericaQuiz._id.toString())
                expect(quiz.name).toBe(ericaQuiz.name)
                expect(quiz.questions.length).toBe(ericaQuiz.questions.length)
                expect(quiz.questions[2].answer).toBe(ericaQuiz.questions[2].answer)
            })
})

test('POST /quiz', async () => {

    const phil = await createPhil()
    const token = await loginUser(phil)

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
            .set(setTokenHeader({}, token))
            .send(requestBody)
            .expect(200)
            .then((response) => {
                const quiz = response.body.quiz
                expect(quiz.name).toBe('arithmetic')
                expect(quiz.questions.length).toBe(3)
                expect(quiz.questions[2].answer).toBe('2')
            })
})

test('DELETE /quiz', async () => {
    const phil = await createPhil()
    const philToken = await loginUser(phil)
    const erica = await createErica()
    const ericaToken = await loginUser(erica)
    const moses = await createMoses()


    // trying to delete a quiz that does not exist results in a 400 error status
    await api.
            delete('/quiz').
            set(setTokenHeader({}, ericaToken)).
            send({quizId: '643dbb56989b6d7b81175587'}).
            expect(400).
            then((res) => expect(res.body.error).toBe('quiz not found'))

    const philQuiz = await createArithmeticQuiz(phil)
    const ericaQuiz = await createAnimalsQuiz(erica)
    const mosesQuiz = await createGeographyQuiz(moses)
    const initNumQuizzes = 3

    // trying to delete a published quiz results in a 400 error status
    expect(ericaQuiz.published).toBe(true)
    await api.
            delete('/quiz').
            set(setTokenHeader({}, ericaToken)).
            send({quizId: ericaQuiz._id}).
            expect(400).
            then((res) => expect(res.body.error).toBe('cannot delete a published quiz'))

    // a published quiz does not get deleted
    let numQuizzes = (await Quiz.find({})).length
    expect(numQuizzes).toBe(initNumQuizzes)
    
    // deleting an unpublished quiz is valid
    await api.
        delete(`/quiz`).
        set(setTokenHeader({}, philToken)).
        send({quizId: philQuiz._id}).
        expect(200)
    
    // an unpublished quiz gets removed from the db
    expect((await Quiz.find({})).length).toBe(numQuizzes-1)
    numQuizzes = numQuizzes - 1
    
    // trying to delete another user's quiz results in a 400 error status
    await api.delete('/quiz').
        set(setTokenHeader({}, philToken)).
        send({quizId: mosesQuiz._id}).
        expect(401).
        then((res) => expect(res.body.error).toBe('cannot delete another user\'s quiz'))

    // trying to delete another user's quiz has no effect
    expect((await Quiz.find({})).length).toBe(numQuizzes)
})

test('POST /quiz/question', async () => {
    const phil = await createPhil()
    const philToken = await loginUser(phil)
    const moses = await createMoses()
    const philQuizUnpublished = await createArithmeticQuiz(phil)
    const philQuizPublished = await createAnimalsQuiz(phil)
    const mosesQuiz = await createGeographyQuiz(moses)

    const q4 = {
        name: 'This is a question',
        choices: ['5', '6', '7', '8'],
        quiz: philQuizUnpublished._id
    }

    const q5 = {
        name: 'This is another question',
        answer: 'This is the answer',
        quiz: philQuizUnpublished._id
    }

    const questions = [q4, q5]
    
    // trying to add questions to a quiz that does not exist results in a 400 error status
    await api.
            post('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questions: [q4, q5],
                quizId: '643dbb56989b6d7b81175587'
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('quiz not found'))

    // trying to add questions to a published quiz results in a 400 error status
    let numQuestionsBefore = philQuizPublished.questions.length
    await api.
            post('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questions: questions,
                quizId: philQuizPublished._id
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('cannot update a published quiz'))

    // trying to add questions to a published quiz has no effect
    let numQuestionsAfter = (await Quiz.findOne({_id: philQuizPublished._id})).questions.length
    expect(numQuestionsBefore).toBe(numQuestionsAfter)

    // trying to add questions to another user's quiz results in a 401 error status
    numQuestionsBefore = mosesQuiz.questions.length
    await api.
            post('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questions: questions,
                quizId: mosesQuiz._id
            }).
            expect(401).
            then((res) => expect(res.body.error).toBe('cannot update another user\'s quiz'))

    // trying to add questions to another user's quiz has no effect
    numQuestionsAfter = (await Quiz.findOne({_id: mosesQuiz._id})).questions.length
    expect(numQuestionsBefore).toBe(numQuestionsAfter)

    // trying to add questions to an existing, published quiz, belonging to the user
    // results in a http status 200
    await api.
            post('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questions: questions,
                quizId: philQuizUnpublished._id
            }).
            expect(200)

    // trying to add questions to an existing, published quiz, belonging to the user
    // actually adds the questions
    numQuestionsBefore = philQuizUnpublished.questions.length
    numQuestionsAfter = (await Quiz.findOne({_id: philQuizUnpublished._id})).questions.length
    expect(numQuestionsBefore).toBe(numQuestionsAfter-2)


})

test('DELETE /quiz/question', async () => {

    const phil = await createPhil()
    const philToken = await loginUser(phil)
    const moses = await createMoses()

    // trying to delete a question from a quiz that does not exist results in a 400 error status
    await api.
            delete('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questionId: '643dbb56989b6d7b81175587',
                quizId: '643dbb56989b6d7b81175587'
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('quiz not found'))
    
    const philQuizUnpublished = await createArithmeticQuiz(phil)
    const philQuizPublished = await createAnimalsQuiz(phil)
    const mosesQuiz = await createGeographyQuiz(moses)

    const philUnpublishedQ1 = philQuizUnpublished.questions[0]
    const philUnpublishedQ2 = philQuizUnpublished.questions[1]
    await philUnpublishedQ2.deleteOne()
    const philPublishedQ1 = philQuizPublished.questions[0]
    const mosesQ1 = mosesQuiz.questions[0]

    // trying to delete a question that does not exist results in a 400 status error
    await api.
            delete('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questionId: philUnpublishedQ2._id,
                quizId: philUnpublishedQuiz._id
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('question not found'))
    
    // trying to delete a question from a quiz that it does not belong to results 
    // in a 400 status error
    await api.
            delete('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questionId: philUnpublishedQ1._id,
                quizId: mosesQuiz._id
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('cannot delete a question' + 
            'from a quiz that it does not belong to'))

    // trying to delete a question from a quiz that it does not belong to has 
    // no effect
    expect(await Question.findOne({_id: philUnpublishedQ1._id})).toBeTruthy()

    // trying to delete a question from a published quiz results in a 400 error status
    await api.
            delete('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questionId: philPublishedQ1._id,
                quizId: philPublishedQuiz._id
            }).
            expect(400).
            then((res) => expect(res.body.error).toBe('cannot update a published quiz'))

    // trying to delete a question from a published quiz has no effect
    expect(await Question.findOne({_id: philPublishedQ1._id})).toBeTruthy()

    // trying to delete a question from another user's quiz results in a 401 error status
    await api.
            delete('/quiz/question').
            set(setTokenHeader({}, philToken)).
            send({
                questionId: mosesQ1._id,
                quizId: mosesQuiz._id
            }).
            expect(401).
            then((res) => expect(res.body.error).toBe('cannot update another user\'s quiz'))

    // trying to delete a question from another user's quiz has no effect
    expect(await Question.findOne({_id: mosesQ1._id})).toBeTruthy()

    // trying to delete a question from an existing, published quiz, belonging to the user
    // results in a http status 200
    

    // trying to delete a question from an existing, published quiz, belonging to the user
    // actually adds the questions

})

test('POST /choice', async () => {
    const {token, phil} = await loginPhil()

    const q1 = {
        question: 'What is 2+2?',
        choices: ['0', '2', '4', '8'],
        answer: '4'
    }

    const quiz = await Quiz.create({
        user: phil._id,
        questions: [q1]
    })

    const requestBody = {
        quizId: quiz._id,
        questionId: quiz.questions[0]._id,
        choice: '10',
        token
    }

    await api
        .post('/quiz/choice')
        .set(setTokenHeader({}, token))
        .send(requestBody)
        .expect(200)
        .then((response) => {
            const {question} = response.body
            expect(question.choices.length).toBe(5)
            expect(question.choices[4]).toBe('10')
        })
})

test('DELETE /choice', async () => {
    const {token, phil} = await loginPhil()

    const q1 = {
        question: 'What is 2+2?',
        choices: ['0', '2', '4', '8'],
        answer: '4'
    }

    const quiz = await Quiz.create({
        user: phil._id,
        questions: [q1]
    })

    const requestBody = {
        quizId: quiz._id,
        questionId: quiz.questions[0]._id,
        choice: '0',
        token
    }

    await api
        .delete('/quiz/choice')
        .set(setTokenHeader({}, token))
        .send(requestBody)
        .expect(200)
        .then((response) => {
            const {question} = response.body
            expect(question.choices.length).toBe(3)
            expect(question.choices.includes(0)).toBe(false)
        })
})
