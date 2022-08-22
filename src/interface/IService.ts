import { IAuthService } from '../domain/auth/auth.service';
import { INewsService } from '../domain/news/news.service';
import { IUserService } from '../domain/users/user.service';
export interface IServices {
  authService: IAuthService,
  newsService: INewsService,
  userService: IUserService,
};
