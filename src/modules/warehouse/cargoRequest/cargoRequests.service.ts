import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, FindManyOptions, getConnection } from "typeorm";
import { customThrowError } from "src/common/helper/throw.helper";
import {
  RESPONSE_MESSAGES,
  RESPONSE_MESSAGES_CODE,
} from "src/common/constants/response-messages.enum";
import { AccountsService } from "src/modules/account/accounts.service";
import { CargoRequest } from "src/entities/warehouse/cargorequest.entity";
import {
  CreateCargoRequestDto,
  CreateReturnCargoRequestDto,
  ProductArrayDto,
  UpdateCargoRequestDto,
} from "src/dto/warehouse/CreateCargoRequest.dto";
import {
  FilterRequestDto,
  FilterReturnedRequestDto,
} from "./dto/filter-request.dto";
import { ReturnedCargoRequest } from "src/entities/warehouse/returnedcargorequest.entity";

@Injectable()
export class CargoRequestsService {
  constructor(
    @InjectRepository(CargoRequest)
    private cargoRequestsRepository: Repository<CargoRequest>,
    @InjectRepository(ReturnedCargoRequest)
    private returnedCargoRequestRepository: Repository<ReturnedCargoRequest>,
    private accountService: AccountsService
  ) {}

  async createCargoRequest(
    model: CreateCargoRequestDto,
    requestId?: number
  ): Promise<boolean> {
    try {
      const newCargoRequest = new CargoRequest();
      newCargoRequest.warehouseId = model.warehouseId;
      newCargoRequest.storeId = model.StoreId;
      newCargoRequest.Status = "Created";
      newCargoRequest.ToStoreId = model.ToStoreId;
      newCargoRequest.createdByAccountId = model.UserId;
      newCargoRequest.CreatedAt = new Date(Date.now());
      const result = await this.cargoRequestsRepository.save(newCargoRequest);
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        const tmp = await Promise.all([
          getConnection().query(
            `INSERT INTO "cargo_request_products__product"
          (cargoRequestid, productId, quantity)
          VALUES (${result.Id}, ${model.ProductId[index]}, ${model.Quantity[index]})`,
            [result.Id, model.ProductId, model.Quantity]
          ),
        ]);
      }
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async createReturnCargoRequest(
    model: CreateReturnCargoRequestDto,
    requestId?: number
  ): Promise<boolean> {
    try {
      const newCargoRequest = new ReturnedCargoRequest();
      newCargoRequest.Status = "Created";
      newCargoRequest.createdByAccountId = model.UserId;
      newCargoRequest.FromRequestId = model.CargoRequestId;
      newCargoRequest.CreatedAt = new Date(Date.now());
      const result = await this.returnedCargoRequestRepository.save(
        newCargoRequest
      );
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        const tmp2 = await Promise.all([
          getConnection().query(
            `INSERT INTO "returned_cargo_request_products__product"
          (returnedCargoRequestId, productId, quantity)
          VALUES (${result.Id}, ${model.ProductId[index]}, ${model.Quantity[index]})`,
            [model.CargoRequestId, model.ProductId, model.Quantity]
          ),
        ]);
        const tmp = await Promise.all([
          getConnection().query(
            `UPDATE "cargo_request_products__product"
            SET returned = ISNULL(returned,0) + ${model.Quantity[index]}
            WHERE cargoRequestId = ${model.CargoRequestId} AND productId = ${model.ProductId[index]}
            `,
            [model.Quantity, model.CargoRequestId, model.ProductId]
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
    requestId?: number
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
          [model]
        ),
        getConnection().query(
          `DELETE FROM cargo_request_products__product
              WHERE cargoRequestId=${id}`,
          [model]
        ),
      ]);
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        const tmp = await Promise.all([
          getConnection().query(
            `INSERT INTO "cargo_request_products__product"
          (cargoRequestId, productId, quantity)
          VALUES (${id}, ${model.ProductId[index]}, ${model.Quantity[index]})`,
            [id, model.ProductId, model.Quantity]
          ),
        ]);
      }
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getOrders(
    filterOptionsModel: FilterRequestDto
  ): Promise<[CargoRequest[], number]> {
    let userId = filterOptionsModel.userId;
    let storeId = filterOptionsModel.storeId;
    let ToStoreId = filterOptionsModel.storeId;
    let warehouseId = filterOptionsModel.warehouseId;
    if (!filterOptionsModel.order) {
      filterOptionsModel.order = new CargoRequest();
    }

    //filterOptionsModel.order.createdByAccountId = userId;

    const user = await this.cargoRequestsRepository.findOne(userId);

    if (!user) {
      customThrowError(RESPONSE_MESSAGES.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    filterOptionsModel.order.storeId = storeId;
    filterOptionsModel.order.warehouseId = warehouseId;
    filterOptionsModel.order.ToStoreId = ToStoreId;

    return await this._getList(filterOptionsModel);
  }

  async _getList(
    filterOptionsModel: FilterRequestDto
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
      (order as any).CreatedAt = "DESC";
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    if (filterOptionsModel.order?.warehouseId) {
      const filterOptions = [{ warehouseId: filterOrder.warehouseId }];
      const modifiedOptions = filterOptions.map((condition) => ({
        ...condition,
        ...filterCondition,
      }));
      where.push(...modifiedOptions);
    } else if (filterOptionsModel.order?.storeId) {
      const filterOptions = [
        { storeId: filterOrder.storeId },
        { ToStoreId: filterOrder.ToStoreId },
      ];
      const modifiedOptions = filterOptions.map((condition) => ({
        ...condition,
        ...filterCondition,
      }));
      where.push(...modifiedOptions);
    } else if (filterOptionsModel.order?.userId) {
      const filterOptions = [{ createdByAccountId: filterOrder.userId }];
      const modifiedOptions = filterOptions.map((condition) => ({
        ...condition,
        ...filterCondition,
      }));
      where.push(...modifiedOptions);
    } else {
      where.push({ ...filterOrder, ...filterCondition });
    }
    let search = "";
    if (searchBy === "userEmail") {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<CargoRequest> = {
        where: search,
        skip,
        take,
        order,
        relations: ["CreatedByAccount", "Warehouse", "Store"],
      };
      const [orders, count] = await this.cargoRequestsRepository.findAndCount(
        options
      );
      return [orders, count];
    }

    const options: FindManyOptions<CargoRequest> = {
      where,
      skip,
      take,
      order,
      relations: ["CreatedByAccount", "Warehouse", "Store"],
    };

    const [orders, count] = await this.cargoRequestsRepository.findAndCount(
      options
    );
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getReturnedOrders(
    id: number,
    filterOptionsModel: FilterReturnedRequestDto
  ): Promise<[ReturnedCargoRequest[], number]> {
    let userId = filterOptionsModel.userId;
    if (!filterOptionsModel.order) {
      filterOptionsModel.order = new ReturnedCargoRequest();
    }

    return await this._getReturnedList(id, filterOptionsModel);
  }

  async _getReturnedList(
    id: number,
    filterOptionsModel: FilterReturnedRequestDto
  ): Promise<[ReturnedCargoRequest[], number]> {
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
      (order as any).CreatedAt = "DESC";
    }

    if (searchBy && searchKeyword) {
      filterCondition[searchBy] = Like(`%${searchKeyword}%`);
    }

    where.push({ FromRequestId: id });
    let search = "";
    if (searchBy === "userEmail") {
      search = `LOWER("Order__createdByCustomer"."email") like '%${searchKeyword.toLowerCase()}%'`;
      const options: FindManyOptions<ReturnedCargoRequest> = {
        where: search,
        skip,
        take,
        order,
        relations: ["CreatedByAccount"],
      };
      const [
        orders,
        count,
      ] = await this.returnedCargoRequestRepository.findAndCount(options);
      return [orders, count];
    }

    const options: FindManyOptions<ReturnedCargoRequest> = {
      where,
      skip,
      take,
      order,
      relations: ["CreatedByAccount"],
    };

    const [
      orders,
      count,
    ] = await this.returnedCargoRequestRepository.findAndCount(options);
    // const modifiedOrders = orders.map(o => new OrderResponseDto(o));

    // return [modifiedOrders, count];
    return [orders, count];
  }

  async getById(id: number): Promise<any> {
    const existedOrder = await this.cargoRequestsRepository.findOne({
      where: { Id: id },
      relations: ["CreatedByAccount", "Warehouse", "Store", "products"],
    });

    if (!existedOrder) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }
    const res = await this._getProductQuantities(id);
    // let res = {};
    const resultOrder = {
      ...existedOrder,
      quantities: res[0],
      returned: res[1],
    };
    return resultOrder;
  }

  async _getProductQuantities(orderId: number): Promise<any[]> {
    let quantities = [];
    let returned = [];
    const products = await Promise.all([
      getConnection().query(
        `SELECT *
                FROM "cargo_request_products__product" "c" WHERE "c"."cargoRequestId" = ${orderId};`,
        [orderId]
      ),
    ]);
    products[0].map((product) => {
      quantities.push(product.quantity);
      returned.push(product.returned);
    });
    return [quantities, returned];
  }

  async getReturnedOneById(id: number): Promise<any> {
    const existedOrder = await this.returnedCargoRequestRepository.findOne({
      where: { Id: id },
      relations: ["CreatedByAccount", "products"],
    });

    if (!existedOrder) {
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        RESPONSE_MESSAGES_CODE.NOT_FOUND
      );
    }
    const res = await this._getReturnedProductQuantities(id);
    // let res = {};
    const resultOrder = {
      ...existedOrder,
      quantities: res,
    };
    return resultOrder;
  }

  async _getReturnedProductQuantities(orderId: number): Promise<any[]> {
    let quantities = [];
    const products = await Promise.all([
      getConnection().query(
        `SELECT *
                FROM "returned_cargo_request_products__product" "c" WHERE "c"."returnedCargoRequestId" = ${orderId};`,
        [orderId]
      ),
    ]);
    products[0].map((product) => {
      quantities.push(product.quantity);
    });
    return quantities;
  }

  async getStatusOne(id: number): Promise<any> {
    const result = await Promise.all([
      getConnection().query(`select Status from CargoRequest where Id=${id}`),
    ]);
    return result;
  }

  async getReturnedStatusOne(id: number): Promise<any> {
    const result = await Promise.all([
      getConnection().query(
        `select Status from ReturnedCargoRequest where Id=${id}`
      ),
    ]);
    return result;
  }

  async setOrderStatus(id: number, status: string): Promise<any> {
    const result = await this.cargoRequestsRepository.update(id, {
      Status: status,
    });
    return result;
  }

  async setReturnedOrderStatus(id: number, status: string): Promise<any> {
    const result = await Promise.all([
      getConnection().query(
        `UPDATE "ReturnedCargoRequest"
        SET Status = '${status}'
        WHERE Id = ${id}
        `,
        [id, status]
      ),
    ]);
    return result;
  }

  async deleteCargoRequest(id: number): Promise<any> {
    const result = await this.cargoRequestsRepository.softDelete(id);
    return result;
  }
}
