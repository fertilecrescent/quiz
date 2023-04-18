const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user.js')
const Quiz = require('../models/quiz.js')
const parseToken = require('../utils/parseToken.js')

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

userRouter.delete('/', async (req, res) => {
    const token = parseToken(req)
    console.log('hello? 1')
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        console.log('hello? 2')
        if (err) {return res.status(401).json({'error': 'token invalid'})}
        else {
            console.log('hello? 3')
            const user = await User.findById({_id: decoded.id})
            await user.deleteOne()
            res.status(200).send()
        }
    })
})

module.exports = userRouter