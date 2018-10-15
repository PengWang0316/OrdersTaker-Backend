import { promiseFindResult } from '../MongoDBHelper';

const COLLECTION_MENUS = 'Menus';

/* Fetch all menu information */
exports.fetchAllMenu = () => promiseFindResult(db => db
  .collection(COLLECTION_MENUS).find({}, { projection: { 'items.feedbacks': 0 } }).sort({ order: 1 }));
