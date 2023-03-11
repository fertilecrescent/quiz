const express = require('express')
const rootRouter = require('./routers/rootRouter.js')
const loginRouter = require('./routers/loginRouter.js')
const userRouter = require('./routers/userRouter.js')
const quizRouter = require('./routers/quizRouter.js')

const app = express()

app.use(express.json())
// app.use(express.static('./public'))
app.use('/', rootRouter)
app.use('/login', loginRouter)
app.use('/user', userRouter)
app.use('/quiz', quizRouter)

module.exports = app