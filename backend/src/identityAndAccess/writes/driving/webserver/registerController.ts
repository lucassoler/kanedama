import {Request, Response} from 'express';
import { Dependencies } from '../../../../configuration/services/serviceLocator';
import { RegisterUserCommand } from '../../usecases/RegisterUserCommand';
import {checkSchema, ValidationChain} from 'express-validator';
import { registerUserSchema } from './schema/registerUserSchema';

export const registerUserValidator = (): ValidationChain[] => {
    return checkSchema(registerUserSchema());
}

export const registerController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        await services.commandDispatcher.dispatch(new RegisterUserCommand(request.body.name, request.body.email, request.body.password));
        response.status(200).json({});
    }
}