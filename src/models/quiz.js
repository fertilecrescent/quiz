const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        default: []
    }]
})

quizSchema.set('toJSON', function(_, obj) {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
})

module.exports = mongoose.model('Quiz', quizSchema)