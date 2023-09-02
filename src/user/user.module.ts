import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductModule } from '../product/product.module';
import { ProductEntity } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
    ProductModule
  ],
  providers: [
    UserResolver, 
    UserService
  ],
})
export class UserModule {}
