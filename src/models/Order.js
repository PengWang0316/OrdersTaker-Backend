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

/**
 * Fetching all unfinished orders
 * @return {array} Return an array with all unfinished orders.
 */
exports.fetchUnfinishedOrders = () => promiseFindResult(db => db.collection(COLLECTION_ORDERS)
  .find({ $or: [{ isFinished: { $exists: false } }, { isFinished: false }] }));

/**
 * Fetching and returning a order array based on the giving order ids.
 * @param {array} orderIds is an array that contains all orders' ids
 * @return {Promise} Return a promise.
 */
exports.fetchUnloginUserOrders = orderIds => {
  const objectIds = orderIds.map(id => new ObjectID(id)); // Trunning the string array to an ObjectId array.
  return promiseFindResult(db => db.collection(COLLECTION_ORDERS)
    .find({ _id: { $in: objectIds } }, { sort: { dateStamp: -1 } }));
};

/**
 * Saving a placed order and return a promise with the result.
 * @param {object} order is the information will be saved to the database.
 * @param {string} userId is the user's id.
 * @return {Promise} Return a promise with the result's id.
 */
exports.savePlacedOrder = (order, userId) => new Promise((resolve, reject) => getDB()
  .collection(COLLECTION_ORDERS).insertOne({
    ...order, userId: userId ? new ObjectID(userId) : null, dateStamp: new Date(), status: 'Received',
  }, (err, result) => {
    if (err) reject(err);
    resolve(result.ops[0]._id.toString());
  }));

/**
 * Updating the finished items list for the order
 * @param {string} orderId is the id for the order that will be updated.
 * @param {string} itemId is the id for the item that will be updated in the order.
 * @param {bool} isItemFinished is the indicator that shows whether the item is finished.
 * @param {bool} isOrderFinished is the indicator that shows whether the order is finished.
 * @return {null} No return.
 */
exports.updateFinishedItems = (
  orderId, itemId, isItemFinished, isOrderFinished,
) => new Promise((resolve, reject) => {
  const finishedItem = `finishedItems.${itemId}`;
  return getDB().collection(COLLECTION_ORDERS)
    .updateOne(
      { _id: new ObjectID(orderId) },
      isItemFinished ? { $set: { [finishedItem]: true, isFinished: isOrderFinished } } : { $unset: { [finishedItem]: '' }, $set: { isFinished: isOrderFinished } },
    ).then((result, err) => {
      if (err) reject(err);
      resolve();
    });
});
