import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductorderModule } from '../productorder/productorder.module';
import { Product } from 'src/entities/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductorderModule],
  providers: [OrdersService],
  exports: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
