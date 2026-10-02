// @ts-check
import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",

  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // Limit CI concurrency when testing shared external applications.
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "allure-playwright",
      {
        resultsDir: "allure-results",
        detail: true,
        suiteTitle: true,
      },
    ],
  ],

  use: {
    // Keep diagnostic evidence for failed test attempts.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "ui-chromium",
      testMatch: "**/ui/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://demoqa.com",
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
      },
    },
    {
      name: "api",
      testMatch: "**/api/**/*.spec.js",
      use: {
        baseURL: process.env.REQRES_BASE_URL || "https://reqres.in",
      },
    },
  ],
});
