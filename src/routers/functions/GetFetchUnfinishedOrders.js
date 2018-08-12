const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  if (JWTUtil.verifyJWT(req.query.jwt, res).role > process.env.ADVANCE_ROLE * 1) {
    res.end();
    return null;
  }
  return mongodb.fetchUnfinishedOrders().then(date => res.json(date)).catch(err => logger.error('/fetchUnfinishedOrders', err));
};
