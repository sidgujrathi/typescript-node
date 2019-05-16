"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const extend_1 = __importDefault(require("extend"));
const options = {
    allowUnknown: false,
    stripUnknown: true,
    abortEarly: false,
};
exports.validator = (schema) => {
    return (req, res, next) => {
        const toValidate = {};
        if (!schema) {
            return next();
        }
        ['params', 'body', 'query'].forEach(key => {
            if (schema[key]) {
                toValidate[key] = req.body.key;
            }
        });
        const onValidationComplete = (err, validated) => {
            if (err) {
                const { details } = err;
                const message = details.map(i => i.message).join(',');
                return res.status(400).send({
                    success: false,
                    message,
                    errors: details,
                });
            }
            extend_1.default(req, validated);
            return next();
        };
        return Joi.validate(toValidate, schema, options, onValidationComplete);
    };
};
