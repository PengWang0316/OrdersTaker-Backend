const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const userId = JWTUtil.verifyJWT(req.query.jwtMessage, res)._id;
  return mongodb.fetchLoginUserOrders(req.query.offset * 1, req.query.amount * 1, userId)
    .then(data => res.json(data))
    .catch(err => logger.error('/fetchLoginUserOrders', err));
};
