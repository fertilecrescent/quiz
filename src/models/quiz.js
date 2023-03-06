const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    question: String,
    choices: [String],
    answer: String
})

const quizSchema = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: {
        type: [questionSchema],
        default: []
    }
})

quizSchema.set('toJSON', function(_, obj) {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
})

module.exports = mongoose.model('Quiz', quizSchema)