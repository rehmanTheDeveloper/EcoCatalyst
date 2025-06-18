import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

export interface CardProps extends TouchableOpacityProps {
  /**
   * Content to render inside the card
   */
  children: React.ReactNode;
  
  /**
   * Whether the card is pressable
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Elevation level (0-5)
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  
  /**
   * Additional styles for the card container
   */
  style?: ViewStyle;
  
  /**
   * Border radius size
   * @default 'medium'
   */
  borderRadius?: 'small' | 'medium' | 'large' | 'none';
  
  /**
   * Whether to add padding inside the card
   * @default true
   */
  withPadding?: boolean;
}

/**
 * Card component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const Card: React.FC<CardProps> = ({
  children,
  pressable = false,
  elevation = 1,
  style,
  borderRadius = 'medium',
  withPadding = true,
  onPress,
  ...rest
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  
  const getElevationStyle = (level: number) => {
    switch(level) {
      case 0: return styles.elevation0;
      case 1: return styles.elevation1;
      case 2: return styles.elevation2;
      case 3: return styles.elevation3;
      case 4: return styles.elevation4;
      case 5: return styles.elevation5;
      default: return styles.elevation1;
    }
  };
  
  const getRadiusStyle = (radius: string) => {
    switch(radius) {
      case 'none': return styles.radiusNone;
      case 'small': return styles.radiusSmall;
      case 'medium': return styles.radiusMedium;
      case 'large': return styles.radiusLarge;
      default: return styles.radiusMedium;
    }
  };
  
  const cardStyles = [
    styles.card,
    getElevationStyle(elevation),
    getRadiusStyle(borderRadius),
    withPadding && styles.withPadding,
    style,
  ];
  
  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    marginVertical: theme.spacing.s,
  },
  withPadding: {
    padding: theme.spacing.m,
  },
  elevation0: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  elevation1: {
    ...theme.elevation.small !== 'none' ? {
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  elevation2: {
    ...theme.elevation.medium !== 'none' ? {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  elevation3: {
    ...theme.elevation.medium !== 'none' ? {
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  elevation4: {
    ...theme.elevation.large !== 'none' ? {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  elevation5: {
    ...theme.elevation.large !== 'none' ? {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  radiusNone: {
    borderRadius: 0,
  },
  radiusSmall: {
    borderRadius: theme.shape.borderRadius.small,
  },
  radiusMedium: {
    borderRadius: theme.shape.borderRadius.medium,
  },
  radiusLarge: {
    borderRadius: theme.shape.borderRadius.large,
  },
});

export default Card;
