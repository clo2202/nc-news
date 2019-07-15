const express = require('express')
const app = express()
const { apiRouter } = require('./routes/api-router.js')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use('/api', apiRouter)

app.use('/*', (req, res, next) => {
  res.status(404).send('Route not found')
})

module.exports = { app }