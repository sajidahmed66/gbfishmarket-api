import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("announcement")
export class Announcement extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @Column()
  // subtitle: string;

  @Column()
  short_description: string;

  // @Column()
  // long_description: string;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  show_on_home: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
