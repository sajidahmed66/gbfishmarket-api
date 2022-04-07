import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { RoleUser } from "./RoleUser.entity";
import * as jwt from "jsonwebtoken";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleUser, (role) => role.user, {
    cascade: true,
    nullable: false,
  })
  role: RoleUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // method to generate a jwt token

  generateAuthToken = () => {
    return jwt.sign(
      {
        id: this.id,
        name: this.name,
        email: this.email,
        role: this.role,
      },
      "JWT_SECRET",
      { expiresIn: "12h" }
    );
  };
}
