import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Alert from '../Alert';

declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;

const mockUseAppTheme = () => ({
  theme: {
    colors: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      surface: '#FFFFFF',
      border: '#E0E0E0',
      textPrimary: '#212121',
      textSecondary: '#757575',
      onPrimary: '#FFFFFF',
    },
    spacing: {
      s: 8,
      m: 16,
      l: 24,
    },
    shape: {
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
    },
    elevation: {
      medium: 'shadow',
    },
    typography: {
      fontSize: {
        h5: 18,
        body1: 16,
        button: 14,
      },
      lineHeight: {
        body1: 24,
      },
      fontFamily: {
        regular: 'System',
        medium: 'System',
      },
    },
  },
});

jest.mock('../../../theme/ThemeProvider', () => ({
  useAppTheme: () => mockUseAppTheme(),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: function MaterialIcons(props) {
    return React.createElement('MaterialIcons', { ...props, testID: `icon-${props.name}` });
  }
}));

describe('Alert Component', () => {
  const defaultProps = {
    title: 'Test Alert',
    message: 'This is a test alert message',
    visible: true,
    onDismiss: jest.fn(),
  };

  it('renders correctly with default props', () => {
    const { getByText, getByRole } = render(<Alert {...defaultProps} />);
    
    expect(getByText('Test Alert')).toBeTruthy();
    expect(getByText('This is a test alert message')).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
  });

  it('renders with different alert types', () => {
    const types = ['success', 'error', 'warning', 'info'] as const;
    
    types.forEach(type => {
      const { getByText, unmount } = render(
        <Alert {...defaultProps} type={type} />
      );
      
      expect(getByText('Test Alert')).toBeTruthy();
      unmount();
    });
  });

  it('calls onDismiss when primary button is pressed', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <Alert {...defaultProps} onDismiss={onDismiss} />
    );
    
    fireEvent.press(getByText('OK'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onPrimaryButtonPress when provided and primary button is pressed', () => {
    const onPrimaryButtonPress = jest.fn();
    const { getByText } = render(
      <Alert {...defaultProps} onPrimaryButtonPress={onPrimaryButtonPress} />
    );
    
    fireEvent.press(getByText('OK'));
    expect(onPrimaryButtonPress).toHaveBeenCalledTimes(1);
  });

  it('renders with custom primary button text', () => {
    const { getByText } = render(
      <Alert {...defaultProps} primaryButtonText="Continue" />
    );
    
    expect(getByText('Continue')).toBeTruthy();
  });

  it('renders with secondary button when secondaryButtonText is provided', () => {
    const { getByText } = render(
      <Alert {...defaultProps} secondaryButtonText="Cancel" />
    );
    
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onSecondaryButtonPress when secondary button is pressed', () => {
    const onSecondaryButtonPress = jest.fn();
    const { getByText } = render(
      <Alert 
        {...defaultProps} 
        secondaryButtonText="Cancel" 
        onSecondaryButtonPress={onSecondaryButtonPress} 
      />
    );
    
    fireEvent.press(getByText('Cancel'));
    expect(onSecondaryButtonPress).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when secondary button is pressed and onSecondaryButtonPress is not provided', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <Alert 
        {...defaultProps} 
        secondaryButtonText="Cancel" 
        onDismiss={onDismiss} 
      />
    );
    
    fireEvent.press(getByText('Cancel'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles when provided', () => {
    const { getByText } = render(
      <Alert 
        {...defaultProps} 
        style={{ backgroundColor: 'red' }}
        titleStyle={{ color: 'blue' }}
        messageStyle={{ color: 'green' }}
      />
    );
    
    expect(getByText('Test Alert')).toBeTruthy();
    expect(getByText('This is a test alert message')).toBeTruthy();
  });
});
