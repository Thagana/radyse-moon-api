"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class PayStack {
    constructor(token) {
        this.PAY_STACK_URL = "https://api.paystack.co";
        this.token = token;
    }
    createPlan(amount, name, interval) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${this.PAY_STACK_URL}/plan`, {
                name,
                amount,
                interval,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const { data } = response;
                resolve(data.data);
            })
                .catch((error) => reject(error));
        });
    }
    createTransaction(email, amount, callbackUrl) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${this.PAY_STACK_URL}/transaction/initialize`, {
                email,
                amount,
                callback_url: callbackUrl,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const { data } = response.data;
                resolve(data);
            })
                .catch((error) => reject(error));
        });
    }
    verifyTransaction(reference) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(`${this.PAY_STACK_URL}/transaction/verify/${reference}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const res = response.data;
                resolve(res);
            })
                .catch((error) => reject(error));
        });
    }
    subscribeUser(customer, plan) {
        return new Promise((resolve, reject) => {
            if (!customer || !plan) {
                reject("Customer and Plan are required");
            }
            axios_1.default
                .post(`${this.PAY_STACK_URL}/subscription`, {
                customer,
                plan,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const res = response.data;
                resolve(res);
            })
                .catch((error) => reject(error));
        });
    }
    getSubscribers() {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(`${this.PAY_STACK_URL}/subscription`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const res = response.data;
                resolve(res);
            })
                .catch((error) => reject(error));
        });
    }
    getSubscriber() { }
    updateSubscription(code) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${this.PAY_STACK_URL}/subscription/${code}/manage/email`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const data = response.data;
                resolve(data);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     *
     * @param code
     * @param token
     * @returns
     */
    disableSubscription(code, email_token) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${this.PAY_STACK_URL}/subscription/disable`, {
                code,
                token: email_token,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const data = response.data;
                resolve(data);
            })
                .catch((error) => reject(error));
        });
    }
    enableSubscription(code, email_token) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${this.PAY_STACK_URL}/subscription/enable`, {
                code,
                token: email_token,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const data = response.data;
                resolve(data);
            })
                .catch((error) => reject(error));
        });
    }
    getSubscriptions(code) {
        return new Promise((resolve, reject) => {
            axios_1.default.get(`${this.PAY_STACK_URL}/subscription/${code}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            })
                .then((response) => {
                const data = response.data;
                resolve(data);
            })
                .catch((error) => reject(error));
        });
    }
}
exports.default = PayStack;
