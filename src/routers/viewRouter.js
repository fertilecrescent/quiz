const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user.js')
const Quiz = require('../models/quiz.js')
const parseToken = require('../utils/parseToken.js')

const viewRouter = require('express').Router()

viewRouter.get('/home', (req, res) => {
    const { token } = req.cookies
    console.log(token, 'token cookie')
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        console.log(decoded, 'decoded')
        if (err) {
            return res.status(401).send('<h1>You are not authorized to view this page</h1>')
        } else {
            Quiz.find({user: decoded.id})
            .then((quizzes) => {
                const quizData = quizzes.map((quiz) => {return {id: quiz._id, name: quiz.name}})
                res.locals['quizzes'] = quizData
                res.render('home')
            })
            .catch(() => {
                res.status(500).send('<h1>A problem occurred on the server</h1>')
            })
        }
    })
})

module.exports = viewRouter