const logger = require('../utils/Logger');
const { isUserNameAvailable } = require('../models/User');

module.exports = (req, res) => isUserNameAvailable(req.query.username)
  .then(result => res.json(result)).catch(err => {
    logger.error('/checkUsernameAvailable', err);
    res.end();
  });
