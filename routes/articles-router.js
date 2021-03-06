const express = require("express");
const articlesRouter = express.Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  deleteArticleById,
  postArticle
} = require("../controllers/articles-controller");
const {
  error404Handler,
  error400Handler,
  error405Handler
} = require("../errors/error");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(error405Handler);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticleById)
  .all(error405Handler);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(error405Handler);

articlesRouter.use(error404Handler);
articlesRouter.use(error400Handler);

module.exports = { articlesRouter };
