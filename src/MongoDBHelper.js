const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const winston = require('winston');

require('dotenv').config();
// Loading .env to process.env
const DB_URL = process.env.DB_HOST;
// const COLLECTION_USER = 'users';
// const COLLECTION_BASIC_INFORMATION = 'BasicInformation';
// const COLLECTION_MENUS = 'Menus';
// const COLLECTION_ORDERS = 'orders';

const DB_NAME = process.env.DB_NAME;
let dbs;

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = winston.createLogger({
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

// Initializing the connection pool.
const ininitalConnects = async () => {
  try {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, poolSize: 10 });
    dbs = client.db(DB_NAME);
  } catch (e) {
    logger.error('Unable to connect to the mongoDB server. Error:', e);
  }
}

ininitalConnects();

exports.getDB = () => dbs;

/* Using Promise to wrap connection and toArray */
exports.promiseFindResult = callback => new Promise((resolve, reject) =>
  callback(dbs).toArray((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

exports.promiseNextResult = callback => new Promise((resolve, reject) =>
  callback(dbs).next((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

exports.promiseInsertResult = callback => new Promise((resolve, reject) =>
  callback(dbs).then(result => {
    resolve();
  }));

const promiseReturnResult = callback => new Promise((resolve, reject) => resolve(callback(dbs)));