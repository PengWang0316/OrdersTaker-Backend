const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');
const bcrypt = require('bcrypt');

module.exports = (req, res) =>
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.json({ isFail: true });
    else {
      bcrypt.compare(req.query.password, result[0].password).then(compareResult => {
        if (compareResult) {
          res.json(JWTUtil.signJWT(result[0]));
        } else res.json({ isFail: true });
      });
    }
  }).catch(err => logger.error('/usernamePasswordLogin', err));
