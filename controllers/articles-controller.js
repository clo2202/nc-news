const { fetchArticles, amendArticleById, addCommentByArticleId } = require('../models/articles-models')
const { fetchComments } =require('../models/comments-model')

exports.getArticleById = (req, res, next) => {
    fetchArticles(req.params, req.query)
      .then(article => {
        if (article.length !== 0) {
          res.status(200).send({article: article[0]});
        } else {
          next({ status: 404, msg: "Article does not exist" });
        }
      })
      .catch(next);
  };
  
  exports.updateArticleById = (req, res, next) => {
    amendArticleById(req.body, req.params)
      .then(article => {
        if (article.length !== 0) {
          res.status(200).send({article: article[0]});
        } else {
          next({ status: 404, msg: "Article does not exist" })
        }
      })
      .catch(next);
  };
  
  exports.postCommentByArticleId = (req, res, next) => {
    addCommentByArticleId(req.body, req.params)
      .then(([comment]) => {
        res.status(201).send({comment})
      })
      .catch(next)
  }
  
  exports.getCommentsByArticleId = (req, res, next) => {
    fetchComments(req.params, req.query)
      .then(comments => {
          res.status(200).send({comments})
      })
      .catch(next)
  }

  exports.getArticles = (req, res, next) => {
    fetchArticles(req.params, req.query)
    .then(articles => {
      if(articles.length !== 0) {
        res.status(200).send({articles})
      } else {
        next({status: 404})
      }
    })
    .catch(next)
  }