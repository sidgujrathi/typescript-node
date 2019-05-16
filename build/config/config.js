"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = {
    development: {
        env,
        port: process.env.PORT,
        mongoURL: process.env.MONGO_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        MONGO_DEBUG: process.env.MONGO_DEBUG,
    },
    production: {
        env,
        port: '3003',
        mongoURL: 'mongodb://bat-mongodb:BySP7C9a9XLQ@node211203-lacunappd1.j.layershift.co.uk/lacuna_bat',
        JWT_SECRET: 'skdjhf23897@&@%@$@&dkjde7hj237wnesdhfkjJHWHJDNK',
        MONGO_DEBUG: false,
    },
};
exports.default = config[env];
