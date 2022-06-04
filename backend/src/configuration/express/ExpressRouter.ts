import { Router } from "express";
import { systemEndpoints } from "../../system/configuration/endpoints";
import { Dependencies } from "../services/serviceLocator";

export const router = (services: Dependencies): Router => {
    const router = Router();

    systemEndpoints(router, services);

    return router;
}