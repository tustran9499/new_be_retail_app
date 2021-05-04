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
      // eslint-disable-next-line prefer-const
      let newProd_Cargoreq = new ProductCargoRequest();
      let result2 = new ProductCargoRequest();
      for (index = 0; index < model.ProductId.length; index++) {
        newProd_Cargoreq.CargoRequestId = result.Id;
        newProd_Cargoreq.ProductId = model.ProductId[index];
        newProd_Cargoreq.Quantity = model.Quantity[index];
        result2 = await this.productCargoRequestRepository.save(
          newProd_Cargoreq,
        );
      }
      return result && result2 ? true : false;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }
}
