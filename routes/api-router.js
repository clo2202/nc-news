const express = require('express')
const apiRouter = express.Router()
const {topicsRouter} = require('../routes/topics-router')

apiRouter.use('/topics', topicsRouter)

module.exports = {apiRouter}