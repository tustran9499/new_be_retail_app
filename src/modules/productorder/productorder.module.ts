import { Module } from '@nestjs/common';
import { ProductorderService } from './productorder.service';
import { ProductOrder } from '../../entities/productorder/productorder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrder]), ProductsModule],
  providers: [ProductorderService],
  exports: [ProductorderService],
})
export class ProductorderModule { }
