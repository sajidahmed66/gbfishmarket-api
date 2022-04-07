import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Products } from "./Products.entity";

@Entity("client")
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  company_name: string;

  @Column()
  location_lat: number;

  @Column()
  location_long: number;

  @Column()
  location_address: string;

  @Column()
  company_description: string;

  @Column()
  logo_image_name: string;

  @Column()
  logo_image_link: string;

  @OneToMany(() => Products, (products) => products.client)
  @JoinTable({
    name: "client_products",
    joinColumn: { name: "client", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product", referencedColumnName: "id" },
  })
  products: Products[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
