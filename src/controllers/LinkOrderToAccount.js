const JWTUtil = require('../utils/JWTUtil');
const { linkOrderToAccount } = require('../models/Order');

module.exports = (req, res) => {
  const { orderId, jwt } = req.body;
  const userId = JWTUtil.verifyJWT(jwt, res)._id;
  linkOrderToAccount(orderId, userId);
  res.end();
};
