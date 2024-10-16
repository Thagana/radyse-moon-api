import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import path from "path";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { expressjwt } from "express-jwt";
import { AuthRouter } from "./routes/auth.routes";
import { IServices } from "../../interface/IService";
import { configs } from "../../configs/app.configs";
import { NewsRoutes } from "./routes/news.router";
import { UserRoutes } from "./routes/user.router";
import swaggerUi from "swagger-ui-express";

const swaggerJson = require("../../tools/swagger_output.json");

const { TOKEN_SECRET } = configs;

const compress = compression();

const app = express();

Sentry.init({
  dsn: configs.SENTRY_DNS,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.disable("x-powered-by");
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "5mb" }));
app.use(compress);
app.use(cors());

export const appServerFactory = {
  init(services: IServices): http.Server {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
    app.use(
      expressjwt({
        secret: TOKEN_SECRET,
        algorithms: ["HS256"],
      }).unless({
        path: [
          "/auth/register",
          "/auth/login",
          "/auth/forgot-password",
          "/auth/forgot-password-request",
          "/auth/verify",
          "/news/fetch-news",
          "/docs/",
        ],
      })
    );
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
    app.use("/auth", AuthRouter.init(services));
    app.use("/news", NewsRoutes.init(services));
    app.use("/user", UserRoutes.init(services));
    return http.createServer(app);
  },
};
