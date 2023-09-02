import { ProductEntity } from '../../products/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;
  
  @ManyToMany(() => ProductEntity, (product) => product.id)
  @JoinTable()
  orders: ProductEntity[];
}
