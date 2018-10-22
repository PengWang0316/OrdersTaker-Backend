const { ObjectID } = require('mongodb');

const { getDB, promiseFindResult } = require('../MongoDBHelper');

const COLLECTION_USER = 'users';

exports.isUserNameAvailable = username => new Promise((resolve, reject) => getDB()
  .collection(COLLECTION_USER)
  .find({ username }).next((err, result) => {
    if (err) reject(err);
    resolve(!result);
  }));

/* Fetching one user based on its id */
exports.fetchOneUser = id => new Promise((reslove, reject) => getDB().collection(COLLECTION_USER)
  .findOne({ _id: new ObjectID(id) }, {
    fields: { // Return the password to allow bcrybt checking. It has to be deleted before return a user object to the user's browser.
      _id: 1, username: 1, role: 1, password: 1, displayName: 1, avatar: 1,
    },
  }).then((result, err) => {
    if (err) reject(err);
    reslove(result);
  }));

exports.findUserWithUsername = username => promiseFindResult(db => db.collection(COLLECTION_USER)
  .find({ username }, {
    email: 0, facebookId: 0, googleId: 0,
  }));

exports.registerNewUser = user => new Promise((resolve, reject) => {
  getDB().collection(COLLECTION_USER)
    .insertOne(user, (err, response) => {
      if (err) reject(err);
      resolve(response.ops[0]);
    });
});
