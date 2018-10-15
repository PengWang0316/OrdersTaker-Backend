const logger = require('../utils/Logger');
const { fetchAllMenu } = require('../models/Menu');

module.exports = (req, res) => fetchAllMenu()
  .then(result => res.json(result)).catch(err => logger.error('/fetchAllMenu', err));
