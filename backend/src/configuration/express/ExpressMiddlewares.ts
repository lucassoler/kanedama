import { NextFunction, Request, Response } from "express";
import {validationResult} from "express-validator";
import createError from 'http-errors';

export class ExpressMiddlewares {

    static preErrorHandling() {
        return (request: Request, response: Response, next: NextFunction): void => {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                let httpError = new createError.BadRequest();

                response.status(httpError.status).send({
                    status_code: httpError.status,
                    error_name: httpError.name.replace("Error", ""),
                    errors: errors.array().map(e => {
                        return {
                            param: e.param,
                            message: e.msg
                        };
                    })
                });
            } else {
                next();
            }
        }
    }
   static prepareResponseHeader() {
        return (request: Request, response: Response, next: NextFunction): void => {
            response.header("Access-Control-Allow-Credentials", "true");
            next();
        }
    }
}