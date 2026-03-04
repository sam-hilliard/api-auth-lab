// eslint.config.cjs
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const securityPlugin = require('eslint-plugin-security');
const importPlugin = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.ts'], // all TS files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      security: securityPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // Recommended TypeScript rules
      ...tsPlugin.configs.recommended.rules,

      // Recommended security rules
      ...securityPlugin.configs.recommended.rules,

      // Custom stricter rules
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import & unused cleanup
      'unused-imports/no-unused-imports': 'error',
      'import/order': ['warn', { alphabetize: { order: 'asc' } }],
    },
  },

  // Disable rules that conflict with Prettier formatting
  prettier,
];
