const express = require('express')
const loginRouter = require('./routers/loginRouter.js')
const userRouter = require('./routers/userRouter.js')

const app = express()

app.use(express.json())
// app.use(express.static('./public'))
app.use('/login', loginRouter)
app.use('/user', userRouter)

module.exports = app