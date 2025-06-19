import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';
import { ThemeProvider } from '../../../theme/ThemeProvider';

declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;

const mockUseAppTheme = () => ({
  theme: {
    colors: {
      primary: '#4CAF50',
      secondary: '#2196F3',
      error: '#F44336',
      surface: '#FFFFFF',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onError: '#FFFFFF',
      textPrimary: '#212121',
      textSecondary: '#757575',
      textDisabled: '#9E9E9E',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
    },
    shape: {
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
    },
    typography: {
      fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
      },
      fontSize: {
        button: 14,
      },
    },
  },
});

jest.mock('../../../theme/ThemeProvider', () => ({
  useAppTheme: () => mockUseAppTheme(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button label="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button label="Test Button" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { getByText, rerender } = render(
      <Button label="Primary Button" onPress={() => {}} variant="primary" />
    );
    expect(getByText('Primary Button')).toBeTruthy();
    
    rerender(<Button label="Secondary Button" onPress={() => {}} variant="secondary" />);
    expect(getByText('Secondary Button')).toBeTruthy();
    
    rerender(<Button label="Outlined Button" onPress={() => {}} variant="outlined" />);
    expect(getByText('Outlined Button')).toBeTruthy();
    
    rerender(<Button label="Text Button" onPress={() => {}} variant="text" />);
    expect(getByText('Text Button')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { getByText, rerender } = render(
      <Button label="Small Button" onPress={() => {}} size="small" />
    );
    expect(getByText('Small Button')).toBeTruthy();
    
    rerender(<Button label="Medium Button" onPress={() => {}} size="medium" />);
    expect(getByText('Medium Button')).toBeTruthy();
    
    rerender(<Button label="Large Button" onPress={() => {}} size="large" />);
    expect(getByText('Large Button')).toBeTruthy();
  });

  it('renders in loading state', () => {
    const { getByTestId } = render(
      <Button label="Loading Button" onPress={() => {}} loading={true} />
    );
    expect(getByTestId('button-loading-indicator')).toBeTruthy();
  });

  it('renders as disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="Disabled Button" onPress={onPressMock} disabled={true} />
    );
    
    fireEvent.press(getByText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
