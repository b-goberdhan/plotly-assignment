import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductDto } from 'src/products/dto/product.dto';

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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age
    }
  }


  async findAll() : Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserDto> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDto> {
   
    const userToBeUpdated =  await this.userRepository.findOneBy({ id });
    const productsToUpdate = await this.findAssociatedProducts(updateUserInput.orderIds)
    console.log(productsToUpdate)
    userToBeUpdated.age = updateUserInput.age || userToBeUpdated.age;
    userToBeUpdated.email = updateUserInput.email || userToBeUpdated.email;
    userToBeUpdated.name = updateUserInput.name || userToBeUpdated.name;
    // userToBeUpdated.orders = productsToUpdate || userToBeUpdated.orders

    const savedUser = await this.userRepository.save(userToBeUpdated);
    console.log(savedUser)
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      age: savedUser.age
    };
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
}
