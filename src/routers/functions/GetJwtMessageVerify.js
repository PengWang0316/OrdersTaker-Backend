const logger = require('../../utils/Logger');
const JWTUtil = require('../../utils/JWTUtil');
const mongodb = require('../../MongoDB');


module.exports = (req, res) =>
  mongodb.fetchOneUser(JWTUtil.verifyJWT({ message: req.query.jwtMessage, res })._id)
    .then(result => res.json({ ...result, isAuth: true }))
    .catch(err => logger.error('/jwtMessageVerify', err));
