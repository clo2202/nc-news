const express = require('express')
const apiRouter = express.Router()
const {topicsRouter} = require('./topics-router')
const {usersRouter} = require('./users-router')
const {articlesRouter} = require('./articles-router')
const {commentsRouter} = require('./comments-router')
const endPoints = require('../endpoints.json')

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

apiRouter.get('/', (req, res, next) => {
  res.status(200).send(endPoints)
})


module.exports = {apiRouter}