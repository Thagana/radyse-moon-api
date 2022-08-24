"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (title) => {
    const CATEGORY = ['business', 'general', 'health', 'science', 'sports', 'technology', 'entertainment'];
    if (!CATEGORY.includes(title)) {
        return false;
    }
    return true;
};
exports.default = validate;
