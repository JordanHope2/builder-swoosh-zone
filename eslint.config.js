// eslint.config.js
import ts from 'typescript-eslint';
import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parserOptions: { project: ['./tsconfig.json'] } },
    rules: { '@typescript-eslint/explicit-function-return-type': 'off' }
  },
  {
    files: ['**/*.js'],
    rules: { 'no-undef': 'error' }
  }
];
