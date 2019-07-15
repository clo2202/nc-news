const { fetchTopics, addTopic } = require('../models/topics-model')

exports.getTopics = (req, res, next) => {
    fetchTopics()
      .then(topics => {
        res.status(200).send({ topics });
      })
      .catch(next);
  };

  exports.postTopic = (req, res, next) => {
    addTopic(req.body).then(topic => {
     res.status(201).send({topic: topic[0]})
    })
    .catch(next)
  }