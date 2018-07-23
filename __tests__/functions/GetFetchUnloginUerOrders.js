import getFetchUnloginUserOrders from '../../src/routers/functions/GetFetchUnloginUserOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ fetchUnloginUserOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

describe('GetFetchUnloginUserOrders', () => {
  test('GetFetchUnloginUserOrders without error', async () => {
    const Logger = require('../../src/utils/Logger');
    const MongDB = require('../../src/MongoDB');
    const req = { query: { offset: 1, amount: 3, orderIds: [0, 1, 2, 3, 4, 5, 6] } };
    const res = { json: jest.fn() };
    await getFetchUnloginUserOrders(req, res);
    expect(MongDB.fetchUnloginUserOrders).toHaveBeenCalledTimes(1);
    expect(MongDB.fetchUnloginUserOrders).toHaveBeenLastCalledWith([1, 2, 3]);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
    expect(Logger.error).not.toHaveBeenCalled();
  });

  test('GetFetchUnloginUserOrders with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const MongDB = require('../../src/MongoDB');
    MongDB.fetchUnloginUserOrders.mockReturnValueOnce(Promise.reject());
    const req = { query: { offset: 2, amount: 4, orderIds: [0, 1, 2, 3, 4, 5, 6] } };
    const res = { json: jest.fn() };
    await getFetchUnloginUserOrders(req, res);
    expect(MongDB.fetchUnloginUserOrders).toHaveBeenCalledTimes(2);
    expect(MongDB.fetchUnloginUserOrders).toHaveBeenLastCalledWith([2, 3, 4, 5]);
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
