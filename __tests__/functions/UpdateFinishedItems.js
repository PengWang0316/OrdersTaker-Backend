import updateFinishedItems from '../../src/routers/functions/UpdateFinishedItems';
import { SUPER_USER_ROLE } from '../../src/config';

jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId', role: 3 }) }));
jest.mock('../../src/MongoDB', () => ({ updateFinishedItems: jest.fn() }));

describe('UpdateFinishedItems', () => {
  test('updateFinishedItems with incorrect role', () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');
    const req = {
      body: {
        orderId: 'orderId', itemId: 'itemId', isFinished: true, jwt: 'jwt'
      }
    };
    const res = { end: jest.fn() };

    expect(() => updateFinishedItems(req, res)).toThrow();
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(MongoDB.updateFinishedItems).not.toHaveBeenCalled();
  });

  test('updateFinishedItems with correct role', () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    JWTUtil.verifyJWT = jest.fn().mockReturnValue({ _id: 'userId', role: 2 });
    const MongoDB = require('../../src/MongoDB');
    const req = {
      body: {
        orderId: 'orderId', itemId: 'itemId', isFinished: true, jwt: 'jwt'
      }
    };
    const res = { end: jest.fn() };

    updateFinishedItems(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(MongoDB.updateFinishedItems).toHaveBeenCalledTimes(1);
    expect(MongoDB.updateFinishedItems).toHaveBeenLastCalledWith(req.body.orderId, req.body.itemId, req.body.isFinished);
  });
});
