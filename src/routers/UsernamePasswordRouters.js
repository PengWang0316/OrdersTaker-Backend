const usernamePasswordRouters = require('express').Router();
// API_BASE_URL = "/resonancecode/api/v1/";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const winston = require('winston');

const mongodb = require('../MongoDB');

require('dotenv').config(); // Loading .env to process.env

const postRegisterNewUser = require('./functions/PostRegisterNewUser');

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = new winston.Logger({
  level: process.env.LOGGING_LEVEL,
  transports: [
    new (winston.transports.Console)()
  ]
});

/** Replaces the previous transports with those in the
new configuration wholesale.
  * When under the production mode, log to a file.
*/
if (process.env.NODE_ENV === 'production')
  logger.configure({
    level: 'error',
    transports: [
      new (winston.transports.File)({ filename: 'error.log' })
    ]
  });

/* This function return a non-password user object with a jwt property.
  * TODO this method has already been moved to utils/JWTUtil.js
  * It should be removed eventually.
*/
const signJWT = result => {
  const signInfo = { _id: result._id, role: result.role, isAuth: true };
  const user = { ...result, isAuth: true };
  delete user.password;
  // delete user.password;
  return { user, jwt: jwt.sign(signInfo, process.env.JWT_SECERT) };
};

usernamePasswordRouters.get('/usernamePasswordLogin', (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.json({ user: { isAuth: false, loginErr: true } });
    else {
      bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
        if (compareResult) {
          res.json(signJWT(result[0]));
        } else res.json({ user: { isAuth: false, loginErr: true } });
      }).catch(err => logger.error('/usernamePasswordLogin', err));
    }
  });
});

usernamePasswordRouters.get('/checkUsernameAvailable', (req, res) => {
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.json({
      isAuth: false, isUsernameAvailable: true, isChecked: true
    });
    else res.json({ isAuth: false, isUsernameAvailable: false, isChecked: true });
  }).catch(err => logger.error('/checkUsernameAvailable', err));
});

usernamePasswordRouters.post('/registerUser', postRegisterNewUser);

module.exports = usernamePasswordRouters;
