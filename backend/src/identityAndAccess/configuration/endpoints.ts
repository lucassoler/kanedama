import asyncHandler from "express-async-handler";
import { Router } from "express";
import { Dependencies } from "../../configuration/services/serviceLocator";
import { registerController, registerUserValidator } from "../writes/driving/webserver/registerController";
import { ExpressMiddlewares } from "../../configuration/express/expressMiddlewares";
import { loginController } from "../writes/driving/webserver/loginController";

export const identityAndAccessEndpoints= (router: Router, services: Dependencies): void => {
    router.post('/identity/register', registerUserValidator(), ExpressMiddlewares.preErrorHandling(), asyncHandler(registerController(services)));
    router.post('/identity/login', asyncHandler(loginController(services)));
}