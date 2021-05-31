import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion/promotion.entity';
import { Repository } from 'typeorm';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { CreatePromotionDto } from 'src/dto/promotion/CreatePromotion.dto';
import { UpdatePromotionDto } from 'src/dto/promotion/UpdatePromotion.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';

@Injectable()
export class PromotionsService {
    constructor(
        @InjectRepository(Promotion)
        private promotionRepository: Repository<Promotion>,
    ) { }

    async createPromotion(model: CreatePromotionDto): Promise<Promotion> {
        return await this.promotionRepository.save(model);
    }

    async updatePromotion(id: number, model: UpdatePromotionDto): Promise<any> {
        try {
            const result = await this.promotionRepository.save({ ...model, Coupon: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
