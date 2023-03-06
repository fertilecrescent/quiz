const quizRouter = require('express').Router()
require('dotenv').config()
const User = require('../models/user.js')
const Quiz = require('../models/quiz.js')
const jwt = require('jsonwebtoken')
const e = require('express')

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


// quizRouter.post('/:name')
// quizRouter.delete('/:id')

module.exports = quizRouter