import express, {Express} from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Dependencies } from '../services/serviceLocator';
import { ExpressMiddlewares } from './expressMiddlewares';
import { router } from './expressRouter';

  export class ExpressServer {
    constructor() {

    }

    create(services: Dependencies): Express {
        const server = express();

        server.set('port', process.env.API_PORT || 8801);
        server.use(helmet());

        if (process.env.NODE_ENV !== "production") {
            server.use(ExpressMiddlewares.prepareResponseHeader());
            server.use(cors());
        }

        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({extended: true}));

        server.use(ExpressMiddlewares.preErrorHandling());

        server.use('/api', router(services));

        server.use(ExpressMiddlewares.domainErrorHandling());
        server.use(ExpressMiddlewares.notCatchedExceptions());

        return server;
    }
}