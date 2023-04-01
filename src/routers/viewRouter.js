const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user.js')
const Quiz = require('../models/quiz.js')
const parseToken = require('../utils/parseToken.js')

const viewRouter = require('express').Router()

viewRouter.get('/home', (req, res) => {
    const token = req.query.token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            console.log(decoded.id, 'id /home')
            Quiz.find({user: decoded.id}).then((quizzes, err) => {
                console.log(quizzes, 'quizzes')
                const quizData = quizzes.map((quiz) => {return {id: quiz._id, name: quiz.name}})
                console.log(quizData, 'quizData')
                res.locals['quizzes'] = quizData
                res.locals['token'] = token
                console.log(res.locals, 'res.locals')
                res.render('home')
            })
        }
    })
})

module.exports = viewRouter