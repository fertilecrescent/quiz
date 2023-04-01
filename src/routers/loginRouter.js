const loginRouter = require('express').Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


loginRouter.get('/', (req, res) => {
    const {username, password} = req.body
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

loginRouter.get('/validateCredentials', (req, res) => {
    const { username, password } = req.query
    User.findOne({username})
    .catch(() => {res.status(500).send()})
    .then((user) => {
        if (!user) {
            console.log('not valid username')
            res.status(401).send() // user not found
            return Promise.reject()
        } else {
            return user
        }
    })
    .then((user) => {
        return bcrypt.compare(password, user.passwordHash)
    })
    .catch(() => res.status(500).send())
    .then((isValid) => {
        if (isValid) {
            res.status(200).send()
        } else {
            console.log('not valid password')
            res.status(401).send() // password not valid
        }
    })
})

module.exports = loginRouter