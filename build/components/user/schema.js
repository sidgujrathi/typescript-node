"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
exports.userValidator = {
    create: {
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string().required(),
        },
    },
    resetPassword: {
        params: {
            token: Joi.string().required(),
        },
    },
    changePassword: {
        body: {
            old_password: Joi.string().required(),
            new_password: Joi.string()
                .min(3)
                .max(15)
                .required()
                .regex(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/),
            confirm_password: Joi.any()
                .valid(Joi.ref('new_password'))
                .required()
                .options({ language: { any: { allowOnly: 'must match password' } } }),
        },
    },
};
