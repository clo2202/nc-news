const express = require('express')
const app = express()
const { apiRouter } = require('./routes/api-router.js')

app.use(express.json())
app.use('/api', apiRouter)

app.use('/*', (req, res, next) => {
  res.status(404).send('Route not found')
})

module.exports = { app }