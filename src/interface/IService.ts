import { IAuthService } from '../domain/auth/auth.service';
import { INewsService } from '../domain/news/news.service';
export interface IServices {
  authService: IAuthService,
  newsService: INewsService
};
