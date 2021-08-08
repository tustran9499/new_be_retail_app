import { Injectable, HttpStatus } from '@nestjs/common';
import { PromotionsService } from '../promotions/promotions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDiscount } from 'src/entities/promotion/productdiscount.entity';
import { Repository } from 'typeorm';
import { CreateProductDiscountDto } from 'src/dto/promotion/CreateProductDiscount.dto';
import { IPaginationOptions, Pagination, paginateRaw } from 'nestjs-typeorm-paginate';
import { Promotion } from 'src/entities/promotion/promotion.entity';
import { UpdateProductDiscountDto } from 'src/dto/promotion/UpdateProductDiscount.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { AccountsService } from '../account/accounts.service';

@Injectable()
export class ProductdiscountsService {
    constructor(
        @InjectRepository(ProductDiscount)
        private productdiscountsRepository: Repository<ProductDiscount>,
        private promotionsService: PromotionsService,
        private accountService: AccountsService,
    ) { }

    async createProductDiscount(model: CreateProductDiscountDto): Promise<ProductDiscount> {
        const promotion = await this.promotionsService.createPromotion(model);
        return await this.productdiscountsRepository.query("CreateProductDiscount @Coupon=" + promotion.Coupon + ",@ProductId=" + model.ProductId + ",@StoreId=" + model.StoreId);;
    }

    async paginate(id: number, options: IPaginationOptions): Promise<Pagination<any>> {
        const user = await this.accountService.findOneById(id);
        if (user && user.StoreId) {
            const queryBuilder = this.productdiscountsRepository.createQueryBuilder('productdiscounts').innerJoinAndSelect(Promotion, "promotions", "promotions.Coupon=productdiscounts.Coupon").where({ StoreId: user.StoreId }).orderBy('promotions.StartTime', 'ASC');
            return paginateRaw<any>(queryBuilder, options);
        }
        else {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, "You cannot see this content!");
        }
    }

    async updatePromotion(id: number, model: UpdateProductDiscountDto): Promise<any> {
        try {
            await this.promotionsService.updatePromotion(id, model);
            const result = await this.productdiscountsRepository.save({ ...model, Coupon: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
