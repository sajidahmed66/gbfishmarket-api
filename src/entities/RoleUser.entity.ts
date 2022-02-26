import {
  Column,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from "typeorm";

@Entity("user_role")
export class RoleUser extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  user_role_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
