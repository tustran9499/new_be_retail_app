import { Injectable } from '@nestjs/common';
import { PromotionsService } from '../promotions/promotions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { Repository } from 'typeorm';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';
import { IPaginationOptions, Pagination, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import { Promotion } from 'src/entities/promotion/promotion.entity';

@Injectable()
export class OrderdiscountsService {
    constructor(
        @InjectRepository(OrderDiscount)
        private orderdiscountsRepository: Repository<OrderDiscount>,
        private promotionsService: PromotionsService,
    ) { }

    async createOrderDiscount(model: CreateOrderDiscountDto): Promise<OrderDiscount> {
        const promotion = await this.promotionsService.createPromotion(model);
        return await this.orderdiscountsRepository.save({ ...model, Coupon: promotion.Coupon });
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<any>> {
        const queryBuilder = this.orderdiscountsRepository.createQueryBuilder('orderdiscounts').innerJoinAndSelect(Promotion, "promotions", "promotions.Coupon=orderdiscounts.Coupon").orderBy('promotions.StartTime', 'ASC');
        console.log(await queryBuilder.getRawMany());
        const result = await paginateRaw<any>(queryBuilder, options);
        console.log("------------------------------------------")
        console.log(result);
        return paginateRaw<any>(queryBuilder, options);
    }

}
