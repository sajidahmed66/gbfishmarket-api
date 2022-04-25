import { createConnection } from "typeorm";
import { RoleUser } from "../entities/RoleUser.entity";
import { User } from "../entities/User.entity";
import { Logo } from "../entities/Logo.entity";
import { Slider } from "../entities/Slider.entity";
import { CompanyProfile } from "../entities/CompanyProfile.entity";
import { TeamMember } from "../entities/TeamMember.entity";
import { Products } from "../entities/Products.entity";
import { Client } from "../entities/Clients.entity";
import { Announcement } from "../entities/Announcemant.entity";

export const main = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
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
      ],
      synchronize: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    // throw new Error("Unable to connect to database");
  }
};
