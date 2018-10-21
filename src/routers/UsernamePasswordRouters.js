const usernamePasswordRouters = require('express').Router();

const postRegisterNewUser = require('./functions/PostRegisterNewUser');
const checkUsernameAvailable = require('../controllers/CheckUsernameAvailable');
const loginWithPassword = require('../controllers/LoginWithPassword');

usernamePasswordRouters.get('/loginWithPassword', loginWithPassword);

usernamePasswordRouters.get('/checkUsernameAvailable', checkUsernameAvailable);

usernamePasswordRouters.post('/registerUser', postRegisterNewUser);

module.exports = usernamePasswordRouters;
