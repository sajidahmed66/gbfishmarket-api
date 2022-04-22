import { createConnection } from "typeorm";
import { RoleUser } from "../entities/RoleUser.entity";
import { User } from "../entities/User.entity";
import { Logo } from "../entities/Logo.entity";

export const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [RoleUser, User, Logo],
      synchronize: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    // throw new Error("Unable to connect to database");
  }
};
