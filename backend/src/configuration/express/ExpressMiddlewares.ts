import { NextFunction, Request, Response } from "express";
import {validationResult} from "express-validator";
import createError, { HttpError } from 'http-errors';
import { DomainError, DomainNotFoundError, DomainValidationError } from "../../sharedKernel/domainError";

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

    static domainErrorHandling() {
        return (error: DomainError, request: Request, response: Response, next: NextFunction): Response => {
            let httpError: HttpError = new createError.InternalServerError("Internal Server Error");

            if (error instanceof DomainValidationError)
                httpError = new createError.BadRequest(error.message);
            else if (error instanceof DomainNotFoundError)
                httpError = new createError.NotFound(error.message);

            const responseBody: CustomErrorResponse = {
                status_code: httpError.statusCode,
                error_code: error.code || null,
                error_name: httpError.name.replace('Error', ''),
                message: httpError.message
            };

            if (error.innerExceptions.length > 0) {
                responseBody.errors = error.innerExceptions.map(e => {
                    return {
                        code: e.code,
                        message: e.message
                    };
                })
            }

            return response.status(httpError.statusCode).send(responseBody);
        }
    }

    static notCatchedExceptions() {
        return (error: DomainError, request: Request, response: Response, next: NextFunction): Response => {
            let httpError: HttpError = new createError.InternalServerError("Internal Server Error");

            const responseBody: CustomErrorResponse = {
                status_code: httpError.statusCode,
                error_code: error.code || null,
                error_name: httpError.name.replace('Error', ''),
                message: httpError.message
            };
            return response.status(httpError.statusCode).send(responseBody);
        }
    }
}

type CustomErrorResponse = {
    status_code: number,
    error_code: string | null,
    error_name: string,
    message: string,
    errors?: Array<{ code: string, message: string }>
}