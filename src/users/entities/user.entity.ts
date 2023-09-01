import { Product } from '../../products/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;
  
  @ManyToMany(() => Product, (product) => product.id)
  @JoinTable()
  orders: Product[];
}
