const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String,
    questions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        default: []
    },
    published: {
        type: Boolean,
        default: false
    }
})

quizSchema.pre('deleteOne', function() {
    
})

quizSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id
        delete obj._id
        delete obj.__v
    }
})

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz