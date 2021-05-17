import { Controller, SetMetadata, UseGuards, Get, Query, ParseIntPipe, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrderdiscountsService } from './orderdiscounts.service';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePromotionDto } from 'src/dto/promotion/CreatePromotion.dto';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';

@ApiTags('OrderDiscounts')
@Controller('orderdiscounts')
export class OrderdiscountsController {
    constructor(private OrderdiscountsService: OrderdiscountsService) { }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Get()
    async index(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<any>> {
        limit = limit > 100 ? 100 : limit;
        return this.OrderdiscountsService.paginate({
            page,
            limit,
            route: '/api/orderdiscounts',
        });
    }

    // @SetMetadata('roles', ['StoreManager'])
    // @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createPromotion(
        @Body() model: CreateOrderDiscountDto,
    ): Promise<any> {
        return this.OrderdiscountsService.createOrderDiscount(model);
    }
}
