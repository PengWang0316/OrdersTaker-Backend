import fetchAllMenuController from '../../src/controllers/FetchAllMenu';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/Menu', () => ({ fetchAllMenu: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('FetchAllMenu', () => {
  test('fetchAllMenu without error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchAllMenu } = require('../../src/models/Menu');
    const { error } = require('../../src/utils/Logger');

    await fetchAllMenuController(req, res);
    expect(fetchAllMenu).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
    expect(error).not.toHaveBeenCalled();
  });

  test('fetchAllMenu with error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchAllMenu } = require('../../src/models/Menu');
    fetchAllMenu.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchAllMenuController(req, res);
    expect(fetchAllMenu).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
