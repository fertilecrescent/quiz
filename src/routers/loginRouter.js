const express = require('express')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const loginRouter = express.Router()

loginRouter.post('/', (req, res) => {
    const {username, password} = req.body
    User.findOne({username: username}).then(async (user, err) => {
        
        if (err) {res.status(500).send()}
        if (!user) {
            return res.status(401).send({'error': 'invalid username or password'})
        }

        const passValid  = await bcrypt.compare(password, user.passwordHash)
        if (!passValid) {
            return res.status(401).send({'error': 'invalid username or password'})
        } else {
            const token = jwt.sign({id: user._id}, process.env.SECRET)
            return res.status(200).json({token})
        }
    })
})

module.exports = loginRouter