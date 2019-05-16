import * as Joi from 'joi';

export const userValidator = {
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
