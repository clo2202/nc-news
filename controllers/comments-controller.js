const {
    amendCommentById,
    removeCommentById
  } = require("../models/comments-model");
  
  exports.updateCommentById = (req, res, next) => {
    amendCommentById(req.body, req.params)
    .then((comment) => {
      if (comment.length !== 0) {
        res.status(200).send({comment: comment[0]})
      } else {
        next({ status: 404, msg: "Comment does not exist" })
      }
    })
    .catch(next)
  }
  
  exports.deleteCommentbyId = (req, res, next) => {
    removeCommentById(req.params)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
  }