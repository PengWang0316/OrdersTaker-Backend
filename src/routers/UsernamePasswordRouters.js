const usernamePasswordRouters = require('express').Router();

const postRegisterNewUser = require('./functions/PostRegisterNewUser');
const checkUsernameAvailable = require('../controllers/CheckUsernameAvailable');
const getLoginWithPassword = require('./functions/GetLoginWithPassword');

usernamePasswordRouters.get('/loginWithPassword', getLoginWithPassword);

usernamePasswordRouters.get('/checkUsernameAvailable', checkUsernameAvailable);

usernamePasswordRouters.post('/registerUser', postRegisterNewUser);

module.exports = usernamePasswordRouters;
