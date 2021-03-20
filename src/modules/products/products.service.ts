import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product/product.entity';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateProductDto } from 'src/dto/product/CreateProduct.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { UpdateProductDto } from 'src/dto/product/UpdateProduct.dto.';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    findOne(id: number): Promise<Product> {
        return this.productsRepository.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
        return paginate<Product>(this.productsRepository, options);
    }

    async createProduct(model: CreateProductDto): Promise<Product> {
        try {
            const result = await this.productsRepository.save(model);
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async updateProduct(id: number, model: UpdateProductDto): Promise<Product> {
        try {
            const result = await this.productsRepository.save({ ...model, Id: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
