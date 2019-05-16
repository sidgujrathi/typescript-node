"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchErrors = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    };
};
exports.notFound = (req, res, next) => {
    res.status(404).send({ success: false, error: 'endpoint not found' });
};
exports.validationErrors = (err, req, res, next) => {
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                const matchRegex = err.message.match(/index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i);
                if (matchRegex) {
                    const key = matchRegex.length ? matchRegex[1] : '';
                    const valueRegex = err.message.match(/key:\s+{\s+:\s\"(.*)(?=\")/);
                    const value = valueRegex ? valueRegex[1] : '';
                    return res
                        .status(409)
                        .send({ status: false, message: `${key} '${value}' already exists` });
                }
            }
        case 'CastError':
            return res.status(400).send({ status: false, message: err.message });
        case 'ValidationError':
            return res.status(400).send({ status: false, message: err.message });
        case 'MissingSchemaError':
            return res.status(500).send({ status: false, message: err.message });
        default:
            next(err);
    }
};
exports.developmentErrors = (err, req, res, next) => {
    res.status(500).send({ success: false, err: err.stack });
};
exports.productionErrors = (err, req, res, next) => {
    res.status(500).send({
        status: 'error',
        message: err.message,
        error: {},
    });
};
