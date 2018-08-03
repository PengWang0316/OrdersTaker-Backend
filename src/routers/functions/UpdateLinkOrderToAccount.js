// const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const { orderId, jwt } = req.body;
  const userId = JWTUtil.verifyJWT(jwt, res)._id;
  mongodb.linkOrderToAccount(orderId, userId);
  res.end();
};
