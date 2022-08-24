"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    interval: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    integration: {
        type: Number,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    plan_code: {
        type: String,
        required: true,
    },
    invoice_limit: {
        type: Number,
        required: true,
    },
    send_invoices: {
        type: Boolean,
        required: true,
    },
    send_sms: {
        type: Boolean,
        required: true,
    },
    hosted_page: {
        type: Boolean,
        required: true,
    },
    migrate: {
        type: Boolean,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Plan', schema);
