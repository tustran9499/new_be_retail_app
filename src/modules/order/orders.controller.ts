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
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dto/order/CreateOrder.dto';
import { UpdateOrderDto } from 'src/dto/order/UpdateOrder.dto.';
import { Order } from 'src/entities/order/order.entity';
import { GetRequest } from '../account/dto/GetRequest.dto';
import { OrdersService } from './orders.service';
import { CartProduct } from 'src/interfaces/cartproduct.interface';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get('/id/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    return await this.ordersService.getById(id);
  }

  @Get('/paginateOrders')
  async index(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Order>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordersService.paginate({
      page,
      limit,
      route: '/api/orders/paginateOrders',
    });
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

  @Post()
  async createOrder(
    @Body() model: { order: CreateOrderDto, cartproducts: CartProduct[] }
  ): Promise<Order> {
    return this.ordersService.createOrder(model.order, model.cartproducts);
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
