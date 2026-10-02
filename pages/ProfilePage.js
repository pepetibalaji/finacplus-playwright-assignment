// @ts-check

export class ProfilePage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;

    this.usernameLabel = page.locator("#userName-value");

    this.logoutButton = page.getByRole("button", {
      name: /^log\s*out$/i,
    });

    this.goToBookStoreButton = page.getByRole("button", {
      name: "Go To Book Store",
      exact: true,
    });
  }

  async openBookStore() {
    await this.goToBookStoreButton.click();

    await this.page.waitForURL("**/books", {
      waitUntil: "domcontentloaded",
    });
  }

  async logout() {
    await this.logoutButton.click();

    await this.page.waitForURL("**/login", {
      waitUntil: "domcontentloaded",
    });
  }
}
