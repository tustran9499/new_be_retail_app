import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { AccountsService } from 'src/modules/account/accounts.service';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { CreateCargoRequestDto } from 'src/dto/warehouse/CreateCargoRequest.dto';
import { ApiMethodNotAllowedResponse } from '@nestjs/swagger';
import { ProductCargoRequest } from 'src/entities/warehouse/product-cargorequest.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CargoRequestsService {
  constructor(
    @InjectRepository(CargoRequest)
    private cargoRequestsRepository: Repository<CargoRequest>,
    private accountService: AccountsService,
    @InjectRepository(ProductCargoRequest)
    private readonly productCargoRequestRepository: Repository<ProductCargoRequest>,
  ) {}

  async createCargoRequest(
    model: CreateCargoRequestDto,
    requestId?: number,
  ): Promise<boolean> {
    try {
      const newCargoRequest = new CargoRequest();
      newCargoRequest.WarehouseId = model.WarehouseId;
      newCargoRequest.StoreId = model.StoreId;
      const result = await this.cargoRequestsRepository.save(newCargoRequest);
      let index;
      for (index = 0; index < model.ProductId.length; index++) {
        await this.productCargoRequestRepository.save({
          CargoRequestId: result.Id,
          ProductId: model.ProductId[index],
          Quantity: model.Quantity[index],
        });
      }
      return true;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getFullTimeSeriesSale(): Promise<any> {
    const data = await this.cargoRequestsRepository.query(
      'GetTimeSeriesFullSale',
    );
    return data;
  }

  findAll(): Promise<CargoRequest[]> {
    return this.cargoRequestsRepository.find();
  }

  findOne(id: number): Promise<CargoRequest> {
    return this.cargoRequestsRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cargoRequestsRepository.delete(id);
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<CargoRequest>> {
    console.log(paginate<CargoRequest>(this.cargoRequestsRepository, options));
    return paginate<CargoRequest>(this.cargoRequestsRepository, options);
  }

  async searchCargoRequest(
    key: string,
    options: IPaginationOptions,
  ): Promise<Pagination<CargoRequest>> {
    if (key && key != undefined && key !== null && key !== '') {
      const queryBuilder = this.cargoRequestsRepository
        .createQueryBuilder('cargoRequests')
        .leftJoinAndSelect("Warehouse", "photo", "photo.userId = user.id")
        .where("products.ProductName Like '%" + String(key) + "%'")
        .orWhere("products.Id Like '%" + String(key) + "%'")
        .orderBy('products.ProductName', 'ASC');
      const result = paginate<CargoRequest>(queryBuilder, options);
      console.log('------------------------------------------');
      console.log(result);
      return paginate<CargoRequest>(queryBuilder, options);
    } else {
      const queryBuilder = this.cargoRequestsRepository
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.Category', 'Category')
        .orderBy('products.Id', 'ASC');
      console.log('------------------------------------------');
      console.log(queryBuilder.getMany());
      return paginate<CargoRequest>(queryBuilder, options);
    }
  }

  // async updateProduct(
  //   id: number,
  //   model: UpdateProductDto,
  // ): Promise<CargoRequest> {
  //   try {
  //     const result = await this.cargoRequestsRepository.save({
  //       ...model,
  //       Id: Number(id),
  //     });
  //     return result;
  //   } catch (error) {
  //     customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
  //   }
  // }
}
