import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Swagger Demo Project",
    description: "Implementation of Swagger with TypeScript",
  },
  host: 'localhost:4001/docs',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "../presentation/http/routes/auth.routes.ts",
  "../presentation/http/routes/user.router.ts",
  "../presentation/http/routes/news.router.ts",
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
