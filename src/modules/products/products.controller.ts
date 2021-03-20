import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
    constructor(private ProductsService: ProductsService) { }

    @Get()
    @ApiOkResponse()
    getProducts(): Promise<any> {
        return this.ProductsService.findAll();
    }

    @Get('/:id')
    @ApiOkResponse()
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.findOne(id);
    }
}
