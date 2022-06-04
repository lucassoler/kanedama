import {Request, Response} from 'express';
import { Dependencies } from '../../../../configuration/services/serviceLocator';
import { RegisterUserCommand } from '../../usecases/RegisterUserCommand';
import {checkSchema, ValidationChain} from 'express-validator';
import { registerUserSchema } from './schema/registerUserSchema';
import { UserInvalid } from '../../domain/errors/UserInvalid';
import createError, { HttpError } from 'http-errors';

export const registerUserValidator = (): ValidationChain[] => {
    return checkSchema(registerUserSchema());
}

export const registerController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        try {
            await services.commandDispatcher.dispatch(new RegisterUserCommand(request.body.name, request.body.email, request.body.password));
            response.status(200).json({});
        } catch (error) {
            let httpError: HttpError = new createError.InternalServerError();

            if (error instanceof UserInvalid) {
                httpError = new createError.BadRequest();
                response.status(httpError.status).send({
                    status_code: httpError.status,
                    error_name: httpError.name.replace("Error", ""),
                    errors: error.errors.map(e => {
                        return {
                            code: e.code,
                            message: e.message
                        };
                    })
                });
            } else {
                response.status(httpError.status).send({
                    status_code: httpError.status,
                    error_name: "Internal Server Error",
                });
            }
        }
    }
}