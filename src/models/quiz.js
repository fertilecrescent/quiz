const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    questions: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
})

quizSchema.pre('save', async function() {
    this
    .populate('user')
    .then(() => {
        this.user.quizzes.push(this._id)
        return this.user.save()
    })
    .catch((err) => {
        throw err
    })
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