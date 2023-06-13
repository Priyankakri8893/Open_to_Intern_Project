const express= require('express')
const route= require('./src/routes/route')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(
    process.env.MUR, {useNewUrlParser: true}
    )
    .then( () => {
        console.log("mongodb is connected")
    })
    .catch( err => {
        console.log(err.message)
    })

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log(`server is running on Port ${process.env.PORT}`)
})