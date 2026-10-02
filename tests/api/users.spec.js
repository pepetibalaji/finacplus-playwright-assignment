import { test, expect } from "../../fixtures/apiFixtures.js";
import { createUserData } from "../../test-data/users.js";
import { writeJsonFile } from "../../utils/fileUtils.js";

test("user can be created, fetched, and updated", async ({
  usersApi,
}, testInfo) => {
  const user = createUserData();

  const updatedUser = {
    ...user,
    name: `${user.name}-updated`,
  };

  let userId;

  try {
    await test.step("Create a user and store its ID", async () => {
      const response = await usersApi.createUser(user);

      expect(
        response.status(),
        `Create response: ${await response.text()}`,
      ).toBe(201);

      const body = await response.json();

      expect(body.data?.id).toEqual(expect.any(String));
      expect(body.data.id.trim()).not.toBe("");

      // Capture the ID before further assertions so cleanup can use it.
      userId = body.data.id;

      expect(body.data.data).toEqual(user);

      const filePath = testInfo.outputPath("created-user.json");

      await writeJsonFile(filePath, {
        userId,
        ...user,
      });

      await testInfo.attach("Created user details", {
        path: filePath,
        contentType: "application/json",
      });
    });

    await test.step("Fetch the created user by ID", async () => {
      const response = await usersApi.getUser(userId);

      expect(
        response.status(),
        `Fetch response: ${await response.text()}`,
      ).toBe(200);

      const body = await response.json();

      expect(body.data.id).toBe(userId);
      expect(body.data.data).toEqual(user);
    });

    await test.step("Update the user's name", async () => {
      const response = await usersApi.updateUser(userId, updatedUser);

      expect(
        response.status(),
        `Update response: ${await response.text()}`,
      ).toBe(200);

      const body = await response.json();

      expect(body.data.id).toBe(userId);
      expect(body.data.data).toEqual(updatedUser);
    });

    await test.step("Verify the update was persisted", async () => {
      const response = await usersApi.getUser(userId);

      expect(
        response.status(),
        `Fetch after update response: ${await response.text()}`,
      ).toBe(200);

      const body = await response.json();

      expect(body.data.id).toBe(userId);
      expect(body.data.data).toEqual(updatedUser);
    });
  } finally {
    if (userId) {
      await test.step("Clean up the created user", async () => {
        const response = await usersApi.deleteUser(userId);

        expect(
          response.status(),
          `Cleanup response: ${await response.text()}`,
        ).toBe(204);
      });
    }
  }
});
