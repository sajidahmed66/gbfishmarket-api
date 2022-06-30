import { createConnection } from "typeorm";
import { RoleUser } from "../entities/RoleUser.entity";
import { User } from "../entities/User.entity";
import { Logo } from "../entities/Logo.entity";
import { Slider } from "../entities/Slider.entity";
import { CompanyProfile } from "../entities/CompanyProfile.entity";
import { TeamMember } from "../entities/TeamMember.entity";
import { Products } from "../entities/Products.entity";
import { Client } from "../entities/Clients.entity";
import { Announcement } from "../entities/Announcement.entity";
import { Message } from "../entities/ContactMessage.entity";

export const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST_LOCAL,
      port: Number(process.env.POSTGRES_PORT_LOCAL),
      username: process.env.POSTGRES_USER_LOCAL,
      password: process.env.POSTGRES_PASSWORD_LOCAL,
      database: process.env.POSTGRES_DB_LOCAL,
      entities: [
        RoleUser,
        User,
        Logo,
        Slider,
        CompanyProfile,
        TeamMember,
        Announcement,
        Client,
        Products,
        Message,
      ],
      synchronize: true,
      //comment out for local db/production
      // ssl: {
      //   rejectUnauthorized: false,
      //   requestCert: true,
      // },
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    // throw new Error("Unable to connect to database");
  }
};
