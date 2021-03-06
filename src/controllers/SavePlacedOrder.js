const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { savePlacedOrder } = require('../models/Order');
const { SOCKETIO_EVENT_ADD_NEW_ORDER, SOCKETIO } = require('../config');

module.exports = (req, res) => {
  const { order, jwtMessage } = req.body;
  // If no table number or no items, do not process the request.
  if (order.tableNumber === null || order.tableNumber === undefined || Object.keys(order.items).length === 0) {
    res.end();
    return null;
  }
  const userId = jwtMessage ? JWTUtil.verifyJWT(jwtMessage, res)._id : null; // Get the user id, if the user has already logged in.
  return savePlacedOrder(order, userId)
    .then(orderId => {
      req.app.get(SOCKETIO).emit(SOCKETIO_EVENT_ADD_NEW_ORDER, { ...order, _id: orderId });
      res.end(orderId);
    })
    .catch(err => {
      logger.error('/savePlacedOrder', err);
      res.end();
    });
};
