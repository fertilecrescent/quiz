const mongoose = require('mongoose')
require('dotenv').config()

const connectionString = `mongodb+srv://quizUser:${process.env.DB_PASSWORD}`
+ `@cluster0.gfzxc63.mongodb.net/?retryWrites=true&w=majority`

async function connectToDB() {
    await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true  
    }).then((_, err) => {if (err) {console.error(err)}})
}

module.exports = connectToDB