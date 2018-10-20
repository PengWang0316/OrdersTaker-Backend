import jwtMessageVerifyController from '../../src/controllers/JwtMessageVerify';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/models/User', () => ({ fetchOneUser: jest.fn().mockReturnValue(new Promise((resolve, reject) => resolve({ a: 1, b: 2, password: 'password' }))) }));

describe('JwtMessageVerify', () => {
  test('JwtMessageVerify without error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOneUser } = require('../../src/models/User');
    await jwtMessageVerifyController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(fetchOneUser).toHaveBeenCalledTimes(1);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenLastCalledWith({
      a: 1, b: 2, role: 3, jwt: 'jwtMessage',
    });
  });

  test('JwtMessageVerify without error has role', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOneUser } = require('../../src/models/User');
    fetchOneUser.mockReturnValue(Promise.resolve({
      a: 1, b: 2, password: 'password', role: 1,
    }));
    await jwtMessageVerifyController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(fetchOneUser).toHaveBeenCalledTimes(2);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenLastCalledWith({
      a: 1, b: 2, role: 1, jwt: 'jwtMessage',
    });
  });

  test('JwtMessageVerify with error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const { error } = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOneUser } = require('../../src/models/User');
    fetchOneUser.mockReturnValue(new Promise((resolve, reject) => reject()));
    await jwtMessageVerifyController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(fetchOneUser).toHaveBeenCalledTimes(3);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
