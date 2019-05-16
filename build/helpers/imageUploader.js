"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const publicDir = './public';
const imgDir = './public/images';
if (!fs_1.existsSync(publicDir)) {
    fs_1.mkdirSync(publicDir);
}
if (!fs_1.existsSync(imgDir)) {
    fs_1.mkdirSync(imgDir);
}
const Storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, imgDir);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});
const uploads = multer_1.default({ storage: Storage });
exports.default = uploads;
