const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) => mongodb.isUserNameAvailable(req.query.username)
  .then(result => res.json(result)).catch(err => {
    logger.error('/checkUsernameAvailable', err);
    res.end();
  });
