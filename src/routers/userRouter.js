const bcrypt = require('bcrypt')
const User = require('../models/user.js')

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

// userRouter.delete('/:id')

module.exports = userRouter