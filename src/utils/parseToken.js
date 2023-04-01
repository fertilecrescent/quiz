
function parseToken(req) {
    return req.headers['authorization'].slice(7)
}

module.exports = parseToken