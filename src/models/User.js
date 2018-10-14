const { getDB } = require('../MongoDBHelper');

const COLLECTION_USER = 'users';

exports.isUserNameAvailable = username => new Promise((resolve, reject) => getDB()
  .collection(COLLECTION_USER)
  .find({ username }).next((err, result) => {
    if (err) reject(err);
    resolve(!result);
  }));
