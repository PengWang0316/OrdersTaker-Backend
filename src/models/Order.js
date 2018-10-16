const { ObjectID } = require('mongodb');
const { promiseFindResult } = require('../MongoDBHelper');

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
