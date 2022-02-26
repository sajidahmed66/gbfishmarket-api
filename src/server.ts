import "dotenv/config";
import express, { Application } from "express";
// import { db_connect } from "./utils/dbConfig";
import { routes } from "./middlewares/route";

import { createConnection } from "typeorm";
import { User } from "./entities/User.entity";
import { RoleUser } from "./entities/RoleUser";

const db_connect = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [RoleUser, User],
      synchronize: true,
    });
    // await connection.synchronize();
    console.log("Connected to Postgres");
  } catch (error) {
    console.log("failed to connect to database " + error);
  }
};
const app: Application = express();
routes(app);
db_connect();
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
