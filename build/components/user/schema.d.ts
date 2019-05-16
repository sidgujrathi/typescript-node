import * as Joi from 'joi';
export declare const userValidator: {
    create: {
        body: {
            firstName: Joi.StringSchema;
            lastName: Joi.StringSchema;
            email: Joi.StringSchema;
            password: Joi.StringSchema;
        };
    };
    resetPassword: {
        params: {
            token: Joi.StringSchema;
        };
    };
    changePassword: {
        body: {
            old_password: Joi.StringSchema;
            new_password: Joi.StringSchema;
            confirm_password: Joi.AnySchema;
        };
    };
};
