import fetchUnfinishedOrdersController from '../../src/controllers/FetchUnfinishedOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id', role: 3 }) }));
jest.mock('../../src/models/Order', () => ({ fetchUnfinishedOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

process.env = { ADVANCE_ROLE: '2' };

describe('FetchUnfinishedOrders', () => {
  test('role greater than advance role', () => {
    const req = { query: { jwt: 'jwt' } };
    const res = { end: jest.fn() };
    fetchUnfinishedOrdersController(req, res);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test('role less than advance role and with out error', async () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT.mockReturnValueOnce({ role: 2 });
    const Logger = require('../../src/utils/Logger');
    const { fetchUnfinishedOrders } = require('../../src/models/Order');
    const req = { query: { jwt: 'jwt' } };
    const res = { json: jest.fn() };
    await fetchUnfinishedOrdersController(req, res);
    expect(fetchUnfinishedOrders).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('role less than advance role and with error', async () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT.mockReturnValueOnce({ role: 2 });
    const Logger = require('../../src/utils/Logger');
    const { fetchUnfinishedOrders } = require('../../src/models/Order');
    fetchUnfinishedOrders.mockReturnValue(Promise.reject());
    const req = { query: { jwt: 'jwt' } };
    const res = { json: jest.fn() };
    await fetchUnfinishedOrdersController(req, res);
    expect(fetchUnfinishedOrders).toHaveBeenCalledTimes(2);
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
