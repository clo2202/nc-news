const { connection } = require("../connection");

exports.fetchUsers = ({username}) => {
  return connection('users')
  .select('*')
  .modify((query) => {
    if (username) query.where({username})
  })
}