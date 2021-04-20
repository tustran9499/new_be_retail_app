import { Module } from '@nestjs/common';
import { ProductorderService } from './productorder.service';
import { ProductOrder } from '../../entities/productorder/productorder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrder])],
  providers: [ProductorderService],
  exports: [ProductorderService],
})
export class ProductorderModule { }
