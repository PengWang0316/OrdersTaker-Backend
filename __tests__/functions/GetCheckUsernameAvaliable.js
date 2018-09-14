import checkUsernameAvaliable from '../../src/routers/functions/GetCheckUsernameAvailable';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ isUserNameAvailable: jest.fn().mockReturnValue(Promise.resolve(true)) }));

describe('CheckUsernameAvaliable', () => {
  test('run without error', async () => {
    const mongodb = require('../../src/MongoDB');
    const mockEndFn = jest.fn();
    const mockJsonFn = jest.fn();
    const res = { end: mockEndFn, json: mockJsonFn };
    const req = { query: { username: 'username' } };
    await checkUsernameAvaliable(req, res);
    expect(mongodb.isUserNameAvailable).toHaveBeenCalledTimes(1);
    expect(mongodb.isUserNameAvailable).toHaveBeenLastCalledWith('username');
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith(true);
    expect(mockEndFn).not.toHaveBeenCalled();

    mongodb.isUserNameAvailable.mockReturnValueOnce(Promise.resolve(false));
    await checkUsernameAvaliable(req, res);
    expect(mockJsonFn).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).toHaveBeenLastCalledWith(false);
  });

  test('run with error', async () => {
    const mongodb = require('../../src/MongoDB');
    mongodb.isUserNameAvailable.mockReturnValueOnce(Promise.reject());
    const logger = require('../../src/utils/Logger'); 
    const mockEndFn = jest.fn();
    const mockJsonFn = jest.fn();
    const res = { end: mockEndFn, json: mockJsonFn };
    const req = { query: { username: 'username' } };
    await checkUsernameAvaliable(req, res);
    expect(mongodb.isUserNameAvailable).toHaveBeenCalledTimes(3);
    expect(mongodb.isUserNameAvailable).toHaveBeenLastCalledWith('username');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
