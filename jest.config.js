/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?|expo-modules-core|expo-file-system|expo-asset|expo-constants|expo-font|react-native-reanimated|react-native-worklets|@react-navigation|@react-native-async-storage/async-storage)",
  ],

  testEnvironment: "node",

  collectCoverageFrom: ["utils/**/*.ts", "hooks/**/*.ts", "!**/*.d.ts"],
};
