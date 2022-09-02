import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Announcement } from "./Announcement.entity";
import { CategoryProducts } from "./CategoryProducts.entity";

@Entity("category_announcement")
export class CategoryAnnouncements extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  cloudinary_public_id: string;

  @Column()
  show_on_home: boolean;
  
  @OneToMany(() => Announcement, (announcement) => announcement.announcement_category, {
    cascade: true,
    onDelete: "CASCADE",
  })
  announcements: Announcement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
