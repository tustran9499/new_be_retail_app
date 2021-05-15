import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RESPONSE_MESSAGES, RESPONSE_MESSAGES_CODE } from 'src/common/constants/response-messages.enum';
import { customThrowError } from 'src/common/helper/throw.helper';
import { CreateOrderDto } from 'src/dto/order/CreateOrder.dto';
import { UpdateOrderDto } from 'src/dto/order/UpdateOrder.dto.';
import { Order } from 'src/entities/order/order.entity';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { OrdersFilterRequestDto } from './dto/filter-request.dto';
import { ProductorderService } from '../productorder/productorder.service';
import { CartProduct } from 'src/interfaces/cartproduct.interface';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Account } from '../../entities/account/account.entity';
import { AccountsService } from '../account/accounts.service';
import { INQUIRER } from '@nestjs/core';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private productorderService: ProductorderService,
    private accountService: AccountsService,
  ) { }

  async paginate(options: IPaginationOptions, id: number): Promise<Pagination<Order>> {
    try {
      const result = await this.accountService.findOneById(id);
      let queryBuilder = undefined;
      if (result.Type == 'Salescleck') {
        queryBuilder = this.ordersRepository.createQueryBuilder('orders').leftJoinAndSelect("orders.Account", "Account").leftJoinAndSelect("orders.ProductOrders", "ProductOrder").leftJoinAndSelect("orders.Customer", "Customer").where({ SaleClerkId: id });
      }
      else {
        const cashiers = await this.accountService.findAllCashier(result.StoreId);
        queryBuilder = this.ordersRepository.createQueryBuilder('orders').leftJoinAndSelect("orders.Account", "Account").leftJoinAndSelect("orders.ProductOrders", "ProductOrder").leftJoinAndSelect("orders.Customer", "Customer").where("SaleClerkId in (:...cashiers)", { cashiers: cashiers });
      }
      return paginate<Order>(queryBuilder, options);
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async paginateBySession(key: string, options: IPaginationOptions): Promise<Pagination<Order>> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('orders').leftJoinAndSelect("orders.Account", "Account").leftJoinAndSelect("orders.ProductOrders", "ProductOrder").leftJoinAndSelect("orders.Customer", "Customer").where('orders.SessionId Like \'%' + String(key) + '%\'');
    return paginate<Order>(queryBuilder, options);
  }

  async getById(id: number): Promise<any> {
    const existedOrder = await this.ordersRepository.createQueryBuilder('orders').leftJoinAndSelect("orders.Account", "Account").leftJoinAndSelect("orders.Customer", "Customer").leftJoinAndSelect("Account.Store", "Store").where('orders.Id =' + id).getOne();
    const existedProductOrder = await this.productorderService.getProductOrderByOrder(id);
    if (!existedOrder && !existedProductOrder) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }

    const resultOrder = { existedOrder, existedProductOrder };

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
      where: where,
      skip: skip,
      take: take,
    };

    const [Orders, number] = await this.ordersRepository.findAndCount(
      options,
    );
    return [Orders, number];
  }

  private async _createOrder(model: CreateOrderDto, cartproducts: CartProduct[]): Promise<any> {
    try {
      const order = new Order();
      order.OrderDate = new Date(Date.now());
      if (model.customerId && model.customerId !== 0) {
        order.CustomerId = model.customerId;
      }
      order.SaleClerkId = model.saleClerkId;
      order.SessionId = model.sessionId;
      order.Discount = model.discount;
      const result = await this.ordersRepository.save(order);
      const resultitems = [];
      cartproducts.forEach(async (item) => {
        try {
          const item_result = await this.productorderService.createProductOrder({ ProductId: item.Id, OrderId: result.Id, Price: item.UnitPrice, Quantity: item.Quantity, ReturnedQuantity: 0, Tax: 0.1, Discount: item.Discount });
          resultitems.push(item_result);
        }
        catch (error) {
          customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
      });
      return { result: result, resultitems: resultitems };
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async createOrder(order: CreateOrderDto, cartproducts: CartProduct[]
  ): Promise<any> {
    return await this._createOrder(order, cartproducts);
  }

  async getPromotion(total: number, coupon: number): Promise<any> {
    var data = await this.ordersRepository.query("GetOrderPromotion @Coupon='" + coupon + "'");
    if (data && data[0]) {
      const result = data[0];
      var today = new Date();
      if (result.StartTime > today || result.EndTime < today) {
        customThrowError("Out of the valid time!", HttpStatus.NOT_ACCEPTABLE, "Out of the valid time!");
      }
      else if (total < result.MinBill) {
        customThrowError("The order total does not meet the Min value requirement!", HttpStatus.NOT_ACCEPTABLE, "The order total does not meet the Min value requirement!");
      }
      else if (result.Quantity <= 0) {
        customThrowError("The promotion has ended!", HttpStatus.NOT_ACCEPTABLE, "The promotion has ended!");
      }
      else {
        var temp = total * result.PercentOff;
        if (temp > result.MaxDiscount) {
          return result.MaxDiscount;
        }
        else {
          return temp;
        }
      }
    }
    else {
      customThrowError("Invalid coupon! Please try again!", HttpStatus.NOT_ACCEPTABLE, "Invalid coupon! Please try again!");
    }
  }

  async updateOrder(
    id: number,
    model: UpdateOrderDto,
  ): Promise<any> {
    const order = await this.ordersRepository.findOne(id);
    if (!order) {
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
    const orderWithId = { Id: id, ...order };
    await this.ordersRepository.save(orderWithId);
    return this.getById(id);
  }

  async deleteOrder(id: number, currentAccountId: number): Promise<boolean> {
    const order = await this.ordersRepository.findOne(id);

    if (!order) {
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
