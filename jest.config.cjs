module.exports = {
  preset: 'jest-expo',
  clearMocks: true,
  restoreMocks: true,

  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
  },

  collectCoverageFrom: [
    'src/utils/transactions.ts',
    'src/utils/formatters.ts',
    'src/store/transactionStore.ts',
    'src/services/receiptShareService.ts',
  ],

  coverageReporters: ['text', 'lcov'],
};