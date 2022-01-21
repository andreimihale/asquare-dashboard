module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**",
    "!./src/client/entry/*.js",
    "!src/index.js",
  ],
  testResultsProcessor: "jest-sonar-reporter",
  coverageReporters: ["lcov", "text"],
  transformIgnorePatterns: ["/node_modules"],
  setupFiles: ["<rootDir>/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
  },
  testEnvironment: "jsdom",
};
