const { connection } = require("../connection");

exports.fetchTopics = () => {
  return connection("topics").select("*");
};

exports.fetchUsers = ({username}) => {
  return connection('users')
  .select('*')
  .modify((query) => {
    if (username) query.where({username})
  })
}
