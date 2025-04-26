module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};

// module.exports = {
//   // other config
//   resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js',
//   transformIgnorePatterns: ['node_modules/(?!@angular)'],
//   transform: {
//     '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular',
//   },
// };
