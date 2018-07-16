const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const { order, jwtMessage } = req.body;
  // If no table number or no items, do not process the request.
  if (order.tableNumber === null || order.tableNumber === undefined || Object.keys(order.items).length === 0) {
    res.end();
    return null;
  }
  const userId = jwtMessage ? JWTUtil.verifyJWT(jwtMessage, res)._id : null; // Get the user id, if the user has already logged in.
  return mongodb.savePlacedOrder(order, userId)
    .then(orderId => res.end(orderId))
    .catch(err => {
      logger.error('/savePlacedOrder', err);
      res.end();
    });
};
