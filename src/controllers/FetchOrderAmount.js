const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { fetchOrderAmount } = require('../models/Order');

module.exports = (req, res) => {
  const userId = JWTUtil.verifyJWT(req.query.jwtMessage, res)._id;
  return fetchOrderAmount(userId)
    .then(amount => res.end(amount))
    .catch(err => logger.error('/fetchOrderAmount', err));
};
