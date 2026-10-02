import { readFile } from "node:fs/promises";

import { test, expect } from "../../fixtures/uiFixtures.js";
import { designPatternsBook } from "../../test-data/books.js";
import { writeJsonFile } from "../../utils/fileUtils.js";

test("registered user can find a book, export its details, and log out", async ({
  page,
  homePage,
  loginPage,
  profilePage,
  bookStorePage,
  credentials,
}, testInfo) => {
  await test.step("Navigate from the homepage to login", async () => {
    await homePage.goto();
    await homePage.openBookStore();
    await bookStorePage.openLogin();
    await expect(loginPage.loginButton).toBeVisible();
  });

  await test.step("Log in and verify the user profile", async () => {
    await loginPage.login(credentials.username, credentials.password);
    await expect.soft(page).toHaveURL(/\/profile\/?$/);
    await expect
      .soft(profilePage.usernameLabel)
      .toHaveText(credentials.username);
    await expect.soft(profilePage.logoutButton).toBeVisible();
  });

  await test.step("Search for the required book", async () => {
    await profilePage.openBookStore();
    await bookStorePage.searchBook(designPatternsBook.title);
    await expect
      .soft(bookStorePage.searchInput)
      .toHaveValue(designPatternsBook.title);
    const matchingRow = bookStorePage.getBookRow(designPatternsBook.title);
    await expect(matchingRow).toHaveCount(1);
    await expect(matchingRow).toBeVisible();
    await expect
      .soft(bookStorePage.booksTable.getByRole("link"))
      .toHaveCount(1);
  });

  await test.step("Validate and export the displayed book details", async () => {
    const bookDetails = await bookStorePage.getBookDetails(
      designPatternsBook.title,
    );

    expect.soft(bookDetails).toEqual(designPatternsBook);

    const filePath = testInfo.outputPath("book-details.json");

    await writeJsonFile(filePath, bookDetails);

    await testInfo.attach("Book details", {
      path: filePath,
      contentType: "application/json",
    });

    const savedDetails = JSON.parse(await readFile(filePath, "utf8"));

    expect.soft(savedDetails).toEqual(bookDetails);
  });

  await test.step("Log out and verify the login form", async () => {
    await bookStorePage.logout();
    await expect.soft(page).toHaveURL(/\/login\/?$/);
    await expect.soft(loginPage.usernameInput).toBeVisible();
    await expect.soft(loginPage.passwordInput).toBeVisible();
    await expect.soft(loginPage.loginButton).toBeVisible();
    await expect.soft(bookStorePage.logoutButton).toBeHidden();
  });
});
