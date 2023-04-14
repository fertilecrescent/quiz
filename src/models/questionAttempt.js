const mongoose = require('mongoose')

const questionAttemptSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    attemptedAnswer: String
})

questionAttemptSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id
        delete obj._id
        delete obj.__v
    }
})

const QuestionAttempt = mongoose.model('QuestionAttempt', questionAttemptSchema)
module.exports = QuestionAttempt