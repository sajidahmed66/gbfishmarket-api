import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Products } from "./Products.entity";

@Entity("category_products")
export class CategoryProducts extends BaseEntity {
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

  @OneToMany(() => Products, (products) => products.category, {
    cascade: true,
    onDelete: "CASCADE",
  })
  products: Products[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
