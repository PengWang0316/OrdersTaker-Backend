const jwt = require('jsonwebtoken');
require('dotenv').config(); // Loading .env to process.env

/** Verify and return user object from jwt message
 * @param { object } object includes jwt message and response
 * @return { object } return the user object that was verified by jsonwebtoken
 */
const verifyJWT = ({ message, res }) => {
  try {
    res.status(200);
    return jwt.verify(message, process.env.JWT_SECERT);
  } catch (e) {
    res.status(200);
    res.end();
    return null;
  }
};

/** This function return a non-password user object with a jwt property.
 * @param {object} user contains all information that retrieved from the database.
 * @return {object} Return an user object that includes a user objcet without password and a JWT.
*/
const signJWT = user => {
  const signInfo = { _id: user._id, role: user.role };
  const returnUser = { // Do not need return all user's information.
    ...signInfo,
    username: user.username,
    displayName: user.username,
    avatar: user.avatar,
    jwt: jwt.sign(signInfo, process.env.JWT_SECERT)
  };
  delete returnUser.password; // delete user.password;
  return returnUser;
};

module.exports = {
  verifyJWT,
  signJWT
};
