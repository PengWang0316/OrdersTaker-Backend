const { ObjectID } = require('mongodb');
const { promiseFindResult, getDB } = require('../MongoDBHelper');

const COLLECTION_ORDERS = 'orders';

/**
 * Fetching and returning a order array for the giving user.
 * @param {int} offset is the number should be skipped.
 * @param {int} amount is the number limitation of the return value.
 * @param {string} userId is the user's id
 * @return {Promise} Return a promise.
 */
exports.fetchLoginUserOrders = (offset, amount, userId) => promiseFindResult(db => db
  .collection(COLLECTION_ORDERS).find(
    { userId: new ObjectID(userId) },
    { skip: offset, limit: amount, sort: { dateStamp: -1 } },
  ));

/**
 * Fetching and returning the total amount of orders a user has.
 * @param {string} userId is the id for the user
 * @return {Promise} Return a promise.
 */
exports.fetchOrderAmount = userId => new Promise((resolve, reject) => getDB()
  .collection(COLLECTION_ORDERS).countDocuments({ userId: new ObjectID(userId) })
  .then((result, err) => {
    if (err) reject(err);
    else resolve(result.toString());
  }));
