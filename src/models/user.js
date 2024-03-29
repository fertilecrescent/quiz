const mongoose = require('mongoose')
const Quiz = require('./quiz.js')
const Question = require('./question.js')
const QuizAttempt = require('./quizAttempt.js')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    passwordHash: String,
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        default: []
    }]
})

userSchema.pre('deleteOne', {document: true, query: false}, async function(x) {
    await this.populate('quizzes')
    const unpublishedIds = this.quizzes
    .filter((quiz) => quiz.published == false)
    .map((quiz) => quiz._id)

    await Quiz.deleteMany({_id: {'$in': unpublishedIds}})
    console.log(unpublishedIds, 'unpublishedIds')
    const questions = await Question.find({})
    for (let q of questions) {
        console.log(q.quiz, 'q.quiz')
    }
    await Question.deleteMany({quiz: {'$in': unpublishedIds}})
    await QuizAttempt.deleteMany({user: this._id})
})

userSchema.set('toJSON', {
    'transform': (doc, returnedObj) => {
        returnedObj.id = doc._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User