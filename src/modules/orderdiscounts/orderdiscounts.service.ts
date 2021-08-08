import { Injectable, HttpStatus } from '@nestjs/common';
import { PromotionsService } from '../promotions/promotions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { Repository } from 'typeorm';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';
import { IPaginationOptions, Pagination, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import { Promotion } from 'src/entities/promotion/promotion.entity';
import { UpdateOrderDiscountDto } from 'src/dto/promotion/UpdateOrderDiscount.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';

@Injectable()
export class OrderdiscountsService {
    constructor(
        @InjectRepository(OrderDiscount)
        private orderdiscountsRepository: Repository<OrderDiscount>,
        private promotionsService: PromotionsService,
    ) { }

    async createOrderDiscount(model: CreateOrderDiscountDto): Promise<boolean> {
        try {
            const promotion = await this.promotionsService.createPromotion(model);
            await this.orderdiscountsRepository.query("CreateOrderDiscount @Coupon=" + promotion.Coupon + ",@MinBill=" + model.MinBill + ",@MaxDiscount=" + model.MaxDiscount);
            return true;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<any>> {
        const queryBuilder = this.orderdiscountsRepository.createQueryBuilder('orderdiscounts').innerJoinAndSelect(Promotion, "promotions", "promotions.Coupon=orderdiscounts.Coupon").orderBy('promotions.StartTime', 'ASC');
        return paginateRaw<any>(queryBuilder, options);
    }

    async updatePromotion(id: number, model: UpdateOrderDiscountDto): Promise<any> {
        try {
            await this.promotionsService.updatePromotion(id, model);
            const result = await this.orderdiscountsRepository.save({ ...model, Coupon: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

}
