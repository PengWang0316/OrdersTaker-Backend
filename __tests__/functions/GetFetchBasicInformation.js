import getFetchBasicInformation from '../../src/routers/functions/GetFetchBasicInformation';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
// jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../src/MongoDB', () => ({ fetchBasicInformation: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('GetFetchBasicInformation', () => {
  test('fetchBasicInformation without error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchBasicInformation } = require('../../src/MongoDB');
    const { error } = require('../../src/utils/Logger');

    await getFetchBasicInformation(req, res);
    expect(fetchBasicInformation).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
    expect(error).not.toHaveBeenCalled();
  });

  test('fetchBasicInformation with error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchBasicInformation } = require('../../src/MongoDB');
    fetchBasicInformation.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchBasicInformation(req, res);
    expect(fetchBasicInformation).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
