const normalRouter = require('express').Router();
// const cloudinary = require('cloudinary');

require('dotenv').config(); // Loading .env to process.env

// Controllers import
const jwtMessageVerify = require('../controllers/JwtMessageVerify');
const fetchBasicInformation = require('../controllers/FetchBasicInformation');
const fetchAllMenu = require('../controllers/FetchAllMenu');
const fetchOrderAmount = require('../controllers/FetchOrderAmount');
const fetchLoginUserOrders = require('../controllers/FetchLoginUserOrders');
const fetchUnloginUserOrders = require('../controllers/FetchUnloginUserOrders');
const fetchUnfinishedOrders = require('../controllers/FetchUnfinishedOrders');

const savePlacedOrder = require('../controllers/SavePlacedOrder');

const linkOrderToAccount = require('../controllers/LinkOrderToAccount');
const finishedItems = require('../controllers/FinishedItems');

// cloudinary.config({ // confige the cloudinary library.
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', jwtMessageVerify);

/* Fetching the basic information */
normalRouter.get('/fetchBasicInformation', fetchBasicInformation);

/* Fetching all menu information */
normalRouter.get('/fetchAllMenu', fetchAllMenu);

/* Fetching total orders' amount */
normalRouter.get('/fetchOrderAmount', fetchOrderAmount);

/* Fetching orders for a login user */
normalRouter.get('/fetchOrders', fetchLoginUserOrders);

/* Fetching orders for a login user */
normalRouter.get('/fetchUnloginOrders', fetchUnloginUserOrders);

/* Fetching unfinished orders */
normalRouter.get('/fetchUnfinishedOrders', fetchUnfinishedOrders);

/* Saving the placed order */
normalRouter.post('/savePlacedOrder', savePlacedOrder);

/* Linking a unlogin order to a user account */
normalRouter.put('/linkOrderToAccount', linkOrderToAccount);

/* Update the finished itmes list for the order */
normalRouter.put('/updateFinishedItems', finishedItems);

module.exports = normalRouter;
