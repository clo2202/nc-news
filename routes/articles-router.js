const express = require("express");
const articlesRouter = express.Router();
const { getArticleById, updateArticleById, postCommentByArticleId } = require("../controllers/controller");
const {
  error404Handler,
  error400Handler,
  error405Handler
} = require("../errors/error");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .all(error405Handler)

articlesRouter.post("/:article_id/comments", postCommentByArticleId)

articlesRouter.use(error404Handler);
articlesRouter.use(error400Handler);

module.exports = { articlesRouter };
