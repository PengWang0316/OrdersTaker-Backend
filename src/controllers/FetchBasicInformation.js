const logger = require('../utils/Logger');
const { fetchBasicInformation } = require('../models/BasicInformation');

module.exports = (req, res) => fetchBasicInformation()
  .then(result => res.json(result)).catch(err => logger.error('/fetchBasicInformation', err));
