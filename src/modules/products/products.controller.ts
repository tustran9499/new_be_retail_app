import { Controller, Get, Param, ParseIntPipe, Query, SetMetadata, UseGuards, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Product } from 'src/entities/product/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { CreateProductDto } from 'src/dto/product/CreateProduct.dto';
import { UpdateProductDto } from 'src/dto/product/UpdateProduct.dto.';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
    constructor(private ProductsService: ProductsService) { }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get()
    @ApiOkResponse()
    getProducts(): Promise<any> {
        return this.ProductsService.findAll();
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
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

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/searchProducts')
    async search(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Query('key') key: string = "",
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;
        return this.ProductsService.searchProduct(key,
            {
                page,
                limit,
                route: 'http://localhost:4000/api/products/allProducts',
            });
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createProduct(
        @Body() model: CreateProductDto,
    ): Promise<Product> {
        return this.ProductsService.createProduct(model);
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Put('/:id')
    async updateProduct(@Param('id', ParseIntPipe) id: number,
        @Body() model: UpdateProductDto,
    ): Promise<Product> {
        return this.ProductsService.updateProduct(id, model);
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get('/:id')
    @ApiOkResponse()
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.findOne(id);
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Delete('/:id')
    @ApiOkResponse()
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.ProductsService.deleteProduct(id);
    }
}
