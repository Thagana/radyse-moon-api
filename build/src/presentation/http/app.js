"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appServerFactory = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const express_jwt_1 = require("express-jwt");
const auth_routes_1 = require("./routes/auth.routes");
const app_configs_1 = require("../../configs/app.configs");
const news_router_1 = require("./routes/news.router");
const user_router_1 = require("./routes/user.router");
const { TOKEN_SECRET } = app_configs_1.configs;
const compress = (0, compression_1.default)();
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(compress);
app.use((0, cors_1.default)());
exports.appServerFactory = {
    init(services) {
        app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        app.use((0, express_jwt_1.expressjwt)({
            secret: TOKEN_SECRET,
            algorithms: ['HS256'],
        })
            .unless({
            path: ['/auth/register', '/auth/login'],
        }));
        app.use('/auth', auth_routes_1.AuthRouter.init(services));
        app.use('/news', news_router_1.NewsRoutes.init(services));
        app.use('/user', user_router_1.UserRoutes.init(services));
        return http_1.default.createServer(app);
    },
};
