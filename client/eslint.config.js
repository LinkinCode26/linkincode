import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,             // ← NUEVO: jsx-uses-vars
      react.configs.flat['jsx-runtime'],          // ← NUEVO: sin import React
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },               // ← NUEVO: detecta React 19
    },
    rules: {
      // React 17+ no necesita import React en cada archivo
      'react/react-in-jsx-scope': 'off',
      // No usamos PropTypes (proyecto moderno con hooks)
      'react/prop-types': 'off',
    },
  },
])