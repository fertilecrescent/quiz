const jwt = require('jsonwebtoken')
require('dotenv').config()

function setTokenHeader(headers, token) {
    headers['Authorization'] = 'Bearer ' + token
    return headers
}

async function loginUser(user) {
    const token = jwt.sign({id: user._id}, process.env.SECRET)
    return token
}

module.exports = {setTokenHeader, loginUser}