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
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const KEY_LENGTH = 256;
const SALT_LENGTH = 64;
const ITERATIONS = 10000;
const DIGEST = 'sha256';
const BYTE_TO_STRING_ENCODING = 'hex';
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    salt: { type: String, select: false },
    password: { type: String, select: false },
    iterations: { type: Number, select: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
UserSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.userId = ret._id;
        delete ret.password;
        delete ret.salt;
        delete ret.iterations;
        delete ret._id;
        return ret;
    },
});
UserSchema.set('toObject', {
    transform(doc, ret, options) {
        ret.userId = ret._id;
        delete ret.password;
        delete ret.salt;
        delete ret.iterations;
        delete ret._id;
        return ret;
    },
});
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    generateHashPassword(user.password)
        .then(data => {
        user.password = data.password;
        user.salt = data.salt;
        user.iterations = ITERATIONS;
        next();
    })
        .catch(err => {
        next(err);
    });
});
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});
function generateHashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const salt = crypto_1.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
            crypto_1.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (error, hash) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({
                        salt,
                        password: hash.toString(BYTE_TO_STRING_ENCODING),
                        iterations: ITERATIONS,
                    });
                }
            });
        });
    });
}
exports.generateHashPassword = generateHashPassword;
function verifyPassword(savedPassword, savedSalt, savedIterations, passwordAttempt) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            crypto_1.pbkdf2(passwordAttempt, savedSalt, savedIterations, KEY_LENGTH, DIGEST, (error, hash) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(savedPassword === hash.toString(BYTE_TO_STRING_ENCODING));
                }
            });
        });
    });
}
exports.verifyPassword = verifyPassword;
const User = mongoose_1.model('user', UserSchema);
exports.default = User;
