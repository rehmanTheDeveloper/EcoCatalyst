import '@testing-library/jest-native/extend-expect';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useIsFocused: jest.fn(() => true),
  };
});

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn(); // Return unsubscribe function
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: jest.fn(() => View),
  };
});

jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  
  reactNative.TouchableOpacity = ({ children, onPress, style, disabled, testID }) => {
    return {
      type: 'TouchableOpacity',
      props: {
        children,
        onPress,
        style,
        disabled,
        testID
      },
    };
  };
  
  reactNative.Animated = {
    Value: jest.fn(() => ({
      interpolate: jest.fn(),
      setValue: jest.fn(),
    })),
    View: jest.fn(({ children, style }) => ({
      type: 'Animated.View',
      props: { style, children },
    })),
    createAnimatedComponent: jest.fn(Component => Component),
    timing: jest.fn(() => ({
      start: jest.fn(cb => cb && cb()),
    })),
  };
  
  return reactNative;
});
