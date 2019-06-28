const { fetchUsers } = require('../models/users-model')

exports.getUserById = (req, res, next) => {
    fetchUsers(req.params)
      .then(user => {
        if (user.length !== 0) {
          res.status(200).send({user: user[0]});
        } else {
          next({ status: 404, msg: "Username does not exist" });
        }
      })
      .catch(next);
  };