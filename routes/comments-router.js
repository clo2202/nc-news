const express = require("express");
const commentsRouter = express.Router();
const { updateCommentById, deleteCommentbyId } = require("../controllers/controller");
const {
  error404Handler,
  error400Handler,
  error405Handler
} = require("../errors/error");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentById)
  .delete(deleteCommentbyId)
  .all(error405Handler);

commentsRouter.use(error404Handler);
commentsRouter.use(error400Handler);

module.exports = { commentsRouter };
