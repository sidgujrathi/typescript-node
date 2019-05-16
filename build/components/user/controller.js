"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("../BaseAPI");
const service_1 = require("./service");
const model_1 = require("./model");
const logger_1 = require("../../helpers/logger");
const errorHandler_1 = require("../../helpers/errorHandler");
const token_1 = require("../../helpers/token");
const auth_1 = require("../../middleware/auth");
const validator_1 = require("../../middleware/validator");
const schema_1 = require("./schema");
const response_helper_1 = require("../../helpers/response.helper");
class UserApi extends BaseAPI_1.BaseApi {
    constructor() {
        super();
        this.init();
    }
    register(express) {
        express.use('/api/users', this.router);
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const foundUser = yield new service_1.UserService().findByEmail(body, {});
            if (foundUser) {
                const result = response_helper_1.ResponseHelper.errorResponse({
                    message: `${foundUser.email} already exists`,
                });
                res.status(409).send(result);
            }
            else {
                let createdUser = yield new service_1.UserService().create(body);
                createdUser = createdUser.toObject();
                const result = response_helper_1.ResponseHelper.successResponse(createdUser);
                res.status(200).send(result);
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const foundUser = yield new service_1.UserService().findByEmail(body, {
                salt: 1,
                password: 1,
                iterations: 1,
                firstName: 1,
                lastName: 1,
            });
            if (foundUser) {
                const isVerify = yield model_1.verifyPassword(foundUser.password, foundUser.salt, foundUser.iterations, body.password);
                if (isVerify) {
                    const result = response_helper_1.ResponseHelper.successResponse({
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        token: token_1.createToken(foundUser._id),
                    });
                    res.status(200).send(result);
                }
                else {
                    logger_1.logger.error({ message: 'Invalid Password' });
                    const result = response_helper_1.ResponseHelper.errorResponse({
                        message: 'Invalid Credentials',
                    });
                    res.status(401).send(result);
                }
            }
            else {
                const result = response_helper_1.ResponseHelper.errorResponse({
                    message: 'Invalid Credentials',
                });
                res.status(401).send(result);
            }
        });
    }
    fetch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id || req.user;
            const foundUser = yield new service_1.UserService().findById(id);
            const result = response_helper_1.ResponseHelper.successResponse(foundUser);
            res.status(200).send(result);
        });
    }
    fetchAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUsers = yield new service_1.UserService().find();
            const result = response_helper_1.ResponseHelper.successResponse(foundUsers);
            res.status(200).send(result);
        });
    }
    init() {
        this.router.post('/signup', validator_1.validator(schema_1.userValidator.create), errorHandler_1.catchErrors(this.signup));
        this.router.post('/signin', errorHandler_1.catchErrors(this.signin));
        this.router.get('/', auth_1.ensureAuth, errorHandler_1.catchErrors(this.fetchAll));
        this.router.get('/profile', auth_1.ensureAuth, errorHandler_1.catchErrors(this.fetch));
        this.router.get('/:id', auth_1.ensureAuth, errorHandler_1.catchErrors(this.fetch));
    }
}
exports.UserApi = UserApi;
