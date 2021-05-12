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
import {
  CreateCargoRequestDto,
  UpdateCargoRequestDto,
} from 'src/dto/warehouse/CreateCargoRequest.dto';
import { FilterRequestDto } from './dto/filter-request.dto';

@Injectable()
export class CargoRequestsService {
  constructor(
    @InjectRepository(CargoRequest)
    private cargoRequestsRepository: Repository<CargoRequest>,
    private accountService: AccountsService,
  ) {}

  async createCargoRequest(
    model: CreateCargoRequestDto,
    requestId?: number,
  ): Promise<boolean> {
    try {
      const newCargoRequest = new CargoRequest();
      newCargoRequest.warehouseId = model.warehouseId;
      newCargoRequest.StoreId = model.StoreId;
      newCargoRequest.Status = 'Created';
      const result = await this.cargoRequestsRepository.save(newCargoRequest);
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        const tmp = await Promise.all([
          getConnection().query(
            `INSERT INTO "cargo_request_products__product"
          (cargoRequestid, productId, quantity)
          VALUES (${result.Id}, ${model.ProductId[index]}, ${model.Quantity[index]})`,
            [result.Id, model.ProductId, model.Quantity],
          ),
        ]);
      }
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async updateCargoRequest(
    id: number,
    model: UpdateCargoRequestDto,
    requestId?: number,
  ): Promise<boolean> {
    try {
      model.warehouseId = model.warehouseId ?? null;
      model.Notes = model.Notes ? `'${model.Notes}'` : null;
      model.Status = model.Status ? `'${model.Status}'` : null;
      const [tmp, del] = await Promise.all([
        getConnection().query(
          `UPDATE CargoRequest
          SET warehouseId=ISNULL(${model.warehouseId},warehouseId), 
              Notes=ISNULL(${model.Notes},Notes), 
              Status=ISNULL(${model.Status},Status)
          WHERE Id=${id}`,
          [model],
        ),
        getConnection().query(
          `DELETE FROM cargo_request_products__product
              WHERE cargoRequestId=${id}`,
          [model],
        ),
      ]);
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        const tmp = await Promise.all([
          getConnection().query(
            `INSERT INTO "cargo_request_products__product"
          (cargoRequestId, productId, quantity)
          VALUES (${id}, ${model.ProductId[index]}, ${model.Quantity[index]})`,
            [id, model.ProductId, model.Quantity],
          ),
        ]);
      }
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
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

  async setOrderStatus(id: number, status: string): Promise<any> {
    const result = await this.cargoRequestsRepository.update(id, {
      Status: status,
    });
    return result;
  }

  async deleteCargoRequest(id: number): Promise<any> {
    const result = await this.cargoRequestsRepository.softDelete(id);
    return result;
  }
}
