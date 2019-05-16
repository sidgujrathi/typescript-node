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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./helpers/errorHandler");
const logger_1 = require("./helpers/logger");
const routes_1 = require("./routes");
const db_1 = require("./config/db");
class App {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.dbConnection();
    }
    config() {
        this.app.use(helmet_1.default());
        this.app.use(cors_1.default());
        this.app.use(express_1.default.static('public'));
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({
            extended: false,
            limit: '10mb',
        }));
        this.app.use((req, res, next) => {
            logger_1.logger.info(`request method = ${req.method}, url = ${req.url}`);
            next();
        });
        routes_1.registerRoutes(this.app);
        this.app.use(errorHandler_1.notFound);
        this.app.use(errorHandler_1.validationErrors);
        if (this.app.get('env') === 'development') {
            this.app.use(errorHandler_1.developmentErrors);
        }
        else {
            this.app.use(errorHandler_1.productionErrors);
        }
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = new db_1.MongoDB();
            yield conn.connection();
        });
    }
}
exports.App = App;
