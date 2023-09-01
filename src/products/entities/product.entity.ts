import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
  name: string;
  
  @Column({type: 'decimal', precision: 2})
  price: number;

  @ManyToMany(() => User, (user) => user.orders)
  users?: User[];
}
