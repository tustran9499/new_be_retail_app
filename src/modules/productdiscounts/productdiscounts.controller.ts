import { Controller, SetMetadata, UseGuards, Get, Query, ParseIntPipe, Post, Body, Put, Param, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductdiscountsService } from './productdiscounts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateProductDiscountDto } from 'src/dto/promotion/CreateProductDiscount.dto';
import { UpdateProductDiscountDto } from 'src/dto/promotion/UpdateProductDiscount.dto';

@ApiTags('ProductDiscounts')
@Controller('productdiscounts')
export class ProductdiscountsController {
    constructor(private ProductdiscountsService: ProductdiscountsService) { }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get()
    async index(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
        @Request() req,
    ): Promise<Pagination<any>> {
        limit = limit > 100 ? 100 : limit;
        return this.ProductdiscountsService.paginate(req.user.userId, {
            page,
            limit,
            route: '/api/productdiscounts',
        });
    }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createPromotion(
        @Body() model: CreateProductDiscountDto,
        @Request() req,
    ): Promise<any> {
        return this.ProductdiscountsService.createProductDiscount(req.user.userId, model);
    }

    @SetMetadata('roles', ['StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Put('/:id')
    async updatePromotion(@Param('id', ParseIntPipe) id: number,
        @Body() model: UpdateProductDiscountDto,
    ): Promise<any> {
        return this.ProductdiscountsService.updatePromotion(id, model);
    }
}
