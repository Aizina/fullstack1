// eslint.config.js

import js from '@eslint/js'
import react from 'eslint-plugin-react/configs/recommended.js' // This is your imported React recommended config
import reactHooks from 'eslint-plugin-react-hooks' // This is the react-hooks plugin
import reactRefresh from 'eslint-plugin-react-refresh' // This is the react-refresh plugin
import babelParser from '@babel/eslint-parser'

export default [
  // Base config for all JS files
  js.configs.recommended,

  // Backend (Node.js, CommonJS)
  {
    files: ['bloglist-backend/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
      'no-unused-vars': 'off', // This is specific to your backend
    },
  },

  // Frontend (React, ES modules)
  {
    files: ['bloglist-frontend/**/*.js', 'bloglist-frontend/**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      // 'react.plugins.react' refers to the actual plugin object inside the recommended config
      react: react.plugins.react,
      'react-hooks': reactHooks, // This should be the plugin object itself
      'react-refresh': reactRefresh, // This should be the plugin object itself
    },
    rules: {
      // Spread the recommended React rules here
      ...(react.rules || {}), // This will include 'react/jsx-uses-vars'

      // Your specific rule configurations and overrides:
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'react/react-in-jsx-scope': 'off', // Correct for new JSX transform
      'react/prop-types': 'off', // Your preference
      // Add any other frontend-specific rule overrides here
    },
    settings: {
      // Spread the recommended React settings here
      ...(react.settings || {}),
      react: {
        // Ensure your React version is correctly specified, overriding if necessary
        ...(react.settings?.react || {}),
        version: '18.2',
      },
    },
  }
]