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
    const phil = await User.create({
        name: 'Phil',
        username: philUsername,
        passwordHash: philPasswordHash
    })
    
    await Quiz.create({
        name: 'Arithmetic',
        user: phil._id,
        questions: [
            {
                question: '2+2?',
                choices: ['2', '4', '6', '8'],
                answer: '4'
            },
            {
                question: '4+4?',
                choices: ['2', '4', '6', '8'],
                answer: '8'
            }
        ]
    })

    await Quiz.create({
        name: 'Science',
        user: phil._id,
        questions: [
            {
                question: 'What sound does a cow make?',
                choices: ['moo', 'ahh', 'quack', 'ow'],
                answer: 'moo'
            },
            {
                question: 'What sound does a duck make?',
                choices: ['moo', 'ahh', 'quack', 'ow'],
                answer: 'quack'
            }
        ]
    })



    console.log('finished seeding database')
})