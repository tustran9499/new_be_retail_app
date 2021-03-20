import { Controller, Get, Param, ParseIntPipe, Query, SetMetadata, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { CreateProductDto } from 'src/dto/product/CreateProduct.dto';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
    constructor(private ProductsService: ProductsService) { }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get()
    @ApiOkResponse()
    getProducts(): Promise<any> {
        return this.ProductsService.findAll();
    }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/paginateProducts')
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

    @Post()
    async createAccount(
        @Body() model: CreateProductDto,
    ): Promise<Product> {
        return this.ProductsService.createProduct(model);
    }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/:id')
    @ApiOkResponse()
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.findOne(id);
    }
}
