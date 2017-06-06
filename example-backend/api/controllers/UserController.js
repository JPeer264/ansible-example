const User = require('../models/User');

const UserController = () => {
  const create = (req, res) => {
    const body = req.body;

    console.log(body);

    User.create({
      username: body.username,
      password: body.password,
    }).then((user) => res.status(200).json({ user }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      });
  };

  const getAll = (req, res) => {
    User.findAll()
      .then((users) => res.status(200).json({ users }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error', err });
      });
  };

  return {
    getAll,
    create,
  };
};

module.exports = UserController;
