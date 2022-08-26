import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Announcement } from "./Announcement.entity";

@Entity("category_announcements")
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

  @OneToMany(() => Announcement, (announcement) => announcement.announcementCategory, {
    cascade: true,
    onDelete: "CASCADE",
  })
  announcement: Announcement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
