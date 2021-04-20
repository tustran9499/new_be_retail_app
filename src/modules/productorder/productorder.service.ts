import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrder } from 'src/entities/productorder/productorder.entity';
import { Repository } from 'typeorm';
import { CreateProductOrderDto } from 'src/dto/productorder/CreateProductOrder.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';

@Injectable()
export class ProductorderService {
    constructor(
        @InjectRepository(ProductOrder)
        private productorderRepository: Repository<ProductOrder>,
    ) { }

    async createProductOrder(model: CreateProductOrderDto): Promise<ProductOrder> {
        try {
            const result = await this.productorderRepository.save(model);
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
