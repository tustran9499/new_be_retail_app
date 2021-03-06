import { Controller, SetMetadata, UseGuards, Get, Query, ParseIntPipe, Post, Body, Put, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrderdiscountsService } from './orderdiscounts.service';
import { OrderDiscount } from 'src/entities/promotion/orderdiscount.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePromotionDto } from 'src/dto/promotion/CreatePromotion.dto';
import { CreateOrderDiscountDto } from 'src/dto/promotion/CreateOrderDiscount.dto';
import { UpdatePromotionDto } from 'src/dto/promotion/UpdatePromotion.dto';
import { UpdateOrderDiscountDto } from 'src/dto/promotion/UpdateOrderDiscount.dto';

@ApiTags('OrderDiscounts')
@Controller('orderdiscounts')
export class OrderdiscountsController {
    constructor(private OrderdiscountsService: OrderdiscountsService) { }

    @SetMetadata('roles', ['StoresManager', 'StoreManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
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

    @SetMetadata('roles', ['StoresManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Post()
    async createPromotion(
        @Body() model: CreateOrderDiscountDto,
    ): Promise<any> {
        return this.OrderdiscountsService.createOrderDiscount(model);
    }

    @SetMetadata('roles', ['StoresManager'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    @Put('/:id')
    async updatePromotion(@Param('id', ParseIntPipe) id: number,
        @Body() model: UpdateOrderDiscountDto,
    ): Promise<any> {
        return this.OrderdiscountsService.updatePromotion(id, model);
    }
}
