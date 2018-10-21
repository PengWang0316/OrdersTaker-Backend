import loginWithPasswordController from '../../src/controllers/LoginWithPassword';

jest.mock('bcrypt', () => ({ compare: jest.fn().mockReturnValue(Promise.resolve(true)) }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ signJWT: jest.fn().mockReturnValue('signedValue') }));
jest.mock('../../src/models/User', () => ({ findUserWithUsername: jest.fn().mockReturnValue(Promise.resolve([])) }));

describe('LoginWithPassword', () => {
  test('loginWithPassword with zero result', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { findUserWithUsername } = require('../../src/models/User');
    await loginWithPasswordController(req, res);
    expect(findUserWithUsername).toHaveBeenCalledTimes(1);
    expect(findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ isFail: true });
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(JWTUtil.signJWT).not.toHaveBeenCalled();
  });

  test('loginWithPassword with result and compare true', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { findUserWithUsername } = require('../../src/models/User');
    const result0 = { password: 'password' };
    findUserWithUsername.mockReturnValueOnce(Promise.resolve([result0]));
    await loginWithPasswordController(req, res);
    expect(findUserWithUsername).toHaveBeenCalledTimes(2);
    expect(findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('signedValue');
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.signJWT).toHaveBeenLastCalledWith(result0);
  });

  test('loginWithPassword with result and compare false', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockReturnValueOnce(Promise.resolve(false));
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { findUserWithUsername } = require('../../src/models/User');
    const result0 = { password: 'password' };
    findUserWithUsername.mockReturnValueOnce(Promise.resolve([result0]));
    await loginWithPasswordController(req, res);
    expect(findUserWithUsername).toHaveBeenCalledTimes(3);
    expect(findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ isFail: true });
    expect(bcrypt.compare).toHaveBeenCalledTimes(2);
    expect(bcrypt.compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
  });

  test('loginWithPassword with error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const logger = require('../../src/utils/Logger');
    const { findUserWithUsername } = require('../../src/models/User');
    findUserWithUsername.mockReturnValueOnce(Promise.reject());
    await loginWithPasswordController(req, res);
    expect(findUserWithUsername).toHaveBeenCalledTimes(4);
    expect(findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
