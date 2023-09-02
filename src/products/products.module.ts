import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity])
  ],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
