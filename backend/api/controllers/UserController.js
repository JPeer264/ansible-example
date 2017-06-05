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
        return res.status(500).json({ msg: 'Internal server error' });
      });
  };

  const getAll = (req, res) => {
    User.findAll()
      .then((users) => res.status(200).json({ users }))
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      });
  };

  const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      User.findOne({
        where: {
          username,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(400).json({ msg: 'Bad Request: User not found' });
          }

          return res.status(401).json({ msg: 'Unauthorized' });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ msg: 'Internal server error' });
        });
    }
  };

  return {
    getAll,
    create,
    login,
  };
};

module.exports = UserController;
