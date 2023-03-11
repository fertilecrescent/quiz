const quizRouter = require('express').Router()
require('dotenv').config()
const Quiz = require('../models/quiz.js')
const jwt = require('jsonwebtoken')

quizRouter.get('/all-names', (req, res) => {
    const {token} = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({'error': 'invalid token'})
        }
        else {
            Quiz.find({user: decoded.id}).then((quizzes, err) => {
                if (err) {return res.status(500).send()}
                else {
                    const names = quizzes.map(quiz => quiz.name)
                    return res.status(200).json({names})
                }
            })
        }
    })
})

quizRouter.get('/:id', (req, res) => {
    const {token} = req.body
    jwt.verify(token, process.env.SECRET, (err, _) => {
        if (err) {
            return res.status(401).send({'error': 'invalid token'})
        } else {
            Quiz.findById(req.params.id).then((quiz, err) => {
                if (err) {return res.status(500).send()}
                else {
                    if (!quiz) {return res.status(500).send()}
                    else {return res.status(200).json({quiz})}
                }
            })
        }
    })
})


quizRouter.post('/', (req, res) => {
    const {token, name, questions} = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.send(401).json({'error': 'token invalid'})}
        else {
            Quiz.create({
                user: decoded.id,
                name: name,
                questions: questions
            }).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {
                    return res.status(200).json({quiz})
                }
            })
        }
    })
})

quizRouter.delete('/:id', (req, res) => {
    const {token} = req.body
    jwt.verify(token, process.env.SECRET, (err, _) => {
        if (err) {res.status(401).json({'error': 'token invalid'})}
        else {
            Quiz.deleteOne({_id: req.params.id}).then((_, err) => {
                if (err) {res.status(500).send()}
                else {res.status(200).send()}
            })
        }
    })
})

quizRouter.post('/question', (req, res) => {
    const {token, questions, quizId} = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.send(401).json({'error': 'token invalid'})}
        else {
            Quiz.findById(quizId).then((quiz, err) => {
                if (err) {return err}
                else {
                    quiz.questions.push(...questions)
                    return quiz.save()
                }
            }).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {
                    return res.status(200).json({quiz})
                }
            })
        }
    })
})

quizRouter.delete('/question/:id', (req, res) => {
    const questionId = req.params.id
    console.log(questionId, 'question id')
    const {token, quizId} = req.body
    jwt.verify(token, process.env.SECRET, (err, _) => {
        if (err) {res.status(401).json({'error': 'token invalid'})}
        else {
            Quiz.updateOne({_id: quizId}, {$pull: {questions: {_id: questionId}}}).then((quiz, err) => {
                if (err) {res.status(500).send()}
                else {res.status(200).send()}
            })
        }
    })
})


// quizRouter.post('/choice')
// quizRouter.delete('/choice')

module.exports = quizRouter