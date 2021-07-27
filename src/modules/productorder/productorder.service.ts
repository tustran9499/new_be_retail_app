import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductOrder } from "src/entities/productorder/productorder.entity";
import { FindManyOptions, In, Repository } from "typeorm";
import { CreateProductOrderDto } from "src/dto/productorder/CreateProductOrder.dto";
import { customThrowError } from "src/common/helper/throw.helper";
import { RESPONSE_MESSAGES } from "src/common/constants/response-messages.enum";
import { ProductsService } from "../products/products.service";
import { StoreproductsService } from "../storeproducts/storeproducts.service";
import { AprioriProductsArrayDto } from "../order/dto/apriori-products.dto";

@Injectable()
export class ProductorderService {
  constructor(
    @InjectRepository(ProductOrder)
    private productorderRepository: Repository<ProductOrder>,
    private productsService: ProductsService,
    private storeproductsService: StoreproductsService
  ) {}

  async createProductOrder(
    userId: number,
    model: CreateProductOrderDto
  ): Promise<ProductOrder> {
    try {
      const result = await this.productorderRepository.save(model);
      // await this.productsService.decreaseProductQuantity(model.ProductId, model.Quantity);
      await this.storeproductsService.decreaseStoreProductQuantity(
        userId,
        model.ProductId,
        model.Quantity
      );
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async getProductOrderByOrder(orderId: number): Promise<any[]> {
    return await this.productorderRepository
      .createQueryBuilder("productorder")
      .leftJoinAndSelect("productorder.Product", "Product")
      .where("productorder.OrderId =" + orderId)
      .getManyAndCount();
  }

  async getTransactionsApriori(
    model: AprioriProductsArrayDto
  ): Promise<[ProductOrder[], number]> {
    const options: FindManyOptions<ProductOrder> = {
      select: ["OrderId"],
      where: { ProductId: In(model.productIds) },
    };

    const [
      Transactions,
      number,
    ] = await this.productorderRepository.findAndCount(options);
    return [Transactions, number];
  }

}
