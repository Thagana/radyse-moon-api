class UserResponse {
  constructor(
    public readonly id: number,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly avatar: string,
    public readonly token: string
  ) {}
}

export class User {
  /**
   * Constructs a new instance of the class.
   *
   * @param {number} id - The ID of the instance.
   * @param {string} first_name - The first name of the instance.
   * @param {string} last_name - The last name of the instance.
   * @param {string} email - The email of the instance.
   * @param {number} verified - The verification status of the instance.
   * @param {string} password - The password of the instance.
   * @param {string} avatar - The avatar of the instance.
   * @param {string} token - The token of the instance.
   */
  constructor(
    public readonly id: number,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly verified: number,
    public readonly password: string,
    public readonly avatar: string,
    public token: string
  ) {}
}
