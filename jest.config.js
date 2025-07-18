module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts', 
    '!src/**/*.d.ts', 
    '!src/**/*.test.ts', 
    '!src/**/*.spec.ts',
    '!src/infrastructure/config/**',
    '!src/presentation/middleware/validation.middleware.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

};
