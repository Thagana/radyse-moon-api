import { Express } from "express";
import auth from "./auth";
import headlines from "./news";
import profile from './profile';
import contactForm from './contact';

const Routes = (app: Express) => {
  app.use("/news", headlines);
  app.use('/auth', auth);
  app.use('/user', profile);
  app.use('/contact-form', contactForm)
};

export default Routes;
