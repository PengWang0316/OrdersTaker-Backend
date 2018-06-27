import getLoginWithPassword from '../../src/routers/functions/GetLoginWithPassword';

jest.mock('bcrypt', () => ({ compare: jest.fn().mockReturnValue(Promise.resolve(true)) }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ signJWT: jest.fn().mockReturnValue('signedValue') }));
jest.mock('../../src/MongoDB', () => ({ findUserWithUsername: jest.fn().mockReturnValue(Promise.resolve([])) }));

describe('GetLoginWithPassword', () => {
  test('getLoginWithPassword with zero result', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const mongodb = require('../../src/MongoDB');
    await getLoginWithPassword(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(1);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith(null);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(JWTUtil.signJWT).not.toHaveBeenCalled();
  });

  test('getLoginWithPassword with result and compare true', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const mongodb = require('../../src/MongoDB');
    const result0 = { password: 'password' };
    mongodb.findUserWithUsername.mockReturnValueOnce(Promise.resolve([result0]));
    await getLoginWithPassword(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(2);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('signedValue');
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.signJWT).toHaveBeenLastCalledWith(result0);
  });

  test('getLoginWithPassword with result and compare false', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockReturnValueOnce(Promise.resolve(false));
    const JWTUtil = require('../../src/utils/JWTUtil');
    const mongodb = require('../../src/MongoDB');
    const result0 = { password: 'password' };
    mongodb.findUserWithUsername.mockReturnValueOnce(Promise.resolve([result0]));
    await getLoginWithPassword(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(3);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith(null);
    expect(bcrypt.compare).toHaveBeenCalledTimes(2);
    expect(bcrypt.compare).toHaveBeenLastCalledWith(req.query.password, 'password');
    expect(JWTUtil.signJWT).toHaveBeenCalledTimes(1);
  });

  test('getLoginWithPassword with error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { username: 'username', password: 'password' } };
    const res = { json: mockJsonFn };
    const logger = require('../../src/utils/Logger');
    const mongodb = require('../../src/MongoDB');
    mongodb.findUserWithUsername.mockReturnValueOnce(Promise.reject());
    await getLoginWithPassword(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(4);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith(req.query.username);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
