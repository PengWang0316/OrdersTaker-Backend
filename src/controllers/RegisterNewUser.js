const bcrypt = require('bcrypt');
// require('dotenv').config(); // Loading .env to process.env

const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { registerNewUser } = require('../models/User');

/**
 * Add a new user data to the database and write back a user object to response.
 * role 3 is for the normal user.
 * @param {object} req is a html request object.
 * @param {object} res is a html response object.
 * @return {null} No return.
 */
module.exports = (req, res) => bcrypt.hash(req.body.password, process.env.SALT_ROUNDS * 1)
  .then(hash => {
    registerNewUser({
      username: req.body.username,
      password: hash,
      role: 3,
      createDate: new Date(),
      displayName: req.body.username,
      facebookId: '',
      googleId: '',
      email: req.body.email,
      avatar: null,
    }).then(result => {
      res.json(JWTUtil.signJWT(result));
    }).catch(err => logger.error('/registerNewUser', err));
  }).catch(err => logger.error('/registerNewUser', err));
