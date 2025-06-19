import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../Card';

declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;

const mockUseAppTheme = () => ({
  theme: {
    colors: {
      surface: '#FFFFFF',
      border: '#E0E0E0',
    },
    spacing: {
      s: 8,
      m: 16,
    },
    shape: {
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
    },
    elevation: {
      small: 'shadow',
      medium: 'shadow',
      large: 'shadow',
    },
  },
});

jest.mock('../../../theme/ThemeProvider', () => ({
  useAppTheme: () => mockUseAppTheme(),
}));

describe('Card Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('handles press events when pressable', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card pressable onPress={onPressMock}>
        <Text>Pressable Card</Text>
      </Card>
    );
    
    fireEvent.press(getByText('Pressable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders with different elevation levels', () => {
    const { getByText, rerender } = render(
      <Card elevation={0}>
        <Text>Elevation 0</Text>
      </Card>
    );
    expect(getByText('Elevation 0')).toBeTruthy();
    
    rerender(
      <Card elevation={1}>
        <Text>Elevation 1</Text>
      </Card>
    );
    expect(getByText('Elevation 1')).toBeTruthy();
    
    rerender(
      <Card elevation={2}>
        <Text>Elevation 2</Text>
      </Card>
    );
    expect(getByText('Elevation 2')).toBeTruthy();
    
    rerender(
      <Card elevation={3}>
        <Text>Elevation 3</Text>
      </Card>
    );
    expect(getByText('Elevation 3')).toBeTruthy();
    
    rerender(
      <Card elevation={4}>
        <Text>Elevation 4</Text>
      </Card>
    );
    expect(getByText('Elevation 4')).toBeTruthy();
    
    rerender(
      <Card elevation={5}>
        <Text>Elevation 5</Text>
      </Card>
    );
    expect(getByText('Elevation 5')).toBeTruthy();
  });

  it('renders with different border radius sizes', () => {
    const { getByText, rerender } = render(
      <Card borderRadius="none">
        <Text>No Border Radius</Text>
      </Card>
    );
    expect(getByText('No Border Radius')).toBeTruthy();
    
    rerender(
      <Card borderRadius="small">
        <Text>Small Border Radius</Text>
      </Card>
    );
    expect(getByText('Small Border Radius')).toBeTruthy();
    
    rerender(
      <Card borderRadius="medium">
        <Text>Medium Border Radius</Text>
      </Card>
    );
    expect(getByText('Medium Border Radius')).toBeTruthy();
    
    rerender(
      <Card borderRadius="large">
        <Text>Large Border Radius</Text>
      </Card>
    );
    expect(getByText('Large Border Radius')).toBeTruthy();
  });

  it('renders without padding when withPadding is false', () => {
    const { getByText } = render(
      <Card withPadding={false}>
        <Text>No Padding</Text>
      </Card>
    );
    
    expect(getByText('No Padding')).toBeTruthy();
  });
});
