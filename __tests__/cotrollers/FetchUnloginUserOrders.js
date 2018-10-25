import fetchUnloginUserOrdersController from '../../src/controllers/FetchUnloginUserOrders';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/Order', () => ({ fetchUnloginUserOrders: jest.fn().mockReturnValue(Promise.resolve([{ id: 1 }, { id: 2 }])) }));

describe('FetchUnloginUserOrders', () => {
  test('FetchUnloginUserOrders without error', async () => {
    const Logger = require('../../src/utils/Logger');
    const { fetchUnloginUserOrders } = require('../../src/models/Order');
    const req = { query: { offset: 1, amount: 3, orderIds: [0, 1, 2, 3, 4, 5, 6] } };
    const res = { json: jest.fn() };
    await fetchUnloginUserOrdersController(req, res);
    expect(fetchUnloginUserOrders).toHaveBeenCalledTimes(1);
    expect(fetchUnloginUserOrders).toHaveBeenLastCalledWith([1, 2, 3]);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith([{ id: 1 }, { id: 2 }]);
    expect(Logger.error).not.toHaveBeenCalled();
  });

  test('FetchUnloginUserOrders with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const { fetchUnloginUserOrders } = require('../../src/models/Order');
    fetchUnloginUserOrders.mockReturnValueOnce(Promise.reject());
    const req = { query: { offset: 2, amount: 4, orderIds: [0, 1, 2, 3, 4, 5, 6] } };
    const res = { json: jest.fn() };
    await fetchUnloginUserOrdersController(req, res);
    expect(fetchUnloginUserOrders).toHaveBeenCalledTimes(2);
    expect(fetchUnloginUserOrders).toHaveBeenLastCalledWith([2, 3, 4, 5]);
    expect(res.json).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
