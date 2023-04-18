const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    name: String,
    choices: [{
        type: String
    }],
    answer: String,
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    }
})

questionSchema.methods.isMultipleChoice = function() {
    if (this.choices.length > 1) {return true}
    else {return false}
}

questionSchema.pre('save', function() {
    if (this.isMultipleChoice() && !this.choices.includes(this.answer)) {
        throw new Error('For multiple choice questions, the answer must be included in the choices')
    }
})

questionSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id,
        delete obj._id
        delete obj.__v
    }
})

const Question = mongoose.model('Question', questionSchema)
module.exports = Question