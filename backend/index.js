const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// allows to create routes
const app = express()

// basic requirements
app.use(express.json())
app.use(cors())

// adding user and boss routers
const userRouter = require('./routes/user')
const bossRouter = require('./routes/boss')

// specifying what routes they will take
app.use('/user', userRouter)
app.use('/boss', bossRouter)


// database
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.x9hsu.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('database connected successfully!')}
)


// port on which backend is hosted
const PORT = 5000

// listening on port
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}!`)
})
