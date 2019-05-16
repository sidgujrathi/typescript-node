"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
exports.createToken = (user) => {
    const payload = {
        iss: 'cms-backend',
        sub: user,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + 86400000,
    };
    return jsonwebtoken_1.sign(payload, config_1.default.JWT_SECRET);
};
