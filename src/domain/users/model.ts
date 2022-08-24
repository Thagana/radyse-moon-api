class UserResponse {
  constructor(
    public readonly id: string,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly avatar: string,
    public readonly token: string
  ) {}
}

/**
 * This is the app Model it is decoupled from
 * the Entities used for the database
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly first_name: string,
    public readonly last_name: string,
    public readonly email: string,
    public readonly avatar: string,
    public token: string
  ) {}
}
