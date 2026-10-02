import { test as base, expect } from "@playwright/test";

import { HomePage } from "../pages/HomePage.js";
import { LoginPage } from "../pages/LoginPage.js";
import { ProfilePage } from "../pages/ProfilePage.js";
import { BookStorePage } from "../pages/BookStorePage.js";

export const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);
    await use(bookStorePage);
  },

  credentials: async ({}, use) => {
    const username = process.env.DEMOQA_USERNAME;
    const password = process.env.DEMOQA_PASSWORD;

    if (!username?.trim() || !password) {
      throw new Error(
        "Set DEMOQA_USERNAME and DEMOQA_PASSWORD in .env or the CI environment.",
      );
    }

    await use({ username, password });
  },
});

export { expect };
