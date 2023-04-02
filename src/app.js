const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const rootRouter = require('./routers/rootRouter.js')
const viewRouter = require('./routers/viewRouter')
const loginRouter = require('./routers/loginRouter.js')
const userRouter = require('./routers/userRouter.js')
const quizRouter = require('./routers/quizRouter.js')

const app = express()


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname + '/public')))
app.use('/', rootRouter)
app.use('/login', loginRouter)
app.use('/user', userRouter)
app.use('/quiz', quizRouter)
app.use('/view', viewRouter)

module.exports = app