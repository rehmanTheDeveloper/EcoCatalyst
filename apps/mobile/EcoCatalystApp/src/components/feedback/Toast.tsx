import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/ThemeProvider';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  /**
   * Toast message text
   */
  message: string;
  
  /**
   * Toast type
   * @default 'info'
   */
  type?: ToastType;
  
  /**
   * Whether the toast is visible
   * @default false
   */
  visible: boolean;
  
  /**
   * Function to call when toast is dismissed
   */
  onDismiss: () => void;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * @default 3000
   */
  duration?: number;
  
  /**
   * Additional styles for the toast container
   */
  style?: ViewStyle;
  
  /**
   * Additional styles for the toast message text
   */
  messageStyle?: TextStyle;
  
  /**
   * Position of the toast
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
}

/**
 * Toast component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onDismiss,
  duration = 3000,
  style,
  messageStyle,
  position = 'bottom',
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const getToastTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          backgroundColor: theme.colors.success,
        };
      case 'error':
        return {
          icon: 'error',
          backgroundColor: theme.colors.error,
        };
      case 'warning':
        return {
          icon: 'warning',
          backgroundColor: theme.colors.warning,
        };
      case 'info':
      default:
        return {
          icon: 'info',
          backgroundColor: theme.colors.info,
        };
    }
  };
  
  const { icon, backgroundColor } = getToastTypeStyles();
  
  useEffect(() => {
    if (visible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration]);
  
  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };
  
  if (!visible && !fadeAnim) {
    return null;
  }
  
  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        { opacity: fadeAnim, backgroundColor },
        style,
      ]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={styles.content}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#FFFFFF" />
        <Text style={[styles.message, messageStyle]}>{message}</Text>
      </View>
      
      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.closeButton}
        accessibilityLabel="Dismiss"
        accessibilityRole="button"
      >
        <MaterialIcons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.shape.borderRadius.medium,
    marginHorizontal: theme.spacing.m,
    ...theme.elevation.large !== 'none' ? {
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    } : {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  topPosition: {
    top: 50,
  },
  bottomPosition: {
    bottom: 50,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.fontSize.body2,
    marginLeft: theme.spacing.m,
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
});

export default Toast;
