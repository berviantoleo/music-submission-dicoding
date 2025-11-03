module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!uuid)",
  ]
}
