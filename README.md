# FinacPlus QA Automation Assignment

UI and API test automation built with **Playwright and JavaScript**.

The framework uses Page Object Model, custom fixtures, reusable API services, isolated test data, and automated reporting.

## Live reports

- [Report homepage](https://pepetibalaji.github.io/finacplus-playwright-assignment/)
- [Allure report](https://pepetibalaji.github.io/finacplus-playwright-assignment/allure/)
- [Playwright report](https://pepetibalaji.github.io/finacplus-playwright-assignment/playwright/)

The hosted reports contain the selected suite from the latest published execution.

## Assignment coverage

### UI — DemoQA

The test performs the following workflow:

1. Opens `https://demoqa.com/`.
2. Navigates to Book Store Application.
3. Logs in using a manually registered user.
4. Validates the username and logout button.
5. Opens the bookstore.
6. Searches for **Learning JavaScript Design Patterns**.
7. Validates the matching book and its details.
8. Writes the title, author, and publisher to a JSON file.
9. Logs out and verifies the login page is displayed.

User registration is performed manually, as required by the assignment.

### API — ReqRes

The test performs the following workflow:

1. Creates a user record and validates HTTP status `201`.
2. Captures the returned user ID.
3. Saves the ID and user details to a JSON file.
4. Retrieves the record using that ID and validates its details.
5. Updates the user's name and validates the response.
6. Retrieves the record again to verify the update was persisted.
7. Attempts to delete the created record during cleanup.

## Technology

- JavaScript
- Playwright Test
- Allure Report 3
- dotenv
- GitHub Actions
- GitHub Pages

## Project structure

| Location                  | Responsibility                                   |
| ------------------------- | ------------------------------------------------ |
| `pages/`                  | DemoQA page objects, locators, and interactions  |
| `fixtures/uiFixtures.js`  | Page objects and UI credentials                  |
| `fixtures/apiFixtures.js` | API headers and service initialization           |
| `services/UsersApi.js`    | User record API operations                       |
| `test-data/`              | Expected book details and generated user data    |
| `utils/fileUtils.js`      | JSON file-writing utility                        |
| `tests/ui/`               | Bookstore workflow test                          |
| `tests/api/`              | User lifecycle test                              |
| `playwright.config.js`    | Test projects, execution settings, and reporters |
| `.github/workflows/`      | CI execution and report publication              |

## Prerequisites

- Node.js LTS and npm.
- A manually registered DemoQA account.
- A ReqRes project containing a `users` collection.
- A ReqRes Manage API key with access to that collection.

## Installation

Clone the repository and open its root directory.

Install dependencies:

```bash
npm ci
```

Install Chromium:

```bash
npx playwright install chromium
```

On Linux, install Chromium with its operating-system dependencies:

```bash
npx playwright install --with-deps chromium
```

## Environment configuration

Create a local `.env` file from `.env.example`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Populate these values:

```dotenv
DEMOQA_USERNAME=your_registered_username
DEMOQA_PASSWORD=your_registered_password

REQRES_API_KEY=your_manage_api_key
REQRES_BASE_URL=https://reqres.in
REQRES_COLLECTION=users
REQRES_ENV=prod
```

The ReqRes environment must match the environment containing the collection.

Real credentials are stored in `.env` locally and GitHub Actions secrets in CI. `.env` is ignored by Git; `.env.example` contains placeholders.

## Run tests

| Command               | Purpose                                |
| --------------------- | -------------------------------------- |
| `npm test`            | Run UI and API tests                   |
| `npm run test:ui`     | Run the Chromium UI test               |
| `npm run test:api`    | Run the API test                       |
| `npm run test:headed` | Run the UI test with a visible browser |
| `npm run test:debug`  | Run tests in Playwright debug mode     |

The Playwright projects are named `ui-chromium` and `api`.

## Reports

### Playwright

Open the report after running tests:

```bash
npm run report:playwright
```

### Allure

Generate and open the Allure report with one command:

```bash
npm run report:allure:view
```

This uses existing test results and does not rerun tests.

The individual commands are also available:

| Command                      | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `npm run report:allure`      | Generate the single-file HTML report |
| `npm run report:allure:open` | Open the generated report            |
| `npm run clean:allure`       | Delete previous raw Allure results   |

For a fresh local execution:

```bash
npm run clean:allure
npm test
npm run report:allure:view
```

Run the reporting command even if tests fail so the failure details can be inspected.

The generated single-file report can also be opened directly:

```text
allure-report/single-file/index.html
```

### Report directories

| Directory            | Contents                               |
| -------------------- | -------------------------------------- |
| `test-results/`      | Test output files and failure evidence |
| `playwright-report/` | Playwright HTML report                 |
| `allure-results/`    | Raw Allure results and attachments     |
| `allure-report/`     | Generated Allure HTML report           |
| `report-site/`       | Website prepared for GitHub Pages      |

These directories are generated during execution and excluded from Git.

## Assignment output files

The tests save and attach:

- **`book-details.json`** — title, author, and publisher of the matching book.
- **`created-user.json`** — created user ID, name, and job.

Files are written using `testInfo.outputPath()` and attached using `testInfo.attach()`. They can be inspected within the individual test's report.

The API record is removed during cleanup when possible. Its JSON attachment remains available as execution evidence.

## ReqRes endpoint choice

The assignment requires retrieving the same user that was created and validating an update.

ReqRes's demo `/api/users` endpoints simulate mutations without persisting the created user for subsequent retrieval. This solution therefore uses a persistent ReqRes `users` collection.

The collection stores synthetic user records; these are not authentication accounts.

| Operation | Endpoint                                     |
| --------- | -------------------------------------------- |
| Create    | `POST /api/collections/users/records`        |
| Retrieve  | `GET /api/collections/users/records/{id}`    |
| Update    | `PUT /api/collections/users/records/{id}`    |
| Cleanup   | `DELETE /api/collections/users/records/{id}` |

The test uses the returned record ID throughout the lifecycle. A GET after the update verifies persistence rather than relying only on the update response.

## Framework design

- **Page objects** contain UI locators and interactions.
- **API services** contain endpoint paths and request construction.
- **Fixtures** provide configured dependencies to tests.
- **Tests** own assertions and workflow steps.
- **Test data** is separate from credentials.
- **Unique user names** distinguish API records between executions.
- **Cleanup** targets only the record created by the current test.
- **Isolated output paths** prevent file collisions between executions.

Each dependent workflow is contained in one test. Separately scheduled tests do not depend on another test's generated ID or execution order.

The configuration uses one worker and up to two retries in CI. Local runs have no retries. Failure screenshots and retained failure traces support investigation.

## CI execution

GitHub Actions runs automatically for:

- Pushes to `main` or `master`.
- Pull requests targeting `main` or `master`.

### Manual execution

1. Open **Actions → Playwright Tests**.
2. Select **Run workflow**.
3. Choose a branch.
4. Select `all`, `ui`, or `api`.
5. Click **Run workflow**.

Select branch **`main`** when the hosted reports should be updated.

| Selection | Tests executed |
| --------- | -------------- |
| `all`     | UI and API     |
| `ui`      | Chromium UI    |
| `api`     | API only       |

### GitHub secrets

Configure these repository secrets under **Settings → Secrets and variables → Actions**:

- `DEMOQA_USERNAME`
- `DEMOQA_PASSWORD`
- `REQRES_API_KEY`

The workflow defines the ReqRes base URL, collection, and environment separately.

### Artifacts

Each run attempts to upload:

- `playwright-report`
- `allure-report`
- `allure-results`

Artifacts are retained for **30 days**.

Download and extract `allure-report`, then open its `index.html` to view the single-file report.

## GitHub Pages publication

GitHub Pages is configured with **GitHub Actions** as its publishing source.

Pushes and manual executions on `main` can update the hosted reports. Pull requests and manual runs on other branches provide downloadable artifacts.

Each deployment replaces both hosted reports with the selected suite's results. An API-only execution therefore publishes API-only results in both report formats.

Failed test results can be published when report generation and packaging succeed. The failed test job still causes the workflow to fail.

Cancelled runs or report-generation failures leave the previous website deployment available. The homepage links to the workflow run that produced the displayed reports.

## Scope and limitations

- UI coverage currently targets Chromium.
- The suite covers the two requested assignment workflows.
- Tests depend on the availability of DemoQA and ReqRes.
- DemoQA registration and ReqRes collection provisioning are manual prerequisites.
- API cleanup requires a captured record ID and an available API.
