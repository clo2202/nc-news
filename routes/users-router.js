const express = require("express");
const usersRouter = express.Router();
const { getUserById } = require("../controllers/users-controller");
const { error404Handler, error405Handler } = require("../errors/error");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(error405Handler);
usersRouter.use(error404Handler);


module.exports = { usersRouter };
