const baseConfigModule = await import('@repo/eslint-config/base');
const baseConfig = baseConfigModule.config;

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/prefer-default-export': 'off',
    },
  },
]; 