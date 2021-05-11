import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, getCustomRepository } from 'typeorm';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES, RESPONSE_MESSAGES_CODE } from 'src/common/constants/response-messages.enum';
import { AccountsService } from 'src/modules/account/accounts.service';
import { CargoRequest } from 'src/entities/warehouse/cargorequest.entity';
import { CreateCargoRequestDto } from 'src/dto/warehouse/CreateCargoRequest.dto';
import { ApiMethodNotAllowedResponse } from '@nestjs/swagger';
import { ProductCargoRequest } from 'src/entities/warehouse/product-cargorequest.entity';
import { FilterRequestDto } from './dto/filter-request.dto';
import { CargoRequestRepository } from './cargoRequests.repository';

@Injectable()
export class CargoRequestsService {
  constructor(
    @InjectRepository(CargoRequest)
    private cargoRequestsRepository: Repository<CargoRequest>,
    private accountService: AccountsService,
    @InjectRepository(ProductCargoRequest)
    private readonly productCargoRequestRepository: Repository<ProductCargoRequest>,
  ) {}

  firstFunction = (_callback: any) => {
    // do some asynchronous work
    // and when the asynchronous stuff is complete
    _callback();
  };


  _cargoRequestsRepository = getCustomRepository(CargoRequestRepository);

  async createCargoRequest(
    model: CreateCargoRequestDto,
    requestId?: number,
  ): Promise<boolean> {
    try {
      const newCargoRequest = new CargoRequest();
      newCargoRequest.warehouseId = model.warehouseId;
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
      customThrowError(
        RESPONSE_MESSAGES.NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    const cargoRequestsRepository = getCustomRepository(CargoRequestRepository);
    return await cargoRequestsRepository.getList(filterOptionsModel);
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
    let res = this._cargoRequestsRepository.getProductQuantities(id);
    const resultOrder = { ...existedOrder/*, quantities: { ...res }*/};

    return (resultOrder);
  }
}
