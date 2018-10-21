const bcrypt = require('bcrypt');

const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { findUserWithUsername } = require('../models/User');

module.exports = (req, res) => findUserWithUsername(req.query.username).then(result => {
  if (result.length === 0) res.json({ isFail: true });
  else {
    bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
      if (compareResult) {
        res.json(JWTUtil.signJWT(result[0]));
      } else res.json({ isFail: true });
    });
  }
}).catch(err => logger.error('/usernamePasswordLogin', err));
