const esConfig = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['google', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'object-curly-spacing': 0,
    'no-unused-vars': ['warn'],
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
    'array-element-newline': [
      'warn',
      { ArrayExpression: 'consistent', ArrayPattern: { minItems: 1 } },
    ],
  },
};

module.exports = esConfig;
