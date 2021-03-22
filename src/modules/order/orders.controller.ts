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
import {ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from 'src/dto/order/CreateOrder.dto';
import { UpdateOrderDto } from 'src/dto/order/UpdateOrder.dto.';
import { Order } from 'src/entities/order/order.entity';
import { GetRequest } from '../account/dto/GetRequest.dto';
import { OrdersService } from './orders.service';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    return await this.ordersService.getById(id);
  }

  @Get()
  @ApiOkResponse({})
  getCustomers(@Query() model: GetRequest): Promise<any> {
    return this.ordersService.getOrders(model);
  }

  @Post()
  async createOrder(
    @Body() model: CreateOrderDto,
    //@Body() model: Record<string, any>,
  ): Promise<Order> {
    return this.ordersService.createOrder(model);
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
    return this.ordersService .deleteOrder(id, /*currentUserId*/ 1);
  }
}
