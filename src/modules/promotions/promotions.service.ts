import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion/promotion.entity';
import { Repository } from 'typeorm';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { CreatePromotionDto } from 'src/dto/promotion/CreatePromotion.dto';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private promotionRepository: Repository<Promotion>,
    ) { }

    async createPromotion(model: CreatePromotionDto): Promise<Promotion> {
        return await this.promotionRepository.save(model);
    }
}
