const app = require('./app.js')
const connectToDB = require('./utils/connectToDB.js')

connectToDB().then((_, err) => {
    if (err) {console.log('couldn\'t connect to databse')}
    else {
        const PORT = 3000
        app.listen(PORT, console.log(`listening on port ${PORT}`))
    }
})

