const loginRouter = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


loginRouter.post('/', (req, res) => {
    console.log('logging in ')
    const {username, password} = req.body
    User.findOne({username: username})
    .then(async (user) => {
        if (!user) {
            res.status(401).send()
        } else {
            return bcrypt.compare(password, user.passwordHash)
            .then((passValid) => {
                if (passValid) {
                    const token = jwt.sign({id: user._id}, process.env.SECRET)
                    res.status(200).cookie('token', token, {httpOnly: true}).send()
                } else {
                    res.status(401).send()
                }
            })
            .catch(() => res.status(500).send())
        }
    })
    .catch(() => {
        res.status(500).send()
    })
})

module.exports = loginRouter