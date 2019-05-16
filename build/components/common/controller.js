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
const BaseAPI_1 = require("../BaseAPI");
const auth_1 = require("../../middleware/auth");
const response_helper_1 = require("../../helpers/response.helper");
const imageUploader_1 = __importDefault(require("../../helpers/imageUploader"));
class CommonApi extends BaseAPI_1.BaseApi {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/api', this.router);
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    fileName: req.file.filename,
                };
                const result = response_helper_1.ResponseHelper.successResponse(data);
                res.status(200).send(result);
            }
            catch (error) {
                const result = response_helper_1.ResponseHelper.errorResponse(error);
                res.status(200).send(result);
            }
        });
    }
    init() {
        this.router.post('/images', auth_1.ensureAuth, imageUploader_1.default.single('file'), this.uploadImage);
    }
}
exports.CommonApi = CommonApi;
