import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TextInput from '../TextInput';
import { ThemeProvider } from '../../../theme/ThemeProvider';

declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;

const mockUseAppTheme = () => ({
  theme: {
    colors: {
      primary: '#4CAF50',
      error: '#F44336',
      surface: '#FFFFFF',
      border: '#E0E0E0',
      textPrimary: '#212121',
      textSecondary: '#757575',
      textDisabled: '#9E9E9E',
    },
    spacing: {
      xs: 4,
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
    typography: {
      fontSize: {
        subtitle2: 14,
        body1: 16,
        caption: 12,
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
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => 'MaterialIcons',
}));

describe('TextInput Component', () => {
  it('renders correctly with default props', () => {
    const { getByText, getByLabelText } = render(
      <TextInput label="Test Input" placeholder="Enter text" />
    );
    
    expect(getByText('Test Input')).toBeTruthy();
    expect(getByLabelText('Test Input')).toBeTruthy();
  });

  it('handles text input correctly', () => {
    const onChangeMock = jest.fn();
    const { getByLabelText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        onChangeText={onChangeMock}
      />
    );
    
    const input = getByLabelText('Test Input');
    fireEvent.changeText(input, 'Hello World');
    
    expect(onChangeMock).toHaveBeenCalledWith('Hello World');
  });

  it('displays error message when provided', () => {
    const { getByText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        error="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('displays helper text when provided', () => {
    const { getByText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        helperText="Enter your username"
      />
    );
    
    expect(getByText('Enter your username')).toBeTruthy();
  });

  it('renders as disabled', () => {
    const { getByLabelText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        disabled={true}
      />
    );
    
    const input = getByLabelText('Test Input');
    expect(input.props.editable).toBe(false);
  });

  it('renders with required indicator', () => {
    const { getByText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        required={true}
      />
    );
    
    expect(getByText('*')).toBeTruthy();
  });

  it('handles focus and blur events', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    
    const { getByLabelText } = render(
      <TextInput 
        label="Test Input" 
        placeholder="Enter text"
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );
    
    const input = getByLabelText('Test Input');
    
    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();
    
    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });
});
