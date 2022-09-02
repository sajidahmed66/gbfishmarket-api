import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { CategoryAnnouncements } from "./CategoryAnnouncements.entity";
import { CategoryProducts } from "./CategoryProducts.entity";

@Entity("announcement")
export class Announcement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  short_description: string;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  cloudinary_public_id: string;

  @Column()
  show_on_home: boolean;
  
  @ManyToOne(() => CategoryAnnouncements, (category) => category.announcements, {
    nullable: true,
  })
  announcement_category: CategoryAnnouncements;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
