"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../helpers/logger");
const service_1 = require("../components/user/service");
exports.ensureAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        return res
            .status(401)
            .send({ success: false, msg: 'Auth headers required', item: {} });
    }
    try {
        const decoded = yield jsonwebtoken_1.verify(token, config_1.default.JWT_SECRET);
        const user = yield new service_1.UserService().findById(decoded.sub);
        if (!user) {
            return res
                .status(401)
                .send({ success: false, msg: 'Permission Denied', item: {} });
        }
        req.user = decoded.sub;
        next();
    }
    catch (err) {
        logger_1.logger.error(err.stack);
        if (err.name === 'TokenExpiredError') {
            return res
                .status(401)
                .send({ success: false, msg: 'Auth token expired', item: err });
        }
        if (err.name === 'JsonWebTokenError') {
            return res
                .status(401)
                .send({ success: false, msg: 'Invalid token', item: err });
        }
        return res
            .status(401)
            .send({ success: false, msg: err.message, item: err });
    }
});
