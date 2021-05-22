import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from 'src/entities/storeproduct/storeproduct.entity';
import { Repository } from 'typeorm';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { AccountsService } from '../account/accounts.service';

@Injectable()
export class StoreproductsService {
  constructor(
    @InjectRepository(StoreProduct)
    private storeproductsRepository: Repository<StoreProduct>,
    private accountsService: AccountsService,
  ) {}

  async updateStoreProduct(
    UserId: number,
    ProductId: number,
    Quantity: number,
  ): Promise<any> {
    try {
      const acc = await this.accountsService.findOneById(UserId);
      const result = await this.storeproductsRepository.save({
        StoreId: acc.StoreId,
        ProductId: ProductId,
        Quantity: Quantity,
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async decreaseStoreProductQuantity(
    UserId: number,
    ProductId: number,
    Quantity: number,
  ): Promise<any> {
    try {
      const acc = await this.accountsService.findOneById(UserId);
      const storeproduct = await this.storeproductsRepository.findOne({
        where: { StoreId: acc.StoreId, ProductId: ProductId },
      });
      console.log(storeproduct);
      var updateValue = 0;
      if (storeproduct.Quantity > Quantity) {
        updateValue = storeproduct.Quantity - Quantity;
      }
      const result = await this.storeproductsRepository.save({
        StoreId: acc.StoreId,
        ProductId: ProductId,
        Quantity: updateValue,
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async addProductToStore(ProductId: number, UserId: number): Promise<any> {
    try {
      const acc = await this.accountsService.findOneById(UserId);
      const result = await this.storeproductsRepository.save({
        StoreId: acc.StoreId,
        ProductId: ProductId,
        Quantity: 0,
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }
}
