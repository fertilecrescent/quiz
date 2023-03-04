const connectToDB = require('../src/utils/connectToDB.js')
const User = require('../src/models/user.js')
const Quiz = require('../src/models/quiz.js')
const Question = require('../src/models/question.js')


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

test('User.username must be unique', async () => {

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

test('Quiz saves to User', async () => {
    const user = new User({
        username: 'dragonMaster',
        name: 'Phil',
        passwordHash: 'abc123'
    })

    const savedUser = await user.save()
    console.log(savedUser.quizzes)

    const quiz = new Quiz({
        user: savedUser._id
    })

    await quiz.save()


    // const savedQuiz = await quiz.save()
    // const updatedUser = await User.findById(savedQuiz.user)
    // expect(updatedUser.quizzes.length).toBe(1)

    // const question = Question({
    //     quiz: quiz,
    //     question: 'What is 2 + 2?',
    //     choices: ['1', '2', '3', '4'],
    //     answer: '4'
    // })
})