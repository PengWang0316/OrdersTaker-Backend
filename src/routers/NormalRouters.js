const normalRouter = require('express').Router();
const cloudinary = require('cloudinary');

require('dotenv').config(); // Loading .env to process.env

// Functions import
const getJwtMessageVerify = require('./functions/GetJwtMessageVerify');
const getFetchBasicInformation = require('./functions/GetFetchBasicInformation');
const getFetchAllMenu = require('./functions/GetFetchAllMenu');
const getFetchOrderAmount = require('./functions/GetFetchOrderAmount');
const getFetchLoginUserOrders = require('./functions/GetFetchLoginUserOrders');
const getFetchUnloginUserOrders = require('./functions/GetFetchUnloginUserOrders');
const getFetchUnfinishedOrders = require('./functions/GetFetchUnfinishedOrders');

const postSavePlacedOrder = require('./functions/PostSavePlacedOrder');

const updateLinkOrderToAccount = require('./functions/UpdateLinkOrderToAccount');
const updateFinishedItems = require('./functions/UpdateFinishedItems');

// cloudinary.config({ // confige the cloudinary library.
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', getJwtMessageVerify);

/* Fetching the basic information */
normalRouter.get('/fetchBasicInformation', getFetchBasicInformation);

/* Fetching all menu information */
normalRouter.get('/fetchAllMenu', getFetchAllMenu);

/* Fetching total orders' amount */
normalRouter.get('/fetchOrderAmount', getFetchOrderAmount);

/* Fetching orders for a login user */
normalRouter.get('/fetchOrders', getFetchLoginUserOrders);

/* Fetching orders for a login user */
normalRouter.get('/fetchUnloginOrders', getFetchUnloginUserOrders);

/* Fetching unfinished orders */
normalRouter.get('/fetchUnfinishedOrders', getFetchUnfinishedOrders);

/* Saving the placed order */
normalRouter.post('/savePlacedOrder', postSavePlacedOrder);

/* Linking a unlogin order to a user account */
normalRouter.put('/linkOrderToAccount', updateLinkOrderToAccount);

/* Update the finished itmes list for the order */
normalRouter.put('/updateFinishedItems', updateFinishedItems);

module.exports = normalRouter;
