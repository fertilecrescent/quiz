const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user.js')
const Quiz = require('../models/quiz.js')

const userRouter = require('express').Router()

userRouter.post('/', async (req, res) => {
    const { name, username, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
        name: name, 
        username: username, 
        passwordHash: passwordHash
    })
    user.save((err, user) => {
        if (err) {
            if (err.code === 11000) {
                return res.status(400).json({'error': 'username is taken'})
            } else {
                return res.status(500).send()
            }
        } else {
            return res.status(200).json({user})
        }
    })
})

userRouter.delete('/', (req, res) => {
    const { token } = req.body
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            Quiz.deleteMany({user: decoded.id}).then((_, err) => {
                if (err) {return err}
                else {
                    return User.deleteOne({_id: decoded.id})
                }
            }).then((_, err) => {
                console.log('hi?')
                if (err) {return res.status(500).send()}
                else {return res.status(200).send()}
            })
        }
    })
})

module.exports = userRouter