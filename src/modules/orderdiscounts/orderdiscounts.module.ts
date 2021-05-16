import { Module } from '@nestjs/common';
import { OrderdiscountsController } from './orderdiscounts.controller';
import { OrderdiscountsService } from './orderdiscounts.service';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDiscount]), PromotionsModule],
  controllers: [OrderdiscountsController],
  exports: [OrderdiscountsService],
  providers: [OrderdiscountsService]
})
export class OrderdiscountsModule { }
