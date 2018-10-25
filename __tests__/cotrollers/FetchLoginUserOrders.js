import fetchLoginUserOrdersController from '../../src/controllers/FetchLoginUserOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/models/Order', () => ({ fetchLoginUserOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

describe('FetchLoginUserOrders', () => {
  test('FetchLoginUserOrders without error', async () => {
    const { fetchLoginUserOrders } = require('../../src/models/Order');
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessage', offset: 10, amount: 20 } };
    const res = { json: jest.fn() };
    await fetchLoginUserOrdersController(req, res);
    expect(fetchLoginUserOrders).toHaveBeenCalledTimes(1);
    expect(fetchLoginUserOrders).toHaveBeenLastCalledWith(10, 20, 'id');
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
  });

  test('FetchLoginUserOrders with database error', async () => {
    const { fetchLoginUserOrders } = require('../../src/models/Order');
    fetchLoginUserOrders.mockReturnValueOnce(Promise.reject());
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessageA', offset: 20, amount: 30 } };
    const res = { json: jest.fn() };
    await fetchLoginUserOrdersController(req, res);
    expect(fetchLoginUserOrders).toHaveBeenCalledTimes(2);
    expect(fetchLoginUserOrders).toHaveBeenLastCalledWith(20, 30, 'id');
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessageA', res);
  });
});
