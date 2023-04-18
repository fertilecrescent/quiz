const quizRouter = require('express').Router()
require('dotenv').config()
const Quiz = require('../models/quiz.js')
const Question = require('../models/question.js')
const jwt = require('jsonwebtoken')
const parseToken = require('../utils/parseToken.js')

// quizRouter.get('/all-names', (req, res) => {

//     const token = parseToken(req)

//     jwt.verify(token, process.env.SECRET, (err, decoded) => {
//         if (err) {
//             console.log(err, 'err')
//             return res.status(401).send({'error': 'token invalid'})
//         }
//         else {
//             Quiz.find({user: decoded.id}).then((quizzes, err) => {
//                 if (err) {return res.status(500).send()}
//                 else {
//                     const names = quizzes.map(quiz => quiz.name)
//                     return res.status(200).json({names})
//                 }
//             })
//         }
//     })
// })

quizRouter.get('/', (req, res) => {
    const token = parseToken(req)
    const { id } = req.body
    jwt.verify(token, process.env.SECRET, async (err, _) => {
        if (err) {
            return res.status(401).send({'error': 'invalid token'})
        } else {
            Quiz.findById(id).populate('questions').then((quiz, err) => {
                if (err) {return res.status(500).send()}
                else {
                    if (!quiz) {return res.status(500).send()}
                    else {
                        return res.status(200).json({quiz})
                    }
                }
            })
        }
    })
})

quizRouter.post('/', (req, res) => {
    const token = parseToken(req)
    const {name, questions} = req.body
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {return res.send(401).json({'error': 'token invalid'})}
        else {
            const questionDocs = await Question.insertMany(questions)
            const questionIds = questionDocs.map(doc => doc._id)
            const quiz = await Quiz.create({
                user: decoded.id,
                name: name,
                questions: questionIds
            })
            await quiz.populate('questions')
            res.json({quiz})
        }
    })
})

quizRouter.delete('/', (req, res) => {
    const token = parseToken(req)
    const { quizId } = req.body
    console.log(quizId, 'quizId')
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            const quiz = await Quiz.findOne({_id: quizId})
            if (!quiz) {
                res.status(400).json({'error': 'quiz not found'})
            } else if (quiz.user != decoded.id) {
                res.status(401).json({'error': 'cannot delete another user\'s quiz'})
            } else if (quiz.published) {
                res.status(400).json({'error': 'cannot delete a published quiz'})
            } else {
                await Quiz.deleteOne({_id: quizId})
                res.status(200).send()
            }
        }
    })
})

quizRouter.post('/question', (req, res) => {
    const token = parseToken(req)
    const {questions, quizId} = req.body
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {return res.send(401).json({'error': 'token invalid'})}
        else {
            const quiz = await Quiz.findOne({_id: quizId})
            if (!quiz) {
                res.status(400).json({'error': 'quiz not found'})
            } else if (quiz.user != decoded.id) {
                res.status(401).json({'error': 'cannot update another user\'s quiz'})
            } else if (quiz.published) {
                res.status(400).json({'error': 'cannot update a published quiz'})
            } else {
                const inserted = (await Question.insertMany(questions))
                const insertedIds = inserted.map((question) => question._id)
                await Quiz.updateOne({_id: quiz._id}, {'$push': {questions: insertedIds}})
                res.status(200).send()
            }
        }
    })
})

quizRouter.delete('/question', (req, res) => {
    const token = parseToken(req)
    const { quizId, questionId } = req.body
    jwt.verify(token, process.env.SECRET, (err, _) => {
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            Quiz.updateOne({_id: quizId}, {$pull: {questions: {_id: questionId}}}).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {res.status(200).send()}
            })
        }
    })
})

quizRouter.post('/choice', (req, res) => {
    const token = parseToken(req)
    const {quizId, questionId, choice} = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            Quiz.findById(quizId).then((quiz, err) => {
                if (err) {return err}
                else {
                    quiz.questions.id(questionId).choices.push(choice)
                    return quiz.save()
                }
            }).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {res.status(200).json({question: quiz.questions.id(questionId)})}
            })
        }
    })
})

quizRouter.delete('/choice', (req, res) => {
    const token = parseToken(req)
    const  {quizId, questionId, choice} = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.status(400).json({'error': 'token invalid'})}
        else {
            Quiz.findById(quizId).then((quiz, err) => {
                if (err) {return err}
                else {
                    quiz.questions.id(questionId).choices.pull(choice)
                    return quiz.save()
                }
            }).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {res.status(200).json({question: quiz.questions.id(questionId)})}
            })
        }
    })
})

module.exports = quizRouter