"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: false
    },
    customer: {
        required: false,
        type: Number
    },
    plan: {
        required: false,
        type: Number
    },
    status: {
        required: false,
        type: String
    },
    id: {
        required: false,
        type: Number
    },
    domain: {
        required: false,
        type: String
    },
    integration: {
        required: false,
        type: Number
    },
    start: {
        type: Number,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    authorization: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    invoice_limit: {
        type: Number,
        required: false,
    },
    cron_expression: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: false,
    },
    createdAt: {
        type: String,
        required: false,
    },
    next_payment_date: {
        type: String,
        required: false
    },
    email_token: {
        type: String,
        required: true
    },
    subscription_code: {
        type: String,
        required: false,
    },
    user_id: {
        required: true,
        type: String
    }
});
exports.default = (0, mongoose_1.model)('Subscription', schema);
