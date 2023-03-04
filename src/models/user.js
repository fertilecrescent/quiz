const mongoose = require('mongoose')
const Quiz = require('./quiz')

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

userSchema.pre('deleteOne', function(next) {
    Quiz.deleteMany({user: this._id}).then((_, err) => {
        if (err) {next(err)}
        else {next()}
    })
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