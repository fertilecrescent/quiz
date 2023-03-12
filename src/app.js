const express = require('express')
const path = require('path')
const rootRouter = require('./routers/rootRouter.js')
const loginRouter = require('./routers/loginRouter.js')
const userRouter = require('./routers/userRouter.js')
const quizRouter = require('./routers/quizRouter.js')

const app = express()

app.use(express.json())
console.log(__dirname + '/public')
app.use(express.static(path.join(__dirname + '/public')))
app.use('/', rootRouter)
app.use('/login', loginRouter)
app.use('/user', userRouter)
app.use('/quiz', quizRouter)

module.exports = app