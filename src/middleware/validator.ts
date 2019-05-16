import * as Joi from 'joi';
import Extend from 'extend';
import { Request, Response, NextFunction } from 'express';

const options = {
  // return an error if body has an unrecognised property
  allowUnknown: false,
  stripUnknown: true,
  // return all errors a payload contains, not just the first one Joi finds
  abortEarly: false,
};

export const validator = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const toValidate: any = {};
    if (!schema) {
      return next();
    }

    ['params', 'body', 'query'].forEach(key => {
      if (schema[key]) {
        toValidate[key] = req.body.key;
      }
    });

    const onValidationComplete = (err: Joi.ValidationError, validated: any) => {
      if (err) {
        const { details } = err;
        const message = details.map(i => i.message).join(',');
        return res.status(400).send({
          success: false,
          message,
          errors: details,
        });
      }
      // copy the validated data to the req object
      Extend(req, validated);
      return next();
    };
    return Joi.validate(toValidate, schema, options, onValidationComplete);
  };
};
