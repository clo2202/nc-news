const express = require('express')
const topicsRouter = express.Router()
const { getTopics } = require('../controllers/controller')

topicsRouter.get('/', getTopics)

module.exports = {topicsRouter}