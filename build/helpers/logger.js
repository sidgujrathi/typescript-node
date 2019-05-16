"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
const fs_1 = require("fs");
const dir = './logs';
if (!fs_1.existsSync(dir)) {
    fs_1.mkdirSync(dir);
}
exports.logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    level: 'debug',
    transports: [
        new winston.transports.File({
            filename: dir + '/app.log',
            maxsize: 4096,
        }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston.transports.Console({
        format: winston.format.json(),
    }));
}
