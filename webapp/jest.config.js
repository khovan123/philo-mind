/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
            decorators: false,
          },
          target: "es2022",
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@philo-mind/shared$": "<rootDir>/../libs/shared/src/index.ts",
    "^@philo-mind/shared/(.*)$": "<rootDir>/../libs/shared/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
