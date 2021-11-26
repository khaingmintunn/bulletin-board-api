const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const services = require('./services')

app.use(body_parser.json())
app.use(cors())
app.use(logger('dev'))
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true })
let dbconnection = mongoose.connection
dbconnection.on(
  'error',
  console.error.bind(console, 'Database connection error')
)
dbconnection.once('open', () => {
  console.log('Database connected.')
})
app.use('/', services)

app.listen(process.env.PORT, () => {
  console.log(`Server is up.`)
})
