import getFetchOrderAmount from '../../src/routers/functions/GetFetchOrderAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/MongoDB', () => ({ fetchOrderAmount: jest.fn().mockReturnValue(Promise.resolve(10)) }));

describe('GetFetchOrderAmount', () => {
  test('getFetchOrderAmount without error', async () => {
    const Logger = require('../../src/utils/Logger');
    const MongoDB = require('../../src/MongoDB');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { end: jest.fn() };
    await getFetchOrderAmount(req, res);
    expect(MongoDB.fetchOrderAmount).toHaveBeenCalledTimes(1);
    expect(MongoDB.fetchOrderAmount).toHaveBeenLastCalledWith('id');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage');
  });

  test('getFetchOrderAmount with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');
    MongoDB.fetchOrderAmount.mockReturnValueOnce(Promise.reject());
    const req = { query: { jwtMessage: 'jwtMessageA' } };
    const res = { end: jest.fn() };
    await getFetchOrderAmount(req, res);
    expect(res.end).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessageA');
  });
});
