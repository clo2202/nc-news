const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/controller");
const { error405Handler } = require("../errors/error");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(error405Handler);

module.exports = { topicsRouter };
