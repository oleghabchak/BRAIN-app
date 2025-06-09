import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-plugin-prettier';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const cleanedBrowserGlobals = Object.fromEntries(
  Object.entries(globals.browser).map(([key, value]) => [key.trim(), value])
);

export default [
  {
    ignores: ['node_modules', 'ios', 'android', 'package.json'],
  },
  { languageOptions: { globals: cleanedBrowserGlobals } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.jsx'],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  pluginReactConfig,
  {
    rules: {
      'no-nested-ternary': 'error',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          parser: 'typescript',
          endOfLine: 'auto',
          tabWidth: 2,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'off',
      'import/no-duplicates': 'error',
    },
    plugins: {
      prettier: prettierConfig,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
  },
];
