import { ExpressServer } from "../../../configuration/express/ExpressServer";
import { serviceLocator } from "../../../configuration/services/serviceLocator";
import http from 'http';

export class ExpressServerHelper {
    private server: http.Server = new ExpressServer().create(serviceLocator()).listen();

    stop() {
        this.server.close();
    }

    get(): http.Server {
        return this.server;
    }
}