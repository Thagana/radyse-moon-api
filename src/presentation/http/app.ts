import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { expressjwt } from 'express-jwt';
import { AuthRouter } from './routes/auth.routes';
import { IServices } from '../../interface/IService';
import {configs} from '../../configs/app.configs';
import { NewsRoutes } from './routes/news.router';

const { TOKEN_SECRET } = configs;

const compress = compression();

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '5mb' }));
app.use(compress);
app.use(cors());

export const appServerFactory = {
  init(services: IServices): http.Server {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(expressjwt({
      secret: TOKEN_SECRET,
      algorithms: ['HS256'],
    })
      .unless({
        path: ['/auth/register', '/auth/login', '/news/fetch-news'],
      }));
    app.use('/auth', AuthRouter.init(services));
    app.use('/news', NewsRoutes.init(services))
    return http.createServer(app);
  },
};
