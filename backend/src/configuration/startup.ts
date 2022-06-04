import dotenv from "dotenv";
import { ExpressServer } from "./express/ExpressServer";
import { serviceLocator } from "./services/serviceLocator";
import { getDataSource } from "./typeorm/connection";
import "reflect-metadata"

dotenv.config();

const services = serviceLocator();

getDataSource(services.environmentVariables).initialize()
    .then(() => {
      const expressServer = new ExpressServer().create(services);
      
      const server = expressServer.listen(expressServer.get("port"), () => {
        console.info(`Application starts on port ${expressServer.get("port")}`, { type: "SYSTEM" });
      });

      process.on("SIGTERM", () => {
        console.warn("Application stopped", { type: "SYSTEM" });
          server.close((error) => {
              if (error) {
                  console.error(error.message, { type: "SYSTEM" });
                  process.exit(1);
              }
      
              process.exit(0);
          });
      });
    })
    .catch((error: Error) => console.log(error));