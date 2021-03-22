import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../entities/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule { }
