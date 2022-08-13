import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import { expressjwt } from 'express-jwt';
import { AuthRouter } from './routes/auth.routes';
import { IServices } from '../../interface/IService';
import {configs} from '../../configs/app.configs';

const { TOKEN_SECRET } = configs;

const compress = compression();

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
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
        path: ['/auth/register', '/auth/login'],
      }));
    app.use('/auth', AuthRouter.init(services));
    return http.createServer(app);
  },
};
