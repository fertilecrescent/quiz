const rootRouter = require('express').Router()
const path = require('path')

rootRouter.get('/', (req, res) => {
    console.log('aye')
    console.log(path.resolve(__dirname, '../public'))
    return res.sendFile(path.resolve(__dirname, '../public/index.html'))
})

module.exports = rootRouter