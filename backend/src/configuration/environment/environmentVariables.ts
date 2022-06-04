export interface EnvironmentVariables {
    readonly NODE_ENV: string;
    readonly API_PORT: string;
    readonly POSTGRES_HOST: string;
    readonly POSTGRES_PORT: number;
    readonly POSTGRES_USERNAME: string;
    readonly POSTGRES_PASSWORD: string;
    readonly POSTGRES_DATABASE: string;
    readonly POSTGRES_SYNCHRONIZE_AUTO: boolean;
    readonly POSTGRES_LOGGING: boolean;
    readonly TYPEORM_ENTITIES: string;
    readonly SALT_ROUNDS: number;
    readonly LOG_LEVEL: string;
}


export class NodeEnvironmentVariables implements EnvironmentVariables {
    readonly NODE_ENV = this.getStringOrError("NODE_ENV");
    readonly API_PORT = this.getStringOrError("API_PORT");
    readonly POSTGRES_HOST = this.getStringOrError("POSTGRES_HOST");
    readonly POSTGRES_PORT = this.getNumberOrError("POSTGRES_PORT");
    readonly POSTGRES_USERNAME = this.getStringOrError("POSTGRES_USERNAME");
    readonly POSTGRES_PASSWORD = this.getStringOrError("POSTGRES_PASSWORD");
    readonly POSTGRES_DATABASE = this.getStringOrError("POSTGRES_DATABASE");
    readonly POSTGRES_SYNCHRONIZE_AUTO = this.getBooleanOrError("POSTGRES_SYNCHRONIZE_AUTO");
    readonly POSTGRES_LOGGING = this.getBooleanOrError("POSTGRES_LOGGING");
    readonly TYPEORM_ENTITIES = this.getStringOrError("TYPEORM_ENTITIES");
    readonly SALT_ROUNDS = this.getNumberOrError("SALT_ROUNDS");
    readonly LOG_LEVEL = this.getStringOrError("LOG_LEVEL");

    private getStringOrError(value: string): string {
        return this.getEnvValue(value);
    }

    private getBooleanOrError(value: string): boolean {
        return this.getEnvValue(value) === "true";
    }
    private getNumberOrError(value: string): number {
        return Number.parseInt(this.getEnvValue(value));
    }
    
    private getEnvValue(value: string) {
        const result = process.env[value];
        if (result === undefined)
            throw new Error(`${value} not implemented in env`);
        return result;
    }
}