import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  TouchableOpacityProps,
  View
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Button label text
   */
  label: string;
  
  /**
   * Function to call when button is pressed
   */
  onPress: () => void;
  
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Additional styles for the button container
   */
  style?: ViewStyle;
  
  /**
   * Additional styles for the button text
   */
  labelStyle?: TextStyle;
  
  /**
   * Left icon component
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon component
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  labelStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const { theme } = useAppTheme();
  
  const getButtonStyles = () => {
    const baseStyles = {
      ...styles.button,
      borderRadius: theme.shape.borderRadius.medium,
    };
    
    let variantStyles = {};
    if (variant === 'primary') {
      variantStyles = { 
        backgroundColor: theme.colors.primary,
        elevation: 2,
      };
    } else if (variant === 'secondary') {
      variantStyles = { 
        backgroundColor: theme.colors.primaryLight,
      };
    } else if (variant === 'outlined') {
      variantStyles = { 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      };
    } else if (variant === 'text') {
      variantStyles = { 
        backgroundColor: 'transparent',
      };
    }
    
    let sizeStyles = {};
    if (size === 'small') {
      sizeStyles = {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.s,
        minWidth: 64,
      };
    } else if (size === 'medium') {
      sizeStyles = {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        minWidth: 88,
      };
    } else if (size === 'large') {
      sizeStyles = {
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        minWidth: 120,
      };
    }
    
    const disabledStyles = disabled ? { 
      backgroundColor: theme.colors.textDisabled,
      borderColor: theme.colors.textDisabled,
      elevation: 0,
    } : {};
    
    return [baseStyles, variantStyles, sizeStyles, disabledStyles, style];
  };
  
  const buttonStyles = getButtonStyles();
  
  const getTextStyles = () => {
    const baseStyles = {
      ...styles.label,
      fontWeight: '500',
      textAlign: 'center',
    };
    
    let variantStyles = {};
    if (variant === 'primary') {
      variantStyles = { 
        color: theme.colors.onPrimary,
      };
    } else if (variant === 'secondary' || variant === 'outlined' || variant === 'text') {
      variantStyles = { 
        color: theme.colors.primary,
      };
    }
    
    let sizeStyles = {};
    if (size === 'small') {
      sizeStyles = {
        fontSize: theme.typography.fontSize.caption,
      };
    } else if (size === 'medium') {
      sizeStyles = {
        fontSize: theme.typography.fontSize.button,
      };
    } else if (size === 'large') {
      sizeStyles = {
        fontSize: theme.typography.fontSize.body1,
      };
    }
    
    const disabledStyles = disabled ? { 
      color: theme.colors.textDisabled,
    } : {};
    
    return [baseStyles, variantStyles, sizeStyles, disabledStyles, labelStyle];
  };
  
  const textStyles = getTextStyles();
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ 
        disabled: disabled || loading,
        busy: loading
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.primary}
          testID="button-loading-indicator"
        />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: theme.spacing.s }}>{leftIcon}</View>}
          <Text style={textStyles}>{label}</Text>
          {rightIcon && <View style={{ marginLeft: theme.spacing.s }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Button;
