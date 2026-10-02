import { test as base, expect } from "@playwright/test";
import { UsersApi } from "../services/UsersApi.js";

export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, use) => {
    const apiKey = process.env.REQRES_API_KEY?.trim();
    const environment = process.env.REQRES_ENV?.trim();

    if (!apiKey) {
      throw new Error("Set REQRES_API_KEY in .env or the CI environment.");
    }

    if (!environment || !["prod", "dev"].includes(environment)) {
      throw new Error(
        "Set REQRES_ENV to prod or dev in .env or the CI environment.",
      );
    }

    await use({
      ...extraHTTPHeaders,
      "x-api-key": apiKey,
      "X-Reqres-Env": environment,
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  },

  usersApi: async ({ request }, use) => {
    const collection = process.env.REQRES_COLLECTION?.trim();

    if (!collection) {
      throw new Error("Set REQRES_COLLECTION in .env or the CI environment.");
    }

    const usersApi = new UsersApi(request, collection);

    await use(usersApi);
  },
});

export { expect };
