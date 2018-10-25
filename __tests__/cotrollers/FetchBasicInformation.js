import fetchBasicInformationController from '../../src/controllers/FetchBasicInformation';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/models/BasicInformation', () => ({ fetchBasicInformation: jest.fn().mockReturnValue(Promise.resolve('result')) }));

describe('FetchBasicInformation', () => {
  test('fetchBasicInformation without error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchBasicInformation } = require('../../src/models/BasicInformation');
    const { error } = require('../../src/utils/Logger');

    await fetchBasicInformationController(req, res);
    expect(fetchBasicInformation).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith('result');
    expect(error).not.toHaveBeenCalled();
  });

  test('fetchBasicInformation with error', async () => {
    const mockJsonFn = jest.fn();
    const req = {};
    const res = { json: mockJsonFn };

    const { fetchBasicInformation } = require('../../src/models/BasicInformation');
    fetchBasicInformation.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchBasicInformationController(req, res);
    expect(fetchBasicInformation).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
