import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column()
  name: string;
  
  @Column({type: 'decimal', precision: 2})
  price: number;

  @ManyToMany(() => User, (user) => user.orders)
  users: User[];
}
