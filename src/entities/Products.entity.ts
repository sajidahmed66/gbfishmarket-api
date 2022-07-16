import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { Client } from "./Clients.entity";
@Entity("products")
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  short_description: string;

  @Column()
  long_description: string;

  @Column()
  image_name: string;

  @Column()
  image_link: string;

  @Column()
  cloudinary_public_id: string;

  @Column()
  show_on_home: boolean;

  @ManyToOne(() => Client, (client) => client.products, {
    cascade: true,
    nullable: true,
  })
  client: Client;

  // client: Client;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
