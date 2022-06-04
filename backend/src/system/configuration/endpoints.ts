import asyncHandler from "express-async-handler";
import { Router } from "express";
import { Dependencies } from "../../configuration/services/serviceLocator";
import { healthController } from "../reads/driving/webserver/healthController";

export const systemEndpoints= (router: Router, services: Dependencies): void => {
    router.get('/healthz', asyncHandler(healthController()));
}