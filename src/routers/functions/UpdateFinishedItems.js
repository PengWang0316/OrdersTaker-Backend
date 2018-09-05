const Logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');
const { SUPER_USER_ROLE, SOCKETIO_EVENT_UPDATE_ORDER_ITEM, SOCKETIO } = require('../../config');

module.exports = (req, res) => {
  const {
    orderId, itemId, isFinished, jwt
  } = req.body;
  const user = JWTUtil.verifyJWT(jwt, res);
  if (user.role > SUPER_USER_ROLE) {
    res.end();
    throw new Error('Invalid user');
  }
  return mongodb.updateFinishedItems(orderId, itemId, isFinished)
    .then(() => {
      req.app.get(SOCKETIO)
        .emit(SOCKETIO_EVENT_UPDATE_ORDER_ITEM, { orderId, itemId, isFinished });
      res.end();
    }).catch(err => {
      Logger.error('/updateFinishedItems', err);
      res.end();
    });
};
