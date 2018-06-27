const usernamePasswordRouters = require('express').Router();

const postRegisterNewUser = require('./functions/PostRegisterNewUser');
const getCheckUsernameAvailable = require('./functions/GetCheckUsernameAvailable');
const getLoginWithPassword = require('./functions/GetLoginWithPassword');

usernamePasswordRouters.get('/loginWithPassword', getLoginWithPassword);

usernamePasswordRouters.get('/checkUsernameAvailable', getCheckUsernameAvailable);

usernamePasswordRouters.post('/registerUser', postRegisterNewUser);

module.exports = usernamePasswordRouters;
