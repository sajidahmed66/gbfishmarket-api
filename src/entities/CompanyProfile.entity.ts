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

  @Column({ nullable: true })
  image_name: string;

  @Column({ nullable: true })
  image_link: string;

  @Column({ nullable: true })
  image_cloudinary_public_id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  short_description: string;

  @Column({ nullable: true })
  history_image_name: string;

  @Column({ nullable: true })
  history_image_link: string;

  @Column({ nullable: true })
  history_image_cloudinary_public_id: string;

  @Column({ nullable: true })
  history_title: string;

  @Column({ nullable: true })
  history_description: string;

  @Column({ nullable: true })
  history_short_description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
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
