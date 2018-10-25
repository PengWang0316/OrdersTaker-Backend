import fetchOrderAmountController from '../../src/controllers/FetchOrderAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/models/Order', () => ({ fetchOrderAmount: jest.fn().mockReturnValue(Promise.resolve(10)) }));

describe('FetchOrderAmount', () => {
  test('FetchOrderAmount without error', async () => {
    const Logger = require('../../src/utils/Logger');
    const { fetchOrderAmount } = require('../../src/models/Order');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { end: jest.fn() };
    await fetchOrderAmountController(req, res);
    expect(fetchOrderAmount).toHaveBeenCalledTimes(1);
    expect(fetchOrderAmount).toHaveBeenLastCalledWith('id');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
  });

  test('FetchOrderAmount with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { fetchOrderAmount } = require('../../src/models/Order');
    fetchOrderAmount.mockReturnValueOnce(Promise.reject());
    const req = { query: { jwtMessage: 'jwtMessageA' } };
    const res = { end: jest.fn() };
    await fetchOrderAmountController(req, res);
    expect(res.end).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessageA', res);
  });
});
