import finishedItemsController from '../../src/controllers/FinishedItems';
import { SOCKETIO_EVENT_UPDATE_ORDER_ITEM, SOCKETIO } from '../../src/config';

jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId', role: 3 }) }));
jest.mock('../../src/models/Order', () => ({ updateFinishedItems: jest.fn().mockReturnValue(Promise.resolve()) }));
jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));

describe('FinishedItems', () => {
  test('updateFinishedItems with incorrect role', () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { updateFinishedItems } = require('../../src/models/Order');
    const req = {
      body: {
        orderId: 'orderId', itemId: 'itemId', isItemFinished: true, jwt: 'jwt', isOrderFinished: false,
      },
      app: {
        get: jest.fn(),
      },
    };
    const res = { end: jest.fn() };

    expect(() => finishedItemsController(req, res)).toThrow();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(updateFinishedItems).not.toHaveBeenCalled();
    expect(req.app.get).not.toHaveBeenCalled();
  });

  test('updateFinishedItems with correct role and no error', async () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT = jest.fn().mockReturnValue({ _id: 'userId', role: 2 });
    const { updateFinishedItems } = require('../../src/models/Order');
    const mockEmitFn = jest.fn();
    const req = {
      body: {
        orderId: 'orderId', itemId: 'itemId', isItemFinished: true, jwt: 'jwt', isOrderFinished: false,
      },
      app: {
        get: jest.fn().mockReturnValue({ emit: mockEmitFn }),
      },
    };
    const res = { end: jest.fn() };

    await finishedItemsController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(updateFinishedItems).toHaveBeenCalledTimes(1);
    expect(updateFinishedItems)
      .toHaveBeenLastCalledWith(req.body.orderId, req.body.itemId, req.body.isItemFinished, req.body.isOrderFinished);
    expect(req.app.get).toHaveBeenCalledTimes(1);
    expect(req.app.get).toHaveBeenLastCalledWith(SOCKETIO);
    expect(mockEmitFn).toHaveBeenCalledTimes(1);
    expect(mockEmitFn).toHaveBeenLastCalledWith(SOCKETIO_EVENT_UPDATE_ORDER_ITEM, {
      orderId: req.body.orderId, itemId: req.body.itemId, isItemFinished: req.body.isItemFinished,
    });
  });

  test('updateFinishedItems with correct role and database error', async () => {
    const Logger = require('../../src/utils/Logger');
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT = jest.fn().mockReturnValue({ _id: 'userId', role: 2 });
    const { updateFinishedItems } = require('../../src/models/Order');
    updateFinishedItems.mockReturnValueOnce(Promise.reject());
    const mockEmitFn = jest.fn();
    const req = {
      body: {
        orderId: 'orderId', itemId: 'itemId', isItemFinished: true, jwt: 'jwt', isOrderFinished: false,
      },
      app: {
        get: jest.fn().mockReturnValue({ emit: mockEmitFn }),
      },
    };
    const res = { end: jest.fn() };

    await finishedItemsController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(updateFinishedItems).toHaveBeenCalledTimes(2);
    expect(updateFinishedItems)
      .toHaveBeenLastCalledWith(req.body.orderId, req.body.itemId, req.body.isItemFinished, req.body.isOrderFinished);
    expect(req.app.get).not.toHaveBeenCalled();
    expect(mockEmitFn).not.toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledTimes(1);
  });
});
