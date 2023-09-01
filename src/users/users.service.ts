import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}
  
  async create(createUserInput: CreateUserInput): Promise<UserDto> {
    
    const user = await this.userRepository.save({
      name: createUserInput.name,
      email: createUserInput.email,
      age: createUserInput.age,
      orders: await this.findAssociatedProducts(createUserInput.orderIds)
    });

    return this.userToDto(user);
  }


  async findAll() : Promise<UserDto[]> {
    const users = await this.userRepository.find({relations: {
      orders: true
    }});

    return users.map(this.userToDto);
  }

  async findOne(id: string): Promise<UserDto> {
    return this.userRepository.findOneBy({ id });
  }

  async update(updateUserInput: UpdateUserInput): Promise<UserDto> {
   
    const userToBeUpdated =  await this.userRepository.findOneBy({ id: updateUserInput.id });
    const newAssociatedProducts = await this.findAssociatedProducts(updateUserInput.orderIds)

    userToBeUpdated.age = updateUserInput.age || userToBeUpdated.age;
    userToBeUpdated.email = updateUserInput.email || userToBeUpdated.email;
    userToBeUpdated.name = updateUserInput.name || userToBeUpdated.name;
    userToBeUpdated.orders = newAssociatedProducts || userToBeUpdated.orders

    const savedUser = await this.userRepository.save(userToBeUpdated);

    return this.userToDto(savedUser);
  }

  async remove(id: string) : Promise<UserDeletedDto> {
    const deleteResult = await this.userRepository.delete({ id });
    return { isDeleted: deleteResult.affected === 1 }
  }

  private async findAssociatedProducts(productIds: string[]) : Promise<Product[] | undefined > {
    let products;
    if (productIds && productIds.length > 0) {
      products = await this.productRepository.find({
        where: {
          id: In(productIds)
        }
      })
    }
    return products;
  }

  private userToDto(user: User): UserDto {
    return ({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      orders: user.orders?.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price
      })) || []
    })
  }
}
