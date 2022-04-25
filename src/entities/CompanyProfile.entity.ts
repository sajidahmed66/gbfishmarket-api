import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { TeamMember } from "./TeamMember.entity";

@Entity("company_profile")
export class CompanyProfile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  short_description: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;
  @OneToMany(() => TeamMember, (teamMember) => teamMember.companyProfile, {
    nullable: true,
  })
  teamMember: TeamMember[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
