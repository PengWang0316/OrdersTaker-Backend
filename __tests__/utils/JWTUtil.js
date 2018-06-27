import { verifyJWT, signJWT } from '../../src/utils/JWTUtil';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn().mockReturnValue(true), sign: jest.fn().mockReturnValue('jwt') }));
jest.mock('dotenv', () => ({ config: jest.fn() }));

process.env.JWT_SECERT = 'secert';

describe('JWTUtil', () => {
  test('verifyJWT without error', () => {
    const jwt = require('jsonwebtoken');
    const mockRes = { status: jest.fn() };
    const message = 'message';
    expect(verifyJWT({ message, res: mockRes })).toBe(true);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenLastCalledWith(message, 'secert');
  });

  test('verifyJWT with jwt error', () => {
    const jwt = require('jsonwebtoken');
    jwt.verify.mockImplementation(() => { throw new Error(); });
    const mockRes = { status: jest.fn(), end: jest.fn() };
    const message = 'message';
    expect(verifyJWT({ message, res: mockRes })).toBeNull();
    expect(mockRes.status).toHaveBeenCalledTimes(2);
    expect(mockRes.status).toHaveBeenLastCalledWith(200);
    expect(mockRes.end).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledTimes(2);
    expect(jwt.verify).toHaveBeenLastCalledWith(message, 'secert');
  });

  test('signJWT', () => {
    const jwt = require('jsonwebtoken');
    const user = {
      _id: 'id', role: 'role', password: 'password', other: 'other', username: 'username', avatar: 'avatar'
    };
    const returnUser = signJWT(user);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenLastCalledWith({ _id: 'id', role: 'role' }, 'secert');
    expect(returnUser.password).toBeUndefined();
    expect(returnUser).toEqual({
      _id: 'id', role: 'role', jwt: 'jwt', username: 'username', displayName: 'username', avatar: 'avatar'
    });
  });

  test('signJWT without role', () => {
    const jwt = require('jsonwebtoken');
    const user = {
      _id: 'id', password: 'password', other: 'other', username: 'username', avatar: 'avatar'
    };
    const returnUser = signJWT(user);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenLastCalledWith({ _id: 'id', role: 3 }, 'secert');
    expect(returnUser.password).toBeUndefined();
    expect(returnUser).toEqual({
      _id: 'id', role: 3, jwt: 'jwt', username: 'username', displayName: 'username', avatar: 'avatar'
    });
  });
});
