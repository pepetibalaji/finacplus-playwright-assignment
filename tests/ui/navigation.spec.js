import { test, expect } from "../../fixtures/uiFixtures.js";

test("user can navigate from the homepage to the login form", async ({
  page,
  homePage,
  bookStorePage,
  loginPage,
}) => {
  await homePage.goto();
  await homePage.openBookStore();
  await bookStorePage.openLogin();

  await expect(page).toHaveURL(/\/login\/?$/);

  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeEnabled();
});
