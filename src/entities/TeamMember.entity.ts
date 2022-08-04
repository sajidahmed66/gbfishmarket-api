import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { CompanyProfile } from "./CompanyProfile.entity";
@Entity()
export class TeamMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  designation: string;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  cloudinary_public_id: string;

  @ManyToOne(
    () => CompanyProfile,
    (companyProfile) => companyProfile.teamMember,
    { nullable: false }
  )
  companyProfile: CompanyProfile;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
