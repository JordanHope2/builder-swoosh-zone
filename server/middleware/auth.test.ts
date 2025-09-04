import { authMiddleware } from './auth';
import { getSupabase } from '../supabase';
import { Request, Response, NextFunction } from 'express';

// Mock the getSupabase module using Jest
jest.mock('../supabase', () => ({
  getSupabase: jest.fn(),
}));

const mockUser = { id: '123', email: 'test@example.com' };

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
};

describe('authMiddleware (Unit)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let statusJsonMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabase as jest.Mock).mockReturnValue(mockSupabase);

    mockRequest = {
      header: jest.fn(),
    };

    statusJsonMock = jest.fn(() => {});
    mockResponse = {
      status: jest.fn(() => ({ json: statusJsonMock } as any)),
    };

    nextFunction = jest.fn();
  });

  it('should return 401 if no Authorization header is provided', async () => {
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(statusJsonMock).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer invalid-token');
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' }, // Simplified error object
    });

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('invalid-token');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(statusJsonMock).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() and attach user if token is valid', async () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer valid-token');
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
