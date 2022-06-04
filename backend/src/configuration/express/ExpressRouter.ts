import { Router } from "express";
import { Dependencies } from "../services/serviceLocator";

export const router = (services: Dependencies): Router => {
    const router = Router();

    return router;
}