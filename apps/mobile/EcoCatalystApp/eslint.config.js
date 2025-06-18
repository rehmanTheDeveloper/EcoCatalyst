import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';

export default [
eslint.configs.recommended,
{
files: ['**/*.{js,jsx,ts,tsx}'],
// Explicitly exclude jest config files
ignores: [
'node_modules/**',
'dist/**',
'build/**',
'**/jest.config.js',
'**/jest.setup.js',
'**/*.config.js',
'**/*.setup.js'
],
languageOptions: {
parser: tseslintParser,
parserOptions: {
ecmaFeatures: {
jsx: true,
},
ecmaVersion: 'latest',
sourceType: 'module',
},
globals: {
console: 'readonly',
process: 'readonly',
module: 'readonly',
require: 'readonly',
__DEV__: 'readonly',
jest: 'readonly',
expect: 'readonly',
test: 'readonly',
describe: 'readonly',
beforeEach: 'readonly',
afterEach: 'readonly',
beforeAll: 'readonly',
afterAll: 'readonly',
setTimeout: 'readonly',
clearTimeout: 'readonly',
setInterval: 'readonly',
clearInterval: 'readonly',
Alert: 'readonly',
}
},
plugins: {
'@typescript-eslint': tseslint,
'react': reactPlugin,
'react-native': reactNativePlugin,
},
rules: {
'no-unused-vars': 'warn',
'no-undef': 'warn',
'@typescript-eslint/no-explicit-any': 'warn',
'react/react-in-jsx-scope': 'off',
'react/prop-types': 'off',
'@typescript-eslint/explicit-module-boundary-types': 'off',
'no-empty': 'warn'
},
settings: {
react: {
version: 'detect',
},
},
},
];
