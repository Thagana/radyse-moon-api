export class UserResponse {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly avatar: string,
    public readonly verificationTone: string,
    public readonly forgotPasswordToken: string
  ) {}
}

export class User {
  /**
   * Constructs a new instance of the class.
   *
   * @param {number} id - The ID of the instance.
   * @param {string} firstName - The first name of the instance.
   * @param {string} lastName - The last name of the instance.
   * @param {string} email - The email of the instance.
   * @param {number} verified - The verification status of the instance.
   * @param {string} password - The password of the instance.
   * @param {string} avatar - The avatar of the instance.
   * @param {string} verificationToken - The token of the instance.
   * @param {string} forgotPasswordToken - The token of the instance.
   * 
   */
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly verified: number,
    public readonly password: string,
    public readonly avatar: string,
    public readonly verificationToken: string,
    public readonly forgotPasswordToken: string
  ) {}
}
