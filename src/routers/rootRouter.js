const rootRouter = require('express').Router()
const path = require('path')

rootRouter.get('/', (req, res) => {
    console.log(req.url, 'url')
    return res.sendFile(path.resolve(__dirname, '../public/login/login.html'))
})

module.exports = rootRouter