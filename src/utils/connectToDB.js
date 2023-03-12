const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const connectionString = `mongodb+srv://quizUser:${process.env.DB_PASSWORD}`
+ `@cluster0.gfzxc63.mongodb.net/?retryWrites=true&w=majority`

async function connectToDB() {
    console.log('conecting to database')
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true  
    }).then((_, err) => {
        if (err) {console.error(err)}
        else {console.log('finished connecting to database')}
    })
}

module.exports = connectToDB