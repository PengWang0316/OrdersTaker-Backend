import linkOrderToAccountController from '../../src/controllers/LinkOrderToAccount';

jest.mock('../../src/utils/JWTUtil', () => ({ verifyJWT: jest.fn().mockReturnValue({ _id: 'userId' }) }));
jest.mock('../../src/models/Order', () => ({ linkOrderToAccount: jest.fn() }));

describe('LinkOrderToAccount', () => {
  test('linkOrderToAccount', () => {
    const JWTUtil = require('../../src/utils/JWTUtil');
    const { linkOrderToAccount } = require('../../src/models/Order');
    const req = { body: { orderId: 'orderId', jwt: 'jwt' } };
    const res = { end: jest.fn() };
    linkOrderToAccountController(req, res);
    expect(JWTUtil.verifyJWT).toHaveBeenCalledTimes(1);
    expect(JWTUtil.verifyJWT).toHaveBeenLastCalledWith(req.body.jwt, res);
    expect(linkOrderToAccount).toHaveBeenCalledTimes(1);
    expect(linkOrderToAccount).toHaveBeenLastCalledWith(req.body.orderId, 'userId');
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
