const { fetchTopics, fetchUsers } = require('../models/models')

exports.getTopics = (req, res, next) => {
  fetchTopics()
  .then(topics => {
    res.status(200).send({topics})
  }).catch(next)
}

exports.getUserById = (req, res, next) => {
  fetchUsers(req.params)
  .then((user) => {
    if (user.length !== 0) {
      res.status(200).send(user[0])
    } else {
      next({status: 404, msg: "Username does not exist"})
    }
  }).catch(next)
}