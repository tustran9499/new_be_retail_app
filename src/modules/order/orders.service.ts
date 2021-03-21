import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGES, RESPONSE_MESSAGES_CODE } from 'src/common/constants/response-messages.enum';
import { customThrowError } from 'src/common/helper/throw.helper';
import { CreateOrderDto } from 'src/dto/order/CreateOrder.dto';
import { UpdateOrderDto } from 'src/dto/order/UpdateOrder.dto.';
import { Order } from 'src/entities/order/order.entity';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { OrdersFilterRequestDto } from './dto/filter-request.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async getById(id: number): Promise<Order> {
    const existedOrder = await this.ordersRepository.findOne(id);

    if (!existedOrder) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }

    const resultOrder = { ...existedOrder };

    return resultOrder;
  }

  async getOrders(
    model: OrdersFilterRequestDto,
  ): Promise<[Order[], number]> {
    const {
    skip,
    take,
    searchBy,
    searchKeyword,
    } = model;
    const order = {};
    const filterCondition = {} as any;
    const where = [];
    let search = '';

    if (model.orderBy) {
    order[model.orderBy] = model.orderDirection;
    } else {
    (order as any).createdDate = 'DESC';
    }

    if (searchBy && searchKeyword) {
    filterCondition[searchBy] = Raw(
        alias => `LOWER(${alias}) like '%${searchKeyword.toLowerCase()}%'`,
    );
    }

    where.push({ ...filterCondition });
    const options: FindManyOptions<Order> = {
    select: [
        'Id',
        'OrderDate',
        'CustomerId',
        'SaleClerkId',
        'SessionId',
    ],
    where: where ,
    skip: skip,
    take: take,
    };

    const [Orders, number] = await this.ordersRepository.findAndCount(
    options,
    );
    return [Orders, number];
  }

  private async _createOrder(model: any): Promise<Order> {
    try {
      const order = new Order();
      order.OrderDate = model.orderDate;
      order.CustomerId = model.customerId;
      order.SaleClerkId = model.saleClerkId;
      order.SessionId = model.sessionId;
      const result = await this.ordersRepository.save(order);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async createOrder(
      model: CreateOrderDto,
    ): Promise<any> {
      await this._createOrder(model);
  }

  async updateOrder(
      id: number,
      model: UpdateOrderDto,
  ): Promise<any> {
      const order = await this.ordersRepository.findOne(id);
      if (!order){
        customThrowError(
            RESPONSE_MESSAGES.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            RESPONSE_MESSAGES_CODE.NOT_FOUND,
        )
        return;
      }

      const keys = Object.keys(model);
      keys.forEach(key => {
        order[key] = model[key];
      });
      const orderWithId = {Id: id, ...order};
      await this.ordersRepository.save(orderWithId);
      return this.getById(id);
  }

  async deleteOrder(id: number, currentAccountId: number): Promise<boolean> {
      const order = await this.ordersRepository.findOne(id);

      if (!order){
          customThrowError(
              RESPONSE_MESSAGES.NOT_FOUND,
              HttpStatus.BAD_REQUEST,
              RESPONSE_MESSAGES_CODE.NOT_FOUND,
          )
          return;
      }

      await this.ordersRepository.softDelete(id);
      return true;
  }
}
