import { LoginCommand, LoginCommandResponse } from "../../usecases/LoginCommand";
import {Request, Response} from 'express';
import { Dependencies } from "../../../../configuration/services/serviceLocator";

export const loginController = (services: Dependencies) => {
    return async (request: Request, response: Response) => {
        const result = await services.commandDispatcher.dispatch<LoginCommandResponse>(new LoginCommand(request.body.login, request.body.password));

        response.status(200).json({
            name: result.name
        });
    }
}