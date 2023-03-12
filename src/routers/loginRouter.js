const loginRouter = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


loginRouter.post('/', (req, res) => {
    console.log('logging in')
    console.log(req.body, 'body')
    const {username, password} = req.body
    console.log(username, password, 'username password')
    User.findOne({username: username}).then(async (user, err) => {
        
        if (err) {return res.status(500).send()}
        if (!user) {
            return res.status(401).send({'error': 'invalid username or password'})
        }

        const passValid  = await bcrypt.compare(password, user.passwordHash)
        if (!passValid) {
            return res.status(401).send({'error': 'invalid username or password'})
        } else {
            const token = jwt.sign({id: user._id}, process.env.SECRET)
            res.status(200).send({token})
        }
    })
})

module.exports = loginRouter