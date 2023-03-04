const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    question: String,
    choices: [String],
    answer: String,
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
})

questionSchema.set('toJSON', {
    transform: (_, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model('Question', questionSchema)

