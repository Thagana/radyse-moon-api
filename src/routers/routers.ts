import { Express } from "express";
import auth from "./auth";
import headlines from "./news";
import profile from './profile';

const Routes = (app: Express) => {
  app.use("/news", headlines);
  app.use('/auth', auth);
  app.use('/user', profile);
};

export default Routes;
