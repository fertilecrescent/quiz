const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    type: String,
    choices: [{
        type: String,
        default: []
    }],
    answer: String,
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }
})

questionSchema.methods.isMultipleChoice = () => {
    if (this.choices.length > 1) {return true}
    else {return false}
}

questionSchema.pre('save', function() {
    if (this.isMultipleChoice() && !this.choices.include(this.answer)) {
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