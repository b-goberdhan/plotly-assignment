import { UserEntity } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
  name: string;
  
  @Column({type: 'decimal'})
  price: number;

  @ManyToMany(() => UserEntity, (user) => user.orders)
  users?: UserEntity[];
}
