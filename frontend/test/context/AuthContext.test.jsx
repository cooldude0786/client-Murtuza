import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // 1. Use userEvent for better interactions
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import apiClient from '../../src/api/axios';

// Mock the apiClient module
vi.mock('../../src/api/axios');

// A helper component to render and interact with the context
const TestAuthComponent = () => {
  const { login, logout, signup, user, token, loading } = useAuth();
  
  if (loading) {
    return <div>Initial loading...</div>;
  }

  return (
    <div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('John', 'test@example.com', 'password')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
      
      <div data-testid="token">{token}</div>
      <div data-testid="user">{user ? `Logged in as ${user.name}` : 'Logged Out'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  const user = userEvent.setup(); // 2. Setup userEvent

  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('initializes with no user or token', () => {
    render(<AuthProvider><TestAuthComponent /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('Logged Out');
    expect(screen.getByTestId('token').textContent).toBe('');
  });

  it('initializes with an existing token and fetches the user', async () => {
    const existingToken = 'existing-jwt-token';
    const fakeUser = { id: '123', name: 'Jane Doe' };
    localStorage.setItem('token', existingToken);

    apiClient.get.mockResolvedValue({ data: fakeUser });

    render(<AuthProvider><TestAuthComponent /></AuthProvider>);

    // Wait for the user data to be fetched and displayed
    await screen.findByText('Logged in as Jane Doe');

    expect(screen.getByTestId('token').textContent).toBe(existingToken);
  });

  it('logs in, sets the token, and fetches the user', async () => {
    const fakeToken = 'fake-jwt-token';
    const fakeUser = { id: '123', name: 'John Doe' };

    apiClient.post.mockResolvedValue({ data: { token: fakeToken } });
    apiClient.get.mockResolvedValue({ data: fakeUser });

    render(<AuthProvider><TestAuthComponent /></AuthProvider>);

    await user.click(screen.getByText('Login'));

    // Wait for the final state after all async operations
    await screen.findByText('Logged in as John Doe');

    expect(localStorage.getItem('token')).toBe(fakeToken);
    expect(screen.getByTestId('token').textContent).toBe(fakeToken);
  });

  it('logs out, clearing the token and user state', async () => {
    const existingToken = 'existing-jwt-token';
    const fakeUser = { id: '123', name: 'Jane Doe' };
    localStorage.setItem('token', existingToken);
    apiClient.get.mockResolvedValue({ data: fakeUser });

    render(<AuthProvider><TestAuthComponent /></AuthProvider>);

    // First, wait for the user to be logged in
    const logoutButton = await screen.findByText('Logout');

    // Then, click the logout button
    await user.click(logoutButton);

    // Finally, wait for the user to be logged out
    await screen.findByText('Logged Out');

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('Logged Out');
  });

  it('signup function does not log the user in', async () => {
    apiClient.post.mockResolvedValue({ data: { msg: 'OTP sent' } });

    render(<AuthProvider><TestAuthComponent /></AuthProvider>);

    await user.click(screen.getByText('Signup'));

    // Wait for a brief moment to ensure no state changes happen
    await new Promise(r => setTimeout(r, 50)); 
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('Logged Out');
  });
});