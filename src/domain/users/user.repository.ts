import { LoginResponse } from '../../interface/IResponse';
import { User } from './model';

export interface ICreateUser {
  name: string,
  surname: string,
  username: string,
  email: string,
  password: string,
}



export interface IUsersRepository {
  createUser(createUserDto: ICreateUser): Promise<User>;
}
