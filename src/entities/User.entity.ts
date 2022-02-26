import {
  Column,
  PrimaryColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm";

import { RoleUser } from "./RoleUser";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => RoleUser)
  @JoinColumn()
  role_id: RoleUser;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
