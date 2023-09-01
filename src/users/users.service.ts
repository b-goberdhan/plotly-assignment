import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UserDeletedDto } from './dto/user-deleted.dto';
import { ProductDto } from 'src/products/dto/product.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private productService: ProductsService
  ) {}
  
  async create(createUserInput: CreateUserInput): Promise<UserDto> {
    const user = await this.userRepository.save({...createUserInput});
    return user as UserDto;
  }

  async findAll() : Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserDto> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDto> {
    const userToBeUpdated =  await this.userRepository.findOneBy({ id });
    userToBeUpdated.age = updateUserInput.age;
    userToBeUpdated.email = updateUserInput.email;
    userToBeUpdated.name = updateUserInput.name;

    const savedUser = await this.userRepository.save(userToBeUpdated);
    return savedUser as UserDto;
  }

  async addProductToUser(id: string, productId: string) : Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    const productDto = await this.productService.findOne(productId);
    if (!user.orders) {
      user.orders = []
    }
    user.orders.push(productDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) : Promise<UserDeletedDto> {
    const deleteResult = await this.userRepository.delete({ id });
    return { isDeleted: deleteResult.affected === 1 }
  }
}
