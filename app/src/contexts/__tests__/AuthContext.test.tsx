import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react-native';
import { AuthContext, AuthProvider } from '../AuthContext';
import { Text, TouchableOpacity, View } from 'react-native';

declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: any;

const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockUpdateProfile = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  
  return {
    __esModule: true,
    ...originalModule,
    createUserWithEmailAndPassword: (...args: any[]) => mockCreateUserWithEmailAndPassword(...args),
    signInWithEmailAndPassword: (...args: any[]) => mockSignInWithEmailAndPassword(...args),
    signOut: (...args: any[]) => mockSignOut(...args),
    sendPasswordResetEmail: (...args: any[]) => mockSendPasswordResetEmail(...args),
    updateProfile: (...args: any[]) => mockUpdateProfile(...args),
    onAuthStateChanged: (...args: any[]) => {
      mockOnAuthStateChanged(...args);
      const [auth, callback] = args;
      callback(null);
      return jest.fn(); // Return unsubscribe function
    },
  };
});

jest.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

const TestComponent = () => {
  return (
    <AuthContext.Consumer>
      {(context) => (
        <View>
          <Text testID="auth-status">
            {context.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Text>
          <Text testID="loading-status">
            {context.isLoading ? 'Loading' : 'Not Loading'}
          </Text>
          <Text testID="error-message">{context.error || 'No Error'}</Text>
          <TouchableOpacity
            testID="register-button"
            onPress={() => context.register('test@example.com', 'password123', 'Test User')}
          >
            <Text>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="login-button"
            onPress={() => context.login('test@example.com', 'password123')}
          >
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="logout-button"
            onPress={() => context.logout()}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="reset-password-button"
            onPress={() => context.resetPassword('test@example.com')}
          >
            <Text>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="clear-error-button"
            onPress={() => context.clearError()}
          >
            <Text>Clear Error</Text>
          </TouchableOpacity>
        </View>
      )}
    </AuthContext.Consumer>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial authentication state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').props.children).toBe('Not Authenticated');
      expect(screen.getByTestId('loading-status').props.children).toBe('Not Loading');
      expect(screen.getByTestId('error-message').props.children).toBe('No Error');
    });
  });

  it('handles successful registration', async () => {
    const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
    const mockUserCredential = { user: mockUser };
    
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential);
    mockUpdateProfile.mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('register-button').props.onPress();
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      mockUser,
      { displayName: 'Test User' }
    );
  });

  it('handles registration errors', async () => {
    const mockError = { code: 'auth/email-already-in-use', message: 'Email already in use' };
    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      try {
        await screen.getByTestId('register-button').props.onPress();
      } catch (error) {
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('Email is already in use');
    });
  });

  it('handles successful login', async () => {
    const mockUserCredential = { user: { uid: '123', email: 'test@example.com' } };
    mockSignInWithEmailAndPassword.mockResolvedValueOnce(mockUserCredential);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('login-button').props.onPress();
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
  });

  it('handles login errors', async () => {
    const mockError = { code: 'auth/wrong-password', message: 'Wrong password' };
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      try {
        await screen.getByTestId('login-button').props.onPress();
      } catch (error) {
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('Invalid email or password');
    });
  });

  it('handles successful logout', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('logout-button').props.onPress();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('handles logout errors', async () => {
    const mockError = { code: 'auth/no-current-user', message: 'No current user' };
    mockSignOut.mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      try {
        await screen.getByTestId('logout-button').props.onPress();
      } catch (error) {
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('Logout failed');
    });
  });

  it('handles successful password reset', async () => {
    mockSendPasswordResetEmail.mockResolvedValueOnce(undefined);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('reset-password-button').props.onPress();
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });

  it('handles password reset errors', async () => {
    const mockError = { code: 'auth/user-not-found', message: 'User not found' };
    mockSendPasswordResetEmail.mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      try {
        await screen.getByTestId('reset-password-button').props.onPress();
      } catch (error) {
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('No user found with this email');
    });
  });

  it('clears error when requested', async () => {
    const mockError = { code: 'auth/user-not-found', message: 'User not found' };
    mockSendPasswordResetEmail.mockRejectedValueOnce(mockError);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      try {
        await screen.getByTestId('reset-password-button').props.onPress();
      } catch (error) {
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('No user found with this email');
    });

    await act(async () => {
      screen.getByTestId('clear-error-button').props.onPress();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toBe('No Error');
    });
  });

  it('updates authentication state when user changes', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    
    mockOnAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').props.children).toBe('Not Authenticated');
    });

    mockOnAuthStateChanged.mockImplementationOnce((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

  });
});
