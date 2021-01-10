// basic requirements
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// basic setup
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// importing routes
import slaveRouter from './routes/slave.js'
import masterRouter from './routes/master.js'

// basic requirements
app.use(express.json())
app.use(cors())

// actual routes
app.use('/slave', slaveRouter)
app.use('/master', masterRouter)

// // database connections
// const uri = process.env.ATLAS_URI
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
// )
// const connection = mongoose.connection
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })

// running it up!
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
