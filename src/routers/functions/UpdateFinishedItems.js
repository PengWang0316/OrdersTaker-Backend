// const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');
const { SUPER_USER_ROLE } = require('../../config');

module.exports = (req, res) => {
  const {
    orderId, itemId, isFinished, jwt
  } = req.body;
  const user = JWTUtil.verifyJWT(jwt, res);
  if (user.role > SUPER_USER_ROLE) {
    res.end();
    throw new Error('Invalid user');
  }
  mongodb.updateFinishedItems(orderId, itemId, isFinished);
  res.end();
};
