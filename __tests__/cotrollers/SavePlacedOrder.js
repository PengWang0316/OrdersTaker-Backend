import savePlacedOrderController from '../../src/controllers/SavePlacedOrder';
import { SOCKETIO_EVENT_ADD_NEW_ORDER, SOCKETIO } from '../../src/config';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId' }) }));
jest.mock('../../src/models/Order', () => ({ savePlacedOrder: jest.fn().mockReturnValue(Promise.resolve('orderId')) }));

describe('SavePlacedOrder', () => {
  test('No table number or no time', () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { savePlacedOrder } = require('../../src/models/Order');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: {} } };
    const res = { end: mockEndFn };
    savePlacedOrderController(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(savePlacedOrder).not.toHaveBeenCalled();

    // Table number is null
    req.body.order.tableNumber = null;
    savePlacedOrderController(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(2);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(savePlacedOrder).not.toHaveBeenCalled();

    // Items is empty
    req.body.order = { tableNumber: 2, items: {} };
    savePlacedOrderController(req, res);
    expect(mockEndFn).toHaveBeenCalledTimes(3);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(savePlacedOrder).not.toHaveBeenCalled();
  });

  test('savePlaceOrder without jwtMessage', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { savePlacedOrder } = require('../../src/models/Order');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const mockEmitFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } } }, app: { get: jest.fn().mockReturnValue({ emit: mockEmitFn }) } };
    const res = { end: mockEndFn };
    await savePlacedOrderController(req, res);

    expect(JWTUtil.verifyJWT).not.toHaveBeenCalled();
    expect(savePlacedOrder).toHaveBeenCalledTimes(1);
    expect(savePlacedOrder).toHaveBeenCalledWith(req.body.order, null);
    expect(Logger.error).not.toHaveBeenCalled();
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledWith('orderId');
    expect(req.app.get).toHaveBeenCalledTimes(1);
    expect(req.app.get).toHaveBeenLastCalledWith(SOCKETIO);
    expect(mockEmitFn).toHaveBeenCalledTimes(1);
    expect(mockEmitFn).toHaveBeenLastCalledWith(SOCKETIO_EVENT_ADD_NEW_ORDER, { ...req.body.order, _id: 'orderId' });
  });

  test('savePlaceOrder with jwtMessage', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { savePlacedOrder } = require('../../src/models/Order');

    // Table number is undefined
    const mockEndFn = jest.fn();
    const mockEmitFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } }, jwtMessage: 'jwtMessage' }, app: { get: jest.fn().mockReturnValue({ emit: mockEmitFn }) } };
    const res = { end: mockEndFn };
    await savePlacedOrderController(req, res);

    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(savePlacedOrder).toHaveBeenCalledTimes(2);
    expect(savePlacedOrder).toHaveBeenCalledWith(req.body.order, 'userId');
    expect(Logger.error).not.toHaveBeenCalled();
    expect(mockEndFn).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledWith('orderId');
    expect(req.app.get).toHaveBeenCalledTimes(1);
    expect(req.app.get).toHaveBeenLastCalledWith(SOCKETIO);
    expect(mockEmitFn).toHaveBeenCalledTimes(1);
    expect(mockEmitFn).toHaveBeenLastCalledWith(SOCKETIO_EVENT_ADD_NEW_ORDER, { ...req.body.order, _id: 'orderId' });
  });

  test('savePlaceOrder with database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { savePlacedOrder } = require('../../src/models/Order');
    savePlacedOrder.mockReturnValueOnce(Promise.reject());

    // Table number is undefined
    const mockEndFn = jest.fn();
    const req = { body: { order: { tableNumber: 2, items: { id: 1 } }, jwtMessage: 'jwtMessage' } };
    const res = { end: mockEndFn };
    await savePlacedOrderController(req, res);

    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(2);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith('jwtMessage', res);
    expect(savePlacedOrder).toHaveBeenCalledTimes(3);
    expect(savePlacedOrder).toHaveBeenCalledWith(req.body.order, 'userId');
    expect(Logger.error).toHaveBeenCalledTimes(1);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });
});
