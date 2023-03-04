const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    questions: [String],
    answer: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

quizSchema.post('save', () => {
    this.populate('user').then((quiz, err) => {
        if (err) { return err }
        quiz.user.quizzes.push(quiz._id)
        quiz.save().then()
    }).then((_, err) => {
        if (err) { return err }
    })
})

quizSchema.set('toJSON', function(_, obj) {
    obj.id = obj._id
    delete obj._id
    delete obj.__v
})

module.exports = mongoose.model('Quiz', quizSchema)