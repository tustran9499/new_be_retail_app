import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dto/order/CreateOrder.dto';
import { UpdateOrderDto } from 'src/dto/order/UpdateOrder.dto.';
import { Order } from 'src/entities/order/order.entity';
import { GetRequest } from '../account/dto/GetRequest.dto';
import { OrdersService } from './orders.service';
import { CartProduct } from 'src/interfaces/cartproduct.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/id/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    return await this.ordersService.getById(id);
  }

  @Get('/promotion/:id')
  async getPromotion(
    @Param('id', ParseIntPipe) coupon: number,
    @Query('total') total: number = 0,
  ): Promise<Order> {
    return await this.ordersService.getPromotion(total, coupon);
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Get('/paginateOrders')
  async index(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Request() req
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.paginate({
      page,
      limit,
      route: '/api/orders/paginateOrders',
    }, req.user.userId);
  }

  @Get('/paginateOrdersBySession')
  async paginateBySession(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('key') key: string = "",
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.paginateBySession(key, {
      page,
      limit,
      route: '/api/orders/paginateOrders',
    });
  }

  @Get()
  @ApiOkResponse({})
  getCustomers(@Query() model: GetRequest): Promise<any> {
    return this.ordersService.getOrders(model);
  }

  @SetMetadata('roles', ['StoreManager', 'Salescleck'])
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @Post()
  async createOrder(
    @Body() model: { order: CreateOrderDto, cartproducts: CartProduct[] },
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.createOrder(req.user.userId, model.order, model.cartproducts);
  }

  @Put('/:id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, model);
  }

  @Delete('/:id')
  deleteOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.ordersService.deleteOrder(id, /*currentUserId*/ 1);
  }
}
