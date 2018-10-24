const Logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { updateFinishedItems } = require('../models/Order');
const { SUPER_USER_ROLE, SOCKETIO_EVENT_UPDATE_ORDER_ITEM, SOCKETIO } = require('../config');

module.exports = (req, res) => {
  const {
    orderId, itemId, isItemFinished, isOrderFinished, jwt,
  } = req.body;
  const user = JWTUtil.verifyJWT(jwt, res);
  if (user.role > SUPER_USER_ROLE) {
    res.end();
    throw new Error('Invalid user');
  }
  return updateFinishedItems(orderId, itemId, isItemFinished, isOrderFinished)
    .then(() => {
      req.app.get(SOCKETIO)
        .emit(SOCKETIO_EVENT_UPDATE_ORDER_ITEM, { orderId, itemId, isItemFinished });
      res.end();
    }).catch(err => {
      Logger.error('/updateFinishedItems', err);
      res.end();
    });
};
