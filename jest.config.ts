import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Aquí se asegura que Jest mapee los alias correctamente
  },
};

export default createJestConfig(config);
