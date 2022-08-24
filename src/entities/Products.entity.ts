import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { CategoryProducts } from "./CategoryProducts.entity";

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

  @ManyToOne(() => CategoryProducts, (category) => category.products, {
    nullable: true,
  })
  category: CategoryProducts;

  @ManyToOne(() => Client, (client) => client.products, {
    nullable: true,
  })
  client: Client;

  // client: Client;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
