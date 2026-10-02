// @ts-check

export class LoginPage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder("UserName", {
      exact: true,
    });

    this.passwordInput = page.getByPlaceholder("Password", {
      exact: true,
    });

    this.loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });

    this.errorMessage = page.locator("#name");
  }

  async goto() {
    await this.page.goto("/login", {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
