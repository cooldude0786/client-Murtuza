import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import apiClient from '../../src/api/axios';

// ✅ Mock the API client
vi.mock('../../src/api/axios');

beforeEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});

// ✅ Helper component to test AuthContext interactions
const TestAuthComponent = () => {
  const { login, logout, signup, resend, token, user } = useAuth();

  return (
    <div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('John', 'test@example.com', 'password')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => resend('test@example.com')}>Resend</button>
      <p data-testid="token">{token}</p>
      <p data-testid="user">{user ? 'Logged In' : 'Logged Out'}</p>
    </div>
  );
};

describe('AuthContext', () => {
  it('logs in and sets token', async () => {
    const fakeToken = 'fake-jwt-token';
    apiClient.post.mockResolvedValue({
      data: { token: fakeToken },
    });

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(screen.getByTestId('token').textContent).toBe(fakeToken);
      expect(screen.getByTestId('user').textContent).toBe('Logged In');
    });
  });

  it('logs out and clears token', async () => {
    localStorage.setItem('token', 'existing-token');

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(null);
      expect(screen.getByTestId('token').textContent).toBe('');
      expect(screen.getByTestId('user').textContent).toBe('Logged Out');
    });
  });

  it('signs up and stores token', async () => {
    const fakeToken = 'signup-token';
    apiClient.post.mockResolvedValue({ data: { token: fakeToken } });

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(screen.getByTestId('token').textContent).toBe(fakeToken);
    });
  });

  it('resend OTP returns success message', async () => {
    const successMsg = 'OTP sent';
    apiClient.post.mockResolvedValue({ data: { msg: successMsg } });

    let result;
    const Wrapper = () => {
      const { resend } = useAuth();
      React.useEffect(() => {
        resend('test@example.com').then(r => (result = r));
      }, []);
      return <div>Resend</div>;
    };

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(result).toEqual({ success: true, message: successMsg });
    });
  });

  it('resend OTP handles server error', async () => {
    apiClient.post.mockRejectedValue({
      response: { status: 400, data: { msg: 'Invalid email' } },
    });

    let result;
    const Wrapper = () => {
      const { resend } = useAuth();
      React.useEffect(() => {
        resend('test@example.com').then(r => (result = r));
      }, []);
      return <div>Resend</div>;
    };

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(result).toEqual({
        success: false,
        status: 400,
        message: 'Invalid email',
      });
    });
  });

  it('initializes with existing token from localStorage', async () => {
    localStorage.setItem('token', 'existing-token');

    render(
      <AuthProvider>
        <TestAuthComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('token').textContent).toBe('existing-token');
    expect(screen.getByTestId('user').textContent).toBe('Logged In');
  });
});
