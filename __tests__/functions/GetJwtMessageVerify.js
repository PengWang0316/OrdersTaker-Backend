import getJwtMessageVerify from '../../src/routers/functions/GetJwtMessageVerify';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/MongoDB', () => ({ fetchOneUser: jest.fn().mockReturnValue(new Promise((resolve, reject) => resolve({ a: 1, b: 2, password: 'password' }))) }));

describe('GetJwtMessageVerify', () => {
  test('JwtMessageVerify without error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOneUser } = require('../../src/MongoDB');
    await getJwtMessageVerify(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(fetchOneUser).toHaveBeenCalledTimes(1);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenLastCalledWith({ a: 1, b: 2, role: 3 });
  });

  test('JwtMessageVerify without error has role', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOneUser } = require('../../src/MongoDB');
    fetchOneUser.mockReturnValue(Promise.resolve({ a: 1, b: 2, password: 'password', role: 1 }));
    await getJwtMessageVerify(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(fetchOneUser).toHaveBeenCalledTimes(2);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenLastCalledWith({ a: 1, b: 2, role: 1 });
  });

  test('JwtMessageVerify with error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const { error } = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const mongoDB = require('../../src/MongoDB');
    mongoDB.fetchOneUser = jest.fn().mockReturnValue(new Promise((resolve, reject) => reject()));
    await getJwtMessageVerify(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(mongoDB.fetchOneUser).toHaveBeenCalledTimes(1);
    expect(mongoDB.fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
