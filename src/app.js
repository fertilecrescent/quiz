const express = require('express')
const loginRouter = require('./routers/loginRouter.js')

const app = express()

app.use(express.json())
// app.use(express.static('./public'))
app.use('/login', loginRouter)

module.exports = app