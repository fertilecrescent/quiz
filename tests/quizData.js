const Quiz = require('../src/models/quiz.js')
const Question = require('../src/models/question.js')

async function createArithmeticQuiz(user) {
    const quiz = new Quiz({
        user: user._id,
        name: 'Arithmetic'
    })

    const q1 = await new Question({
        question: 'What is 2+2?',
        choices: ['2', '4', '6', '8'],
        answer: '4',
        quiz: quiz
    }).save()

    const q2 = await new Question({
        question: 'What does addition do?',
        answer: 'Adds two numbers together',
        quiz: quiz
    }).save()

    const q3 = await new Question({
        question: 'What is 3*4?',
        choices: ['4', '8', '12', '16'],
        answer: '12',
        quiz: quiz
    }).save()
    quiz.questions = [q1, q2, q3]

    return quiz.save()
}

async function createAnimalsQuiz(user) {
    const quiz = new Quiz({
        user: user._id,
        name: 'Animals',
        published: true
    })

    const q1 = await new Question({
        question: 'What sound does a cow make?',
        choices: ['2', '4', '6', '8'],
        answer: '4',
        quiz: quiz
    }).save()

    const q2 = await new Question({
        question: 'What is your favorite animal?',
        answer: 'There\'s really no wrong answer here',
        quiz: quiz
    }).save()

    const q3 = await new Question({
        question: 'Which an ancient reptile?',
        choices: ['dinosaur', 'bird', 'dog', 'rabbit'],
        answer: 'dinosaur',
        quiz: quiz
    }).save()

    quiz.questions = [q1, q2, q3]

    return await quiz.save()
}

async function createGeographyQuiz(user) {
    const quiz = new Quiz({
        user: user._id,
        name: 'Geography'
    })

    const q1 = await new Question({
        question: 'Which country is in the West',
        choices: ['United States', 'Japan', 'China', 'Korea'],
        answer: 'United States',
        quiz: quiz
    }).save()

    const q2 = await new Question({
        question: 'How would you describe a desert?',
        answer: 'Hot, dry, sandy',
        quiz: quiz
    }).save()

    const q3 = await new Question({
        question: 'Which of the following is a mountain?',
        choices: ['Sahara Desert', 'Indian Ocean', 'Mount Everest', 'Lake Michigan'],
        answer: 'Mount Everest',
        quiz: quiz
    }).save()

    quiz.questions = [q1, q2, q3]

    return await quiz.save()
}

module.exports = {
    createArithmeticQuiz,
    createAnimalsQuiz,
    createGeographyQuiz
}