import registerNewUserController from '../../src/controllers/RegisterNewUser';

jest.mock('bcrypt', () => ({ hash: jest.fn().mockReturnValue(Promise.resolve('hashedPassword')) }));
// jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ signJWT: jest.fn().mockReturnValue('signedValue') }));
jest.mock('../../src/models/User', () => ({ registerNewUser: jest.fn().mockReturnValue(Promise.resolve('registerNewUser')) }));

process.env.SALT_ROUNDS = 10;

global.Date = jest.fn();

describe('RegisterNewUser', () => {
  test('register a new user without any error', async () => {
    const mockJsonFn = jest.fn();
    const req = { body: { username: 'username', email: 'email', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const Logger = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');

    const nextPromise = registerNewUserController(req, res); // Save the first promise to allow waiting next promise finish.
    await nextPromise; // Wait until the second promise finish.

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenLastCalledWith('password', 10);
    expect(registerNewUser).toHaveBeenCalledTimes(1);
    expect(registerNewUser).toHaveBeenLastCalledWith({
      username: 'username', password: 'hashedPassword', role: 3, createDate: new Date(), displayName: 'username', email: 'email', facebookId: '', googleId: '', avatar: null
    });
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.signJWT).toHaveBeenLastCalledWith('registerNewUser');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('signedValue');
    expect(Logger.error).not.toHaveBeenCalled();
  });

  test('register a new user with mongodb error', async () => {
    const mockJsonFn = jest.fn();
    const req = { body: { username: 'username', email: 'email', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const Logger = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');
    registerNewUser.mockReturnValueOnce(Promise.reject());

    const nextPromise = registerNewUserController(req, res); // Save the first promise to allow waiting next promise finish.
    await nextPromise; // Wait until the second promise finish.

    expect(bcrypt.hash).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenLastCalledWith('password', 10);
    expect(registerNewUser).toHaveBeenCalledTimes(2);
    expect(registerNewUser).toHaveBeenLastCalledWith({
      username: 'username', password: 'hashedPassword', role: 3, createDate: new Date(), displayName: 'username', email: 'email', facebookId: '', googleId: '', avatar: null
    });
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.signJWT).toHaveBeenLastCalledWith('registerNewUser');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });

  test('register a new user with bcrypt error', async () => {
    const mockJsonFn = jest.fn();
    const req = { body: { username: 'username', email: 'email', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const Logger = require('../../src/utils/Logger');
    const { registerNewUser } = require('../../src/models/User');
    bcrypt.hash.mockReturnValueOnce(Promise.reject());

    const nextPromise = registerNewUserController(req, res); // Save the first promise to allow waiting next promise finish.
    await nextPromise; // Wait until the second promise finish.

    expect(bcrypt.hash).toHaveBeenCalledTimes(3);
    expect(bcrypt.hash).toHaveBeenLastCalledWith('password', 10);
    expect(registerNewUser).toHaveBeenCalledTimes(2);
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(2);
  });
});
