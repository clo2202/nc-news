const { connection } = require("../connection");

exports.fetchTopics = () => {
  return connection("topics").select("*");
};

exports.addTopic = topic => {
  return connection("topics")
    .insert(topic)
    .returning("*");
};
