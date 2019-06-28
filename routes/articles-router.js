const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles-controller");
const {
  error404Handler,
  error400Handler,
  error405Handler
} = require("../errors/error");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(error405Handler);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .all(error405Handler);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(error405Handler);

articlesRouter.use(error404Handler);
articlesRouter.use(error400Handler);

module.exports = { articlesRouter };
