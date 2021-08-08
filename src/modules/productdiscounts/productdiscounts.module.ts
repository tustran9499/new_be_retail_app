import { Module } from '@nestjs/common';
import { ProductdiscountsController } from './productdiscounts.controller';
import { ProductdiscountsService } from './productdiscounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDiscount } from 'src/entities/promotion/productdiscount.entity';
import { PromotionsModule } from '../promotions/promotions.module';
import { AccountsModule } from '../account/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDiscount]), PromotionsModule, AccountsModule],
  controllers: [ProductdiscountsController],
  providers: [ProductdiscountsService],
  exports: [ProductdiscountsService],
})
export class ProductdiscountsModule { }
