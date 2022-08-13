import { IAuthenticationRepository } from '../domain/auth/auth.repository';
// import { IUsersRepository } from '../domain/users/user.repository';


export interface IRepositories {
  authenticationRepository: IAuthenticationRepository,
  // userRepository?: IUsersRepository
}
