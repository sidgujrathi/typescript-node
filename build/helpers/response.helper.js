"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHelper {
    static successResponse(docs) {
        if (Array.isArray(docs)) {
            return { success: true, items: docs };
        }
        else {
            return { success: true, item: docs };
        }
    }
    static errorResponse(error) {
        if (error.hasOwnProperty('message')) {
            return { success: false, error: error.message };
        }
        else {
            return { success: false, error };
        }
    }
}
exports.ResponseHelper = ResponseHelper;
