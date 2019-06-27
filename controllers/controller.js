const {
  fetchTopics,
  fetchUsers,
  fetchArticles,
  amendArticleById,
  addCommentByArticleId
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  fetchUsers(req.params)
    .then(user => {
      if (user.length !== 0) {
        res.status(200).send(user[0]);
      } else {
        next({ status: 404, msg: "Username does not exist" });
      }
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticles(req.params)
    .then(article => {
      if (article.length !== 0) {
        res.status(200).send(article[0]);
      } else {
        next({ status: 404, msg: "Article does not exist" });
      }
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  amendArticleById(req.body, req.params)
    .then(([article]) => {
      res.status(201).send(article);
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  addCommentByArticleId(req.body, req.params)
    .then(([comment]) => {
      res.status(201).send(comment)
    })
    .catch(next)
}
