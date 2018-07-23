const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => {
  const { offset, amount, orderIds } = req.query;
  const newOrderIds = orderIds.slice(offset, offset + amount); // Making a new array based on the offset and amount.
  return mongodb.fetchUnloginUserOrders(newOrderIds)
    .then(data => res.json(data))
    .catch(err => logger.error('/fetchLoginOrders', err));
};
