"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class UserResponse {
    constructor(id, first_name, last_name, email, avatar, token) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.avatar = avatar;
        this.token = token;
    }
}
/**
 * This is the app Model it is decoupled from
 * the Entities used for the database
 */
class User {
    constructor(id, first_name, last_name, email, avatar, token) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.avatar = avatar;
        this.token = token;
    }
}
exports.User = User;
