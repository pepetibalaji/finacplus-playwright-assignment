// @ts-check

export class UsersApi {
  /**
   * @param {import("@playwright/test").APIRequestContext} request
   * @param {string} collection
   */
  constructor(request, collection) {
    this.request = request;
    this.recordsPath = `/api/collections/${encodeURIComponent(collection)}/records`;
  }

  /**
   * @param {{ name: string, job: string }} user
   */
  async createUser(user) {
    return this.request.post(this.recordsPath, {
      data: {
        data: user,
      },
    });
  }

  /**
   * @param {string} userId
   */
  async getUser(userId) {
    return this.request.get(
      `${this.recordsPath}/${encodeURIComponent(userId)}`,
    );
  }

  /**
   * PUT sends the complete replacement record.
   * @param {string} userId
   * @param {{ name: string, job: string }} user
   */
  async updateUser(userId, user) {
    return this.request.put(
      `${this.recordsPath}/${encodeURIComponent(userId)}`,
      {
        data: {
          data: user,
        },
      },
    );
  }

  /**
   * @param {string} userId
   */
  async deleteUser(userId) {
    return this.request.delete(
      `${this.recordsPath}/${encodeURIComponent(userId)}`,
    );
  }
}
