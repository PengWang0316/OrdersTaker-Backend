import getFetchOrderAmount from '../../src/routers/functions/GetFetchOrderAmount';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'id' }) }));
jest.mock('../../src/MongoDB', () => ({ fetchOrderAmount: jest.fn().mockReturnValue(Promise.resolve(10)) }));

describe('GetFetchOrderAmount', () => {
  test('getFetchOrderAmount without error', async () => {
    const Logger = require('../../src/utils/Logger');
    const req = { query: { user: { jwtMessage: 'jwtMessage' } } };
    const res = { end: jest.fn() };
    await getFetchOrderAmount(req, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(Logger.error).not.toHaveBeenCalled();
  });

  test('getFetchOrderAmount with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const MongoDB = require('../../src/MongoDB');
    MongoDB.fetchOrderAmount.mockReturnValueOnce(Promise.reject());
    const req = { query: { user: { jwtMessage: 'jwtMessage' } } };
    const res = { end: jest.fn() };
    await getFetchOrderAmount(req, res);
    expect(res.end).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
