// import { createConnection } from "typeorm";
// import { User } from "../entities/User.entity";
// import { RoleUser } from "../entities/RoleUser";

// export const db_connect = async () => {
//   try {
//     await createConnection({
//       type: "postgres",
//       host: process.env.POSTGRES_HOST,
//       port: Number(process.env.POSTGRES_PORT),
//       username: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       database: process.env.POSTGRES_DATABASE,
//       entities: [RoleUser],
//       synchronize: true,
//     });
//     console.log("Connected to Postgres");
//   } catch (error) {
//     console.log("failed to connect to database " + error);
//   }
// };
