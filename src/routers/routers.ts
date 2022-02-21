import { Express } from "express";
import auth from "./auth";
import headlines from "./news";

const Routes = (app: Express) => {
  app.use("/", headlines);
  app.use('/auth', auth);
};

export default Routes;
