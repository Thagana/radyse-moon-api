"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const app_configs_1 = require("../configs/app.configs");
const fetchWeather = (latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${app_configs_1.configs.WEATHER_API_KEY}&units=metric`);
    if (response.status === 200) {
        const icon = response.data.weather[0].icon;
        const temp = response.data.main.temp;
        const location = response.data.name;
        const minTemp = response.data.main.temp_min;
        const maxTemp = response.data.main.temp_max;
        const description = response.data.weather[0].description;
        return {
            icon,
            temp,
            location,
            minTemp,
            maxTemp,
            description
        };
    }
    return false;
});
exports.fetchWeather = fetchWeather;
exports.default = exports.fetchWeather;
