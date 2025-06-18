import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

export interface TypographyProps extends TextProps {
  /**
   * The text content to display
   */
  children: React.ReactNode;
  
  /**
   * Typography variant
   * @default 'body1'
   */
  variant?: TypographyVariant;
  
  /**
   * Text color
   * If not provided, uses theme.colors.textPrimary
   */
  color?: string;
  
  /**
   * Whether the text should be centered
   * @default false
   */
  center?: boolean;
  
  /**
   * Whether the text should be bold
   * @default false
   */
  bold?: boolean;
  
  /**
   * Whether the text should be italic
   * @default false
   */
  italic?: boolean;
  
  /**
   * Additional styles for the text
   */
  style?: TextStyle;
}

/**
 * Typography component that follows Material Design guidelines and WCAG 2.1 AA accessibility standards
 */
const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  color,
  center = false,
  bold = false,
  italic = false,
  style,
  ...rest
}) => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  
  const textStyles = [
    styles[variant],
    { color: color || theme.colors.textPrimary },
    center && styles.center,
    bold && styles.bold,
    italic && styles.italic,
    style,
  ];
  
  const getAccessibilityRole = () => {
    if (variant.startsWith('h')) {
      return 'header';
    }
    return 'text';
  };
  
  return (
    <Text 
      style={textStyles} 
      accessibilityRole={getAccessibilityRole()}
      {...rest}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  h1: {
    fontSize: theme.typography.fontSize.h1,
    lineHeight: theme.typography.lineHeight.h1,
    fontWeight: '300',
    letterSpacing: -0.5,
    fontFamily: theme.typography.fontFamily.regular,
  },
  h2: {
    fontSize: theme.typography.fontSize.h2,
    lineHeight: theme.typography.lineHeight.h2,
    fontWeight: '300',
    letterSpacing: 0,
    fontFamily: theme.typography.fontFamily.regular,
  },
  h3: {
    fontSize: theme.typography.fontSize.h3,
    lineHeight: theme.typography.lineHeight.h3,
    fontWeight: '400',
    letterSpacing: 0.25,
    fontFamily: theme.typography.fontFamily.regular,
  },
  h4: {
    fontSize: theme.typography.fontSize.h4,
    lineHeight: theme.typography.lineHeight.h4,
    fontWeight: '400',
    letterSpacing: 0.15,
    fontFamily: theme.typography.fontFamily.regular,
  },
  h5: {
    fontSize: theme.typography.fontSize.h5,
    lineHeight: theme.typography.lineHeight.h5,
    fontWeight: '500',
    letterSpacing: 0.15,
    fontFamily: theme.typography.fontFamily.medium,
  },
  h6: {
    fontSize: theme.typography.fontSize.h6,
    lineHeight: theme.typography.lineHeight.h6,
    fontWeight: '500',
    letterSpacing: 0.15,
    fontFamily: theme.typography.fontFamily.medium,
  },
  subtitle1: {
    fontSize: theme.typography.fontSize.subtitle1,
    lineHeight: theme.typography.lineHeight.subtitle1,
    fontWeight: '400',
    letterSpacing: 0.15,
    fontFamily: theme.typography.fontFamily.regular,
  },
  subtitle2: {
    fontSize: theme.typography.fontSize.subtitle2,
    lineHeight: theme.typography.lineHeight.subtitle2,
    fontWeight: '500',
    letterSpacing: 0.1,
    fontFamily: theme.typography.fontFamily.medium,
  },
  body1: {
    fontSize: theme.typography.fontSize.body1,
    lineHeight: theme.typography.lineHeight.body1,
    fontWeight: '400',
    letterSpacing: 0.5,
    fontFamily: theme.typography.fontFamily.regular,
  },
  body2: {
    fontSize: theme.typography.fontSize.body2,
    lineHeight: theme.typography.lineHeight.body2,
    fontWeight: '400',
    letterSpacing: 0.25,
    fontFamily: theme.typography.fontFamily.regular,
  },
  button: {
    fontSize: theme.typography.fontSize.button,
    lineHeight: theme.typography.lineHeight.button,
    fontWeight: '500',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily.medium,
  },
  caption: {
    fontSize: theme.typography.fontSize.caption,
    lineHeight: theme.typography.lineHeight.caption,
    fontWeight: '400',
    letterSpacing: 0.4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  overline: {
    fontSize: theme.typography.fontSize.overline,
    lineHeight: theme.typography.lineHeight.overline,
    fontWeight: '400',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily.regular,
  },
  center: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default Typography;
