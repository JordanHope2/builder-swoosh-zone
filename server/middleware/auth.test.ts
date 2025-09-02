import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from './auth';
import { getSupabase } from '../supabase';
import { Request, Response, NextFunction } from 'express';

// Mock the getSupabase module
vi.mock('../supabase', () => ({
  getSupabase: vi.fn(),
}));

const mockUser = { id: '123', email: 'test@example.com' };

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
};

describe('authMiddleware (Unit)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = vi.fn();
  let statusJsonMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    (getSupabase as vi.Mock).mockReturnValue(mockSupabase);

    // Mock Express request and response objects
    mockRequest = {
      header: vi.fn(),
    };

    // Create a spy that can mock the chainable res.status().json() call
    statusJsonMock = vi.fn(() => {});
    mockResponse = {
      status: vi.fn(() => ({ json: statusJsonMock } as any)),
    };

    nextFunction = vi.fn();
  });

  it('should return 401 if no Authorization header is provided', async () => {
    (mockRequest.header as vi.Mock).mockReturnValue(undefined);
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(statusJsonMock).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    (mockRequest.header as vi.Mock).mockReturnValue('Bearer invalid-token');
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token', status: 401 },
    });

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('invalid-token');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(statusJsonMock).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() and attach user if token is valid', async () => {
    (mockRequest.header as vi.Mock).mockReturnValue('Bearer valid-token');
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
