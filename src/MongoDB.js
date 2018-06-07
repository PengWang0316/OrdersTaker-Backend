const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const winston = require('winston');

require('dotenv').config();
// Loading .env to process.env
const DB_URL = process.env.DB_HOST;
const COLLECTION_USER = 'users';
const COLLECTION_BASIC_INFORMATION = 'BasicInformation';

const DB_NAME = process.env.DB_NAME;

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = new winston.Logger({
  level: process.env.LOGGING_LEVEL,
  transports: [
    new (winston.transports.Console)()
  ]
});

/** Replaces the previous transports with those in the
new configuration wholesale.
  * When under the production mode, log to a file.
*/
if (process.env.NODE_ENV === 'production')
  logger.configure({
    level: 'error',
    transports: [
      new (winston.transports.File)({ filename: 'error.log' })
    ]
  });

/*
* Use to execute the database
* Other function can call it to get the connection.
* Pass a function that contains the executed code.
*/
const connectToDb = executeFunction => {
  MongoClient.connect(DB_URL, (err, client) => {
    if (err)
      logger.error('Unable to connect to the mongoDB server. Error:', err);
    else
      // console.log("Connection of MongonDB was established.");
      // Run given mehtod
      executeFunction(client.db(DB_NAME));

    client.close();
  });
};

/* Using Promise to wrap connection and toArray */
const promiseFindResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).toArray((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

const promiseNextResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).next((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

const promiseInsertResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    callback(db).then(result => {
      resolve();
    });
  });
});

const promiseReturnResult = callback => new Promise((resolve, reject) => {
  connectToDb(db => {
    resolve(callback(db));
  });
});


/* Start Database functions */

exports.fetchBasicInformation = () => promiseNextResult(db =>
  db.collection(COLLECTION_BASIC_INFORMATION).find({}));


/* Old functions that come from the previous project */

exports.findUserWithUsername = username =>
  promiseFindResult(db => db.collection(COLLECTION_USER)
    .find({ username }, {
      email: 0, facebookId: 0, googleId: 0
    }));

exports.registerNewUser = user => new Promise((resolve, reject) => {
  connectToDb(db => db.collection(COLLECTION_USER)
    .insertOne(user, (err, response) => resolve(response.ops[0])));
});

exports.fetchOrCreateUser = user => promiseReturnResult(db => {
  const userFilter = user.facebookId !== '' ? { facebookId: user.facebookId } : { googleId: user.googleId };
  return db.collection(COLLECTION_USER).findOneAndUpdate(
    userFilter,
    { $set: user },
    { upsert: true, returnOriginal: false, projection: { _id: 1, role: 1 } }
  );
});

/* Login get user information */
exports.getUser = (username, password, callback) => {
  connectToDb((db) => {
    db.collection(COLLECTION_USER).find({ username, password }).toArray((err, result) => {
      // console.log(result);
      if (err) logger.error('Something goes worry: ', err);
      else callback(result);
    });
  });
};

/* checking whether user name is still available */
exports.isUserNameAvailable = query => new Promise((resolve, reject) =>
  connectToDb(db =>
    db.collection(COLLECTION_USER)
      .find({ username: query.userName }).next((err, result) => resolve(!result))));

exports.createNewUser = (user, callback) => {
  const insertUser = Object.assign({ role: 3 }, user); // set user a Emerald role
  connectToDb((db) => {
    db.collection(COLLECTION_USER)
      .insert(insertUser, (err, result) => { callback(result.ops[0]); });
  });
};
