const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');


module.exports = (req, res) =>
  mongodb.fetchOneUser(JWTUtil.verifyJWT({ message: req.query.jwtMessage, res })._id)
    .then(result => {
      const returnUser = { ...result };
      delete returnUser.password; // Remove password before return.
      if (!returnUser.role) returnUser.role = 3; // If the user does not have any role, give a 3 for the default role.
      res.json(returnUser);
    }).catch(err => logger.error('/jwtMessageVerify', err));
