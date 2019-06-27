const express = require("express");
const commentsRouter = express.Router();
const { updateCommentById } = require('../controllers/controller')

commentsRouter.patch("/:comment_id", updateCommentById)

module.exports = { commentsRouter }