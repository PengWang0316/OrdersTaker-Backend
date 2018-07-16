import PostSavePlacedOrder from '../../src/routers/functions/PostSavePlacedOrder';
import { throws } from 'assert';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId' }) }));
jest.mock('../../src/MongoDB', () => ({ savePlacedOrder: jest.fn().mockReturnValue(Promise.resolve('orderId')) }));

describe('PostSavePlaceOrder', () => {
  test('No table number or no time', () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: {} } };
    const res = { end: mockEndFn };
    PostSavePlacedOrder(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(MongoDB.savePlacedOrder).not.toHaveBeenCalled();

    // Table number is null
    req.body.order.tableNumber = null;
    PostSavePlacedOrder(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(2);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(MongoDB.savePlacedOrder).not.toHaveBeenCalled();

    // Items is empty
    req.body.order = { tableNumber: 2, items: {} };
    PostSavePlacedOrder(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(3);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(MongoDB.savePlacedOrder).not.toHaveBeenCalled();
  });

  test('savePlaceOrder without jwtMessage', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } } } };
    const res = { end: mockEndFn };
    await PostSavePlacedOrder(req, res);

    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledTimes(1);
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledWith(req.body.order, null);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledWith('orderId');
  });

  test('savePlaceOrder with jwtMessage', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } }, jwtMessage: 'jwtMessage' } };
    const res = { end: mockEndFn };
    await PostSavePlacedOrder(req, res);

    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledTimes(2);
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledWith(req.body.order, 'userId');
    expect(Logger.error).not.toHaveBeenCalled();
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledWith('orderId');
  });

  test('savePlaceOrder with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');
    MongoDB.savePlacedOrder.mockReturnValueOnce(Promise.reject());

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } }, jwtMessage: 'jwtMessage' } };
    const res = { end: mockEndFn };
    await PostSavePlacedOrder(req, res);

    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledTimes(3);
    expect(MongoDB.savePlacedOrder).toHaveBeenCalledWith(req.body.order, 'userId');
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });
});
