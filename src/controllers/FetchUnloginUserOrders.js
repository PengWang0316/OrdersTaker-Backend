const logger = require('../utils/Logger');
const { fetchUnloginUserOrders } = require('../models/Order');

module.exports = (req, res) => {
  const { offset, amount, orderIds } = req.query;
  const newOrderIds = orderIds.slice(offset, offset + amount); // Making a new array based on the offset and amount.
  return fetchUnloginUserOrders(newOrderIds)
    .then(data => res.json(data))
    .catch(err => logger.error('/fetchUnloginOrders', err));
};
