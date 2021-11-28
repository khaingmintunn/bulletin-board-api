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
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.set('etag', false)
app.use('/', services)

app.listen(process.env.PORT, () => {
  console.log(`Server is up.`)
})
