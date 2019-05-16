"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class BaseApi {
    constructor() {
        this.router = express_1.Router();
    }
}
exports.BaseApi = BaseApi;
