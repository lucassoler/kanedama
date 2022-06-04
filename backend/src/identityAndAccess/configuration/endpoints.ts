import asyncHandler from "express-async-handler";
import { Router } from "express";
import { Dependencies } from "../../configuration/services/serviceLocator";
import { registerController } from "../writes/driving/webserver/registerController";

export const identityAndAccessEndpoints= (router: Router, services: Dependencies): void => {
    router.post('/identity/register', asyncHandler(registerController()));
}