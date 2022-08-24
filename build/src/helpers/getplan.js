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
const Plan_1 = __importDefault(require("../data/infrastructure/db/entities/Plan"));
const getPlan = (name, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (amount) {
            const plan = yield Plan_1.default.findOne({
                amount,
            });
            if (!plan) {
                return { success: false, id: "", data: "" };
            }
            return { success: true, id: plan.plan_code, data: plan };
        }
        const plan = yield Plan_1.default.findOne({
            name,
        });
        if (!plan) {
            return { success: false, id: "", data: "" };
        }
        return { success: true, id: plan.plan_code, data: plan };
    }
    catch (error) {
        return { success: false, id: "", data: "" };
    }
});
exports.default = getPlan;
