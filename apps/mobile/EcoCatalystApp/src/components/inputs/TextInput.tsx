import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeProvider';

export interface TextInputProps extends RNTextInputProps {
  /**
   * Label text for the input
   */
  label: string;
  
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Additional styles for the container
   */
  containerStyle?: ViewStyle;
  
  /**
   * Additional styles for the input
   */
  inputStyle?: TextStyle;
  
  /**
   * Additional styles for the label
   */
  labelStyle?: TextStyle;
  
  /**
   * Left icon name from MaterialIcons
   */
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  
  /**
   * Right icon name from MaterialIcons
   */
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  
  /**
   * Function to call when right icon is pressed
   */
  onRightIconPress?: () => void;
}

/**
 * TextInput component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.fontSize.subtitle2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  focusedLabel: {
    color: theme.colors.primary,
  },
  errorLabel: {
    color: theme.colors.error,
  },
  disabledLabel: {
    color: theme.colors.textDisabled,
  },
  requiredAsterisk: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs / 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.shape.borderRadius.medium,
    backgroundColor: theme.colors.surface,
  },
  focusedInputContainer: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  errorInputContainer: {
    borderColor: theme.colors.error,
  },
  disabledInputContainer: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: theme.spacing.m,
    fontSize: theme.typography.fontSize.body1,
    color: theme.colors.textPrimary,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    marginLeft: theme.spacing.m,
    marginRight: theme.spacing.s,
  },
  rightIconContainer: {
    padding: theme.spacing.m,
  },
  helperText: {
    fontSize: theme.typography.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
  },
});

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...rest
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const isPassword = secureTextEntry && !isPasswordVisible;
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const showRightIcon = rightIcon || secureTextEntry;
  const rightIconName = secureTextEntry 
    ? (isPasswordVisible ? 'visibility' : 'visibility-off') 
    : rightIcon;
  
  const handleRightIconPress = () => {
    if (secureTextEntry) {
      togglePasswordVisibility();
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[
        styles.label,
        isFocused && styles.focusedLabel,
        error && styles.errorLabel,
        disabled && styles.disabledLabel,
        labelStyle
      ]}>
        {label}{required && <Text style={styles.requiredAsterisk}>*</Text>}
      </Text>
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedInputContainer,
        error && styles.errorInputContainer,
        disabled && styles.disabledInputContainer,
      ]}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        
        <RNTextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            showRightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textDisabled}
          editable={!disabled}
          secureTextEntry={isPassword}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          accessibilityState={{ 
            disabled: disabled
          }}
          {...rest}
        />
        
        {showRightIcon && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            disabled={disabled}
            style={styles.rightIconContainer}
            accessibilityLabel={
              secureTextEntry 
                ? `${isPasswordVisible ? 'Hide' : 'Show'} password` 
                : `${label} icon button`
            }
          >
            <MaterialIcons
              name={rightIconName as keyof typeof MaterialIcons.glyphMap}
              size={20}
              color={error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text 
          style={[
            styles.helperText,
            error && styles.errorText
          ]}
          accessibilityLabel={error || helperText}
          accessibilityRole="alert"
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};


export default TextInput;
