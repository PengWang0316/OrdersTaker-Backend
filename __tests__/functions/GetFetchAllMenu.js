import getFetchAllMenu from '../../src/routers/functions/GetFetchAllMenu';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
// jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../src/MongoDB', () => ({ fetchAllMenu: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('GetFetchAllMenu', () => {
  test('fetchAllMenu without error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchAllMenu } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');

    await getFetchAllMenu(req, res);
    expect(fetchAllMenu).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
    expect(error).not.toHaveBeenCalled();
  });

  test('fetchAllMenu with error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchAllMenu } = require('../../src/MongoDB');
    fetchAllMenu.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchAllMenu(req, res);
    expect(fetchAllMenu).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
