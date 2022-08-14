import {User} from './model';
import { RegisterResponse } from '../../interface/IResponse';
import { IncomingHttpHeaders } from "http";

export interface IUsersRepository {
  createUser(email: string, token: string, headers: IncomingHttpHeaders): Promise<RegisterResponse>;
  findUser(email: string): Promise<User | false>;
  updateToken(token: string, user: User): Promise<boolean>;
}
