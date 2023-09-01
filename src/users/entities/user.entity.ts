import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string; //todo validate email regex

  @Column()
  age: number;
  
  @ManyToMany(() => Product, (product) => product.id)
  orders: Product[];
}
