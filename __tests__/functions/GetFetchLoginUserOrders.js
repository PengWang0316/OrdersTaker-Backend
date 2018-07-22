import getFetchLoginUserOrders from '../../src/routers/functions/GetFetchLoginUserOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/MongoDB', () => ({ fetchLoginUserOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

describe('GetFetchLoginUserOrders', () => {
  test('getFetchLoginUserOrders without error', async () => {
    const MongoDB = require('../../src/MongoDB');
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessage', offset: 10, amount: 20 } };
    const res = { json: jest.fn() };
    await getFetchLoginUserOrders(req, res);
    expect(MongoDB.fetchLoginUserOrders).toHaveBeenCalledTimes(1);
    expect(MongoDB.fetchLoginUserOrders).toHaveBeenLastCalledWith(10, 20, 'id');
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage');
  });

  test('getFetchLoginUserOrders with database error', async () => {
    const MongoDB = require('../../src/MongoDB');
    MongoDB.fetchLoginUserOrders.mockReturnValueOnce(Promise.reject());
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessageA', offset: 20, amount: 30 } };
    const res = { json: jest.fn() };
    await getFetchLoginUserOrders(req, res);
    expect(MongoDB.fetchLoginUserOrders).toHaveBeenCalledTimes(2);
    expect(MongoDB.fetchLoginUserOrders).toHaveBeenLastCalledWith(20, 30, 'id');
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessageA');
  });
});
