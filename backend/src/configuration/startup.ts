import dotenv from "dotenv";
import { ExpressServer } from "./express/ExpressServer";
import { serviceLocator } from "./services/serviceLocator";

dotenv.config();

const services = serviceLocator();

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