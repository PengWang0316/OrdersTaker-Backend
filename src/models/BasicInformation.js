const { promiseNextResult } = require('../MongoDBHelper');

const COLLECTION_BASIC_INFORMATION = 'BasicInformation';

exports.fetchBasicInformation = () => promiseNextResult(db => db
  .collection(COLLECTION_BASIC_INFORMATION).find({}));
