import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions, getConnection } from 'typeorm';
import { customThrowError } from 'src/common/helper/throw.helper';
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from 'src/common/constants/response-messages.enum';
import { AccountsService } from 'src/modules/account/accounts.service';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { CreateCargoRequestDto } from 'src/dto/warehouse/CreateCargoRequest.dto';
import { ProductCargoRequest } from 'src/entities/warehouse/product-cargorequest.entity';
import { FilterRequestDto } from './dto/filter-request.dto';

@Injectable()
export class CargoRequestsService {
  constructor(
    @InjectRepository(CargoRequest)
    private cargoRequestsRepository: Repository<CargoRequest>,
    private accountService: AccountsService, // @InjectRepository(ProductCargoRequest) // private readonly productCargoRequestRepository: Repository<ProductCargoRequest>,
  ) {}

  async createCargoRequest(
    model: CreateCargoRequestDto,
    requestId?: number,
  ): Promise<boolean> {
    // try {
    //   const newCargoRequest = new CargoRequest();
    //   newCargoRequest.warehouseId = model.warehouseId;
    //   newCargoRequest.StoreId = model.StoreId;
    //   const result = await this.cargoRequestsRepository.save(newCargoRequest);
    //   let index;
    //   for (index = 0; index < model.ProductId.length; index++) {
    //     await this.productCargoRequestRepository.save({
    //       CargoRequestId: result.Id,
    //       ProductId: model.ProductId[index],
    //       Quantity: model.Quantity[index],
    //     });
    //   }
    //   return true;
    // } catch (error) {
    //   customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    // }
    return true;
  }

  async getOrders(
    filterOptionsModel: FilterRequestDto,
  ): Promise<[CargoRequest[], number]> {
    let userId = filterOptionsModel.userId;
    if (!filterOptionsModel.order) {
      filterOptionsModel.order = new CargoRequest();
    }

    filterOptionsModel.order.createdByAccountId = userId;

    const user = await this.cargoRequestsRepository.findOne(userId);

    if (!user) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    return await this._getList(filterOptionsModel);
  }

  async _getList(
    filterOptionsModel: FilterRequestDto,
  ): Promise<[CargoRequest[], number]> {
    const {
      skip,
      take,
      searchBy,
      searchKeyword,
      order: filterOrder,
    } = filterOptionsModel;
    const order = {};
    const filterCondition = {} as any;
    const where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).CreatedAt = 'DESC';
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    if (filterOptionsModel.order?.createdByAccountId) {
      const filterOptions = [
        { createdByAccountId: filterOrder.createdByAccountId },
      ];
      const modifiedOptions = filterOptions.map(condition => ({
        ...condition,
        ...filterCondition,
      }));
      where.push(...modifiedOptions);
    } else {
      where.push({ ...filterOrder, ...filterCondition });
    }
    let search = '';
    if (searchBy === 'userEmail') {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<CargoRequest> = {
        where: search,
        skip,
        take,
        order,
        relations: ['CreatedByAccount', 'Warehouse'],
      };
      const [orders, count] = await this.cargoRequestsRepository.findAndCount(
        options,
      );
      return [orders, count];
    }

    const options: FindManyOptions<CargoRequest> = {
      where,
      skip,
      take,
      order,
      relations: ['CreatedByAccount', 'Warehouse'],
    };

    const [orders, count] = await this.cargoRequestsRepository.findAndCount(
      options,
    );
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getById(id: number): Promise<any> {
    const existedOrder = await this.cargoRequestsRepository.findOne({
      where: { Id: id },
      relations: ['CreatedByAccount', 'Warehouse', 'products'],
    });

    if (!existedOrder) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND,
      );
    }
    const res = await this._getProductQuantities(id);
    // let res = {};
    const resultOrder = { ...existedOrder, quantities: res };
    return resultOrder;
  }

  async _getProductQuantities(orderId: number): Promise<any[]> {
    let quantities = [];
    const products = await Promise.all([
      getConnection().query(
        `SELECT *
                FROM "cargo_request_products__product" "c" WHERE "c"."cargoRequestId" = ${orderId};`,
        [orderId],
      ),
    ]);
    products[0].map(product => {
      quantities.push(product.quantity);
    });
    return quantities;
  }
}
