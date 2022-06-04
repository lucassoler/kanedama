import { DataSource } from "typeorm";
import { EnvironmentVariables } from "../environment/environmentVariables";

export const getDataSource = (environmentVariables: EnvironmentVariables) => {
    return new DataSource({
        type: "postgres",
        host: environmentVariables.POSTGRES_HOST,
        port: environmentVariables.POSTGRES_PORT,
        username: environmentVariables.POSTGRES_USERNAME,
        password: environmentVariables.POSTGRES_PASSWORD,
        database: environmentVariables.POSTGRES_DATABASE,
        synchronize: environmentVariables.POSTGRES_SYNCHRONIZE_AUTO,
        logging: environmentVariables.POSTGRES_LOGGING,
        entities: [environmentVariables.TYPEORM_ENTITIES],
        subscribers: [],
        migrations: [],
    });
}