import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from './SignIn';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

// Mock the AuthContext
const mockSignIn = jest.fn();
const mockSignInWithOtp = jest.fn();

const mockAuthContext = {
  user: null,
  signIn: mockSignIn,
  signUp: jest.fn(),
  signOut: jest.fn(),
  signInWithOtp: mockSignInWithOtp,
  loading: false,
  error: null,
};

jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => mockAuthContext,
}));

// Mock useRouter
const mockRouter = {
  push: jest.fn(),
};
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockSignIn.mockClear();
    mockRouter.push.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not call router.push if the component is unmounted', async () => {
    mockSignIn.mockResolvedValueOnce();

    const { unmount } = render(
      <AuthProvider>
        <SignIn />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockSignIn).toHaveBeenCalled());

    // Unmount the component before the timeout completes
    unmount();

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    // Expect that router.push was not called
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
