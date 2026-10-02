// @ts-check

export class BookStorePage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;

    this.searchInput = page.getByPlaceholder("Type to search", {
      exact: true,
    });

    this.loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });

    this.logoutButton = page.getByRole("button", {
      name: /^log\s*out$/i,
    });

    this.booksTable = page.getByRole("table");
  }

  async goto() {
    await this.page.goto("/books", {
      waitUntil: "domcontentloaded",
    });
  }

  async openLogin() {
    await this.loginButton.click();

    await this.page.waitForURL("**/login", {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * @param {string} title
   */
  async searchBook(title) {
    await this.searchInput.fill(title);
  }

  /**
   * @param {string} title
   * @returns {import("@playwright/test").Locator}
   */
  getBookRow(title) {
    return this.booksTable.getByRole("row").filter({
      has: this.page.getByRole("link", {
        name: title,
        exact: true,
      }),
    });
  }

  /**
   * @param {string} title
   * @returns {Promise<{
   *   title: string,
   *   author: string,
   *   publisher: string
   * }>}
   */
  async getBookDetails(title) {
    const row = this.getBookRow(title);
    const cells = row.getByRole("cell");

    const displayedTitle = await row
      .getByRole("link", {
        name: title,
        exact: true,
      })
      .innerText();

    const author = await cells.nth(2).innerText();
    const publisher = await cells.nth(3).innerText();

    return {
      title: displayedTitle.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
    };
  }

  async logout() {
    await this.logoutButton.click();

    await this.page.waitForURL("**/login", {
      waitUntil: "domcontentloaded",
    });
  }
}
