const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.fetchAllMenu()
    .then(result => res.json(result)).catch(err => logger.error('/fetchAllMenu', err));
