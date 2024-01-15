/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:css-import-order/recommended',
    'prettier',
  ],
  plugins: ['css-import-order', 'sort-destructure-keys'],

  // remix template files we are unlikely to modify
  // leave unlinted to make it easier to upgrade them
  ignorePatterns: ['/server.ts'],
  rules: {
    // strict enforcement of curly brace style
    curly: ['error', 'all'],

    // strict equality checks
    eqeqeq: ['error'],

    // prefer type keyword to appear after import keyword
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    // sort imported modules
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc', // put type imports first
          caseInsensitive: true,
        },
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
      },
    ],

    // no return statements in else/else-if blocks
    'no-else-return': ['error', { allowElseIf: false }],

    // prefer single quotes to double quotes and backticks
    quotes: ['error', 'single', { avoidEscape: true }],

    // sort component props alphabetically
    'react/jsx-sort-props': ['error'],

    // sort destructured keys alphabetically
    'sort-destructure-keys/sort-destructure-keys': ['error'],

    // sort members within imported modules
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true, // don't want to sort import lines, use eslint-plugin-import instead
        allowSeparatedGroups: true,
      },
    ],

    // comments must be preceded by a space
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
  },

  // rules from our "extends" above are retained unless explicitly overridden here
  overrides: [
    {
      files: ['**/index.ts'],
      plugins: ['sort-exports'],
      rules: {
        // sort exports alphabetically
        'sort-exports/sort-exports': ['error', { sortDir: 'asc' }],
      },
    },
    {
      files: ['**/*.ts?(x)'],
      extends: ['plugin:typescript-sort-keys/recommended'],

      // but we need to redeclare the parser and options
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      rules: {
        // keeps logic cleaner, more readable and prevents confusion
        '@typescript-eslint/no-unnecessary-condition': 'error',

        // very strict boolean expressions for style as well as safety
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: false,
            allowNullableObject: false,
            allowNumber: false,
          },
        ],
      },
    },
  ],

  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it means we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 28,
    },
  },
};
