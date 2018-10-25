const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { fetchUnfinishedOrders } = require('../models/Order');

module.exports = (req, res) => {
  if (JWTUtil.verifyJWT(req.query.jwt, res).role > process.env.ADVANCE_ROLE * 1) {
    res.end();
    return null;
  }
  return fetchUnfinishedOrders().then(date => res.json(date)).catch(err => logger.error('/fetchUnfinishedOrders', err));
};
