const rootRouter = require('express').Router()
const path = require('path')

rootRouter.get('/', (req, res) => {
    return res.sendFile(path.resolve(__dirname, '../views/login.html'))
})

module.exports = rootRouter