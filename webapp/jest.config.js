/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.tsx?$": [
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
    "^.+\\.jsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
            flow: true,
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
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|react-native-svg|lucide-react-native|react-i18next)",
  ],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/jest.styleMock.js",
    "^react-native$": "react-native-web",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@philo-mind/shared$": "<rootDir>/../libs/shared/src/index.ts",
    "^@philo-mind/shared/(.*)$": "<rootDir>/../libs/shared/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
