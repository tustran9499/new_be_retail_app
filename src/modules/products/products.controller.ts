import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product/product.entity';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
    constructor(private ProductsService: ProductsService) { }

    @Get()
    @ApiOkResponse()
    getProducts(): Promise<any> {
        return this.ProductsService.findAll();
    }

    @Get('/allProducts')
    async index(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.ProductsService.paginate({
            page,
            limit,
            route: 'http://localhost:4000/api/products/allProducts',
        });
    }

    @Get('/:id')
    @ApiOkResponse()
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.findOne(id);
    }
}
