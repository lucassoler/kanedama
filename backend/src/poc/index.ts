import { ok } from "assert";
import Fastify, { FastifyRequest } from "fastify";

const pg = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "password",
    searchPath: ["knex", "public"],
  },
});

async function insert() {
  console.log("migrating 🚀");
  try {
    await pg.raw(`CREATE TABLE Persons (
    PersonID int,
    name varchar(255),
    email varchar(255),
    password varchar(255),
    city varchar(255)
);`);
  } catch (error) {
    console.info(error);
  }
}
insert();

Fastify({})
  .route({
    method: "GET",
    url: "/health",
    handler: async (request, response) => {response.send()},
  })
  .route({
    method: "GET",
    url: "/registrtion",
    schema: {
      querystring: {
        name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
      },
    },
    handler: async (request : FastifyRequest<{ Querystring: { name: string, email: string } }>, reply) => {
      console.log('ici')
      const query = request.query
      ok(
        (request.query["name"].length > 4 &&
          request.query["name"].length < 50) ||
          (request.query["email"].includes("@") &&
            request.query["email"].length < 256)
      );
      pg("persons").insert(request.query).then(reply.send({}));
    },
  })
  .route({
    method: "GET",
    url: "/login",
    schema: {
      querystring: {
        email: { type: "string" },
        password: { type: "string" },
      },
      response: {
        200: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
      },
    },
    handler: (request: FastifyRequest<{ Querystring: { email: string, password: string }, Reply: string }>, reply) =>
      pg("persons")
        .where({
          email: request.query["email"],
          password: request.query["password"],
        })
        .first("name")
        .then((result: string) => {
          reply.send(result);
        }),
  })
  .listen(3000);
