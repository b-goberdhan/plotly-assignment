import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductsModule } from '../products/products.module';
import { ProductEntity } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    ProductsModule
  ],
  providers: [
    UsersResolver, 
    UsersService
  ],
})
export class UsersModule {}
