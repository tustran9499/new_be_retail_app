import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion/promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule { }
