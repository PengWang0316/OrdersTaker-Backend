const logger = require('../../utils/Logger');
const mongodb = require('../../MongoDB');

module.exports = (req, res) =>
  mongodb.findUserWithUsername(req.query.username).then(result => {
    if (result.length === 0) res.end(true);
    else res.end(false);
  }).catch(err => logger.error('/checkUsernameAvailable', err));
