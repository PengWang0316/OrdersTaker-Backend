const normalRouter = require('express').Router();
// const winston = require('winston');  Moved out to the utils
const cloudinary = require('cloudinary');

require('dotenv').config(); // Loading .env to process.env

// Functions import
const getJwtMessageVerify = require('./functions/GetJwtMessageVerify');
const getFetchBasicInformation = require('./functions/GetFetchBasicInformation');
const getFetchAllMenu = require('./functions/GetFetchAllMenu');
const getFetchOrderAmount = require('./functions/GetFetchOrderAmount');
const getFetchLoginUserOrders = require('./functions/GetFetchLoginUserOrders');
const getFetchUnloginUserOrders = require('./functions/GetFetchUnloginUserOrders');

const postSavePlacedOrder = require('./functions/PostSavePlacedOrder');

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
normalRouter.get('/fetchLoginUserOrders', getFetchLoginUserOrders);

/* Fetching orders for a login user */
normalRouter.get('/fetchUnloginOrders', getFetchUnloginUserOrders);

/* Saving the placed order */
normalRouter.post('/savePlacedOrder', postSavePlacedOrder);

module.exports = normalRouter;
