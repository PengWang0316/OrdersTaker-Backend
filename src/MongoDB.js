const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const winston = require('winston');

require('dotenv').config();
// Loading .env to process.env
const DB_URL = process.env.DB_HOST;
const COLLECTION_USER = 'users';
const COLLECTION_BASIC_INFORMATION = 'BasicInformation';
const COLLECTION_MENUS = 'Menus';
const COLLECTION_ORDERS = 'orders';

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

/* Fetch basic information */
exports.fetchBasicInformation = () => promiseNextResult(db =>
  db.collection(COLLECTION_BASIC_INFORMATION).find({}));

/* Fetch all menu information */
exports.fetchAllMenu = () => promiseFindResult(db =>
  db.collection(COLLECTION_MENUS).find({}, { projection: { 'items.feedbacks': 0 } }).sort({ order: 1 }));


/* Old functions that come from the previous project */

exports.findUserWithUsername = username =>
  promiseFindResult(db => db.collection(COLLECTION_USER)
    .find({ username }, {
      email: 0, facebookId: 0, googleId: 0
    }));

exports.registerNewUser = user => new Promise((resolve, reject) => {
  connectToDb(db => db.collection(COLLECTION_USER)
    .insertOne(user, (err, response) => {
      if (err) reject(err);
      resolve(response.ops[0]);
    }));
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

/* Fetching one user based on its id */
exports.fetchOneUser = id => new Promise((reslove, reject) =>
  connectToDb(db => db.collection(COLLECTION_USER)
    .findOne({ _id: new mongodb.ObjectId(id) }, {
      fields: { _id: 1, username: 1, role: 1, password: 1, displayName: 1, avatar: 1 } // Return the password to allow bcrybt checking. It has to be deleted before return a user object to the user's browser.
    }).then((result, err) => {
      if (err) reject(err);
      reslove(result);
    })));

/**
 * Saving a placed order and return a promise with the result.
 * @param {object} order is the information will be saved to the database.
 * @param {string} userId is the user's id.
 * @return {Promise} Return a promise with the result's id.
 */
exports.savePlacedOrder = (order, userId) =>
  new Promise((resolve, reject) =>
    connectToDb(db =>
      db.collection(COLLECTION_ORDERS)
        .insert({
          ...order, userId: userId ? new mongodb.ObjectId(userId) : null, dateStamp: new Date(), status: 'Received'
        }, (err, result) => {
          if (err) reject(err);
          resolve(result.ops[0]._id.toString());
        })));

/**
 * Fetching and returning the total amount of orders a user has.
 * @param {string} userId is the id for the user
 * @return {Promise} Return a promise.
 */
exports.fetchOrderAmount = userId => new Promise((resolve, reject) =>
  connectToDb(db => db.collection(COLLECTION_ORDERS).count({ userId: new mongodb.ObjectId(userId) })
    .then((result, err) => {
      if (err) reject(err);
      else resolve(result.toString());
    })));

/**
 * Fetching and returning a order array for the giving user.
 * @param {int} offset is the number should be skipped.
 * @param {int} amount is the number limitation of the return value.
 * @param {string} userId is the user's id
 * @return {Promise} Return a promise.
 */
exports.fetchLoginUserOrders = (offset, amount, userId) =>
  promiseFindResult(db => db.collection(COLLECTION_ORDERS).find({ userId: new mongodb.ObjectID(userId) }, { skip: offset, limit: amount, sort: { dateStamp: -1 } }));

/**
 * Fetching and returning a order array based on the giving order ids.
 * @param {array} orderIds is an array that contains all orders' ids
 * @return {Promise} Return a promise.
 */
exports.fetchUnloginUserOrders = orderIds => {
  const objectIds = orderIds.map(id => new mongodb.ObjectID(id)); // Trunning the string array to an ObjectId array.
  return promiseFindResult(db => db.collection(COLLECTION_ORDERS).find({ _id: { $in: objectIds } }, { sort: { dateStamp: -1 } }));
};

/**
 * Updating a order's userId.
 * @param {string} orderId is the id of the order.
 * @param {string} userId is the id of the user.
 * @return {null} No return.
 */
exports.linkOrderToAccount = (orderId, userId) =>
  connectToDb(db => db.collection(COLLECTION_ORDERS).updateOne({ _id: new mongodb.ObjectID(orderId), userId: null }, { $set: { userId: new mongodb.ObjectId(userId) } }));

/**
 * Fetching all unfinished orders
 * @return {array} Return an array with all unfinished orders.
 */
exports.fetchUnfinishedOrders = () =>
  promiseFindResult(db => db.collection(COLLECTION_ORDERS).find({ isFinished: undefined }));

/**
 * Updating the finished items list for the order
 * @param {string} orderId is the id for the order that will be updated.
 * @param {string} itemId is the id for the item that will be updated in the order.
 * @param {bool} isFinished is the indicator that shows whether the item is finished.
 * @return {null} No return.
 */
exports.updateFinishedItems = (orderId, itemId, isFinished) => {
  const finishedItem = `finishedItems.${itemId}`;
  connectToDb(db => db.collection(COLLECTION_ORDERS)
    .updateOne({ _id: new mongodb.ObjectId(orderId) }, isFinished ? { $set: { [finishedItem]: true } } : { $unset: { [finishedItem]: '' } }));
};
