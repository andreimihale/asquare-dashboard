module.exports = {
  verbose: true,
  testEnvironment: "node",
  testResultsProcessor: "jest-sonar-reporter",
  collectCoverageFrom: ["./src/**/*.js"],
  coverageReporters: ["lcov"],
  moduleFileExtensions: ["js", "json", "yml", "yaml"],
  transform: {
    "\\.ya?ml$": "yaml-jest",
    "\\.jsx?$": "babel-jest",
  },
};
