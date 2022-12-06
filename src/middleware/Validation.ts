import Joi, { ObjectSchema } from 'joi';
import joiDate from '@joi/date';
const joi = Joi.extend(joiDate) as typeof Joi;
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logs';
import { Cost } from '../models/Cost';

export const Validation = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    cost: {
        create: joi.object<Cost>({
            name: joi.string().max(100).required(),
            added: joi.date().format('YYYY-MM-DD').required(),
            brutto: joi.number().required(),
            netto: joi.number().required()
        }),
        update: joi.object<Cost>({
            name: joi.string().max(100).required(),
            added: joi.date().format('YYYY-MM-DD').required(),
            brutto: joi.number().required(),
            netto: joi.number().required()
        })
    }
};
