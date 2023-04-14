const mongoose = require('mongoose')
const QuestionAttempt = require('./questionAttempt.js')

const quizAttemptSchema = new mongoose.Schema({
    name: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: {
        type: [QuestionAttempt.schema],
        default: []
    }
})

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema)
module.exports = QuizAttempt