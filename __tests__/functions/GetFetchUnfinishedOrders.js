import fetchUnfinishedOrders from '../../src/routers/functions/GetFetchUnfinishedOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id', role: 3 }) }));
jest.mock('../../src/MongoDB', () => ({ fetchUnfinishedOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

process.env = { ADVANCE_ROLE: '2' };

describe('FetchUnfinishedOrders', () => {
  test('role greater than advance role', () => {
    const req = { query: { jwt: 'jwt' } };
    const res = { end: jest.fn() };
    fetchUnfinishedOrders(req, res);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  test('role less than advance role and with out error', async () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT.mockReturnValueOnce({ role: 2 });
    const Logger = require('../../src/utils/Logger');
    const MongoDB = require('../../src/MongoDB');
    const req = { query: { jwt: 'jwt' } };
    const res = { json: jest.fn() };
    await fetchUnfinishedOrders(req, res);
    expect(MongoDB.fetchUnfinishedOrders).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('role less than advance role and with error', async () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT.mockReturnValueOnce({ role: 2 });
    const Logger = require('../../src/utils/Logger');
    const MongoDB = require('../../src/MongoDB');
    MongoDB.fetchUnfinishedOrders.mockReturnValue(Promise.reject());
    const req = { query: { jwt: 'jwt' } };
    const res = { json: jest.fn() };
    await fetchUnfinishedOrders(req, res);
    expect(MongoDB.fetchUnfinishedOrders).toHaveBeenCalledTimes(2);
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
