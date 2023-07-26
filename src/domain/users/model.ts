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

export class User {
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
