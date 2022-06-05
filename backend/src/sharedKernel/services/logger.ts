import winston from "winston";
import {Express} from "express";
import expressWinston from "express-winston";
import { EnvironmentVariables } from "../../configuration/environment/environmentVariables";

export interface Logger {
    expressLogger(expressServer: Express): void;
    error(message: string, datas: { [key: string]: string }): void;
    info(message: string, datas: { [key: string]: string; }): void;
}

export class WinstonLogger implements Logger {
    private logger: winston.Logger;

    readonly loggerOptions = {
        transports: [
            new winston.transports.Console()
        ],
        level: this.environmentVariables.LOG_LEVEL || 'info',
        silent: this.environmentVariables.LOG_SILENT
    }
    
    constructor(private readonly environmentVariables: EnvironmentVariables) {
        this.logger = winston.createLogger(this.loggerOptions);
    }

    expressLogger(expressServer: Express): void {
        if (this.loggerOptions.silent) return;
        
        expressServer.use(expressWinston.logger({
            ...this.loggerOptions,
            level: 'info',
            msg: "REQUEST :: [statusCode:{{res.statusCode}}][method:{{req.method}}][responseTime:{{res.responseTime}}ms][url:{{req.path}}]"
        }));
    }
    
    error(message: string, datas: { [key: string]: string; }): void {
        this.logger.error(message, datas);
    }

    info(message: string, datas: { [key: string]: string; }): void {
        this.logger.info(message, datas);
    }
}