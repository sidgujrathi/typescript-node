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
const model_1 = __importDefault(require("./model"));
class UserService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new model_1.default(data).save();
        });
    }
    findByEmail(input, projections) {
        return __awaiter(this, void 0, void 0, function* () {
            return model_1.default.findOne({ email: input.email }, projections);
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            return model_1.default.find({});
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return model_1.default.findById(id);
        });
    }
}
exports.UserService = UserService;
