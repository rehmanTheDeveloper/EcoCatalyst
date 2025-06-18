import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeProvider';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertProps {
  /**
   * Alert title
   */
  title: string;
  
  /**
   * Alert message
   */
  message: string;
  
  /**
   * Whether the alert is visible
   * @default false
   */
  visible: boolean;
  
  /**
   * Alert type
   * @default 'info'
   */
  type?: AlertType;
  
  /**
   * Function to call when alert is dismissed
   */
  onDismiss: () => void;
  
  /**
   * Primary button text
   * @default 'OK'
   */
  primaryButtonText?: string;
  
  /**
   * Function to call when primary button is pressed
   * @default onDismiss
   */
  onPrimaryButtonPress?: () => void;
  
  /**
   * Secondary button text
   * If not provided, secondary button will not be shown
   */
  secondaryButtonText?: string;
  
  /**
   * Function to call when secondary button is pressed
   */
  onSecondaryButtonPress?: () => void;
  
  /**
   * Additional styles for the alert container
   */
  style?: ViewStyle;
  
  /**
   * Additional styles for the title text
   */
  titleStyle?: TextStyle;
  
  /**
   * Additional styles for the message text
   */
  messageStyle?: TextStyle;
}

/**
 * Alert component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const Alert: React.FC<AlertProps> = ({
  title,
  message,
  visible,
  type = 'info',
  onDismiss,
  primaryButtonText = 'OK',
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  style,
  titleStyle,
  messageStyle,
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const getAlertTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          color: theme.colors.success,
        };
      case 'error':
        return {
          icon: 'error',
          color: theme.colors.error,
        };
      case 'warning':
        return {
          icon: 'warning',
          color: theme.colors.warning,
        };
      case 'info':
      default:
        return {
          icon: 'info',
          color: theme.colors.info,
        };
    }
  };
  
  const { icon, color } = getAlertTypeStyles();
  
  const handlePrimaryButtonPress = () => {
    if (onPrimaryButtonPress) {
      onPrimaryButtonPress();
    } else {
      onDismiss();
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.container, style]}>
          <View style={styles.header}>
            <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={28} color={color} />
            <Text style={[styles.title, { color }, titleStyle]} accessibilityRole="header">
              {title}
            </Text>
          </View>
          
          <Text style={[styles.message, messageStyle]} accessibilityRole="text">
            {message}
          </Text>
          
          <View style={styles.buttonContainer}>
            {secondaryButtonText && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onSecondaryButtonPress || onDismiss}
                accessibilityRole="button"
                accessibilityLabel={secondaryButtonText}
              >
                <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.primaryButton,
                { backgroundColor: color },
                !secondaryButtonText && styles.fullWidthButton
              ]}
              onPress={handlePrimaryButtonPress}
              accessibilityRole="button"
              accessibilityLabel={primaryButtonText}
            >
              <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape.borderRadius.medium,
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing.l,
    ...theme.elevation.medium !== 'none' ? {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  title: {
    fontSize: theme.typography.fontSize.h5,
    fontWeight: '500',
    marginLeft: theme.spacing.m,
    fontFamily: theme.typography.fontFamily.medium,
  },
  message: {
    fontSize: theme.typography.fontSize.body1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.l,
    lineHeight: theme.typography.lineHeight.body1,
    fontFamily: theme.typography.fontFamily.regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.shape.borderRadius.small,
    minWidth: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    marginLeft: theme.spacing.s,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  fullWidthButton: {
    flex: 1,
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.fontSize.button,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.button,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default Alert;
