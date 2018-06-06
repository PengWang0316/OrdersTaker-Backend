const normalRouter = require('express').Router();
// const winston = require('winston');  Moved out to the utils
const cloudinary = require('cloudinary');

require('dotenv').config(); // Loading .env to process.env

// Functions import
const getJwtMessageVerify = require('./functions/GetJwtMessageVerify');

// cloudinary.config({ // confige the cloudinary library.
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', getJwtMessageVerify);

module.exports = normalRouter;
