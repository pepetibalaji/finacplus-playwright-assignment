// @ts-check

export class HomePage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;

    this.bookStoreLink = page.getByRole("link", {
      name: "Book Store Application",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/", {
      waitUntil: "domcontentloaded",
    });
  }

  async openBookStore() {
    await this.bookStoreLink.click();

    await this.page.waitForURL("**/books", {
      waitUntil: "domcontentloaded",
    });
  }
}
