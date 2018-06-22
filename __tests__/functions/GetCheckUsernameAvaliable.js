import checkUsernameAvaliable from '../../src/routers/functions/GetCheckUsernameAvailable';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/MongoDB', () => ({ findUserWithUsername: jest.fn().mockReturnValue(Promise.resolve([1])) }));

describe('CheckUsernameAvaliable', () => {
  test('run without error', async () => {
    const mongodb = require('../../src/MongoDB');
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { username: 'username' } };
    await checkUsernameAvaliable(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(1);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith('username');
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenLastCalledWith(false);

    mongodb.findUserWithUsername.mockReturnValueOnce(Promise.resolve([]));
    await checkUsernameAvaliable(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(2);
    expect(mockEndFn).toHaveBeenLastCalledWith(true);
  });

  test('run with error', async () => {
    const mongodb = require('../../src/MongoDB');
    mongodb.findUserWithUsername.mockReturnValueOnce(Promise.reject());
    const logger = require('../../src/utils/Logger'); 
    const mockEndFn = jest.fn();
    const res = { end: mockEndFn };
    const req = { query: { username: 'username' } };
    await checkUsernameAvaliable(req, res);
    expect(mongodb.findUserWithUsername).toHaveBeenCalledTimes(3);
    expect(mongodb.findUserWithUsername).toHaveBeenLastCalledWith('username');
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
