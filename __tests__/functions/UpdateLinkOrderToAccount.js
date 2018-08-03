import UpdateLinkOrderToAccount from '../../src/routers/functions/UpdateLinkOrderToAccount';

jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId' }) }));
jest.mock('../../src/MongoDB', () => ({ linkOrderToAccount: jest.fn() }));

describe('UpdateLinkOrderToAccount', () => {
  test('linkOrderToAccount', () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    const MongoDB = require('../../src/MongoDB');
    const req = { body: { orderId: 'orderId', jwt: 'jwt' } };
    const res = { end: jest.fn() };
    UpdateLinkOrderToAccount(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(MongoDB.linkOrderToAccount).toHaveBeenCalledTimes(1);
    expect(MongoDB.linkOrderToAccount).toHaveBeenLastCalledWith(req.body.orderId, 'userId');
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
