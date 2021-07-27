import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository } from "typeorm";
import { Product } from "src/entities/product/product.entity";
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from "nestjs-typeorm-paginate";
import { CreateProductDto } from "src/dto/product/CreateProduct.dto";
import { customThrowError } from "src/common/helper/throw.helper";
import { RESPONSE_MESSAGES } from "src/common/constants/response-messages.enum";
import { UpdateProductDto } from "src/dto/product/UpdateProduct.dto.";
import { Like } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { Category } from "src/entities/product/category.entity";
import { AccountsService } from "../account/accounts.service";
import { StoreproductsService } from "../storeproducts/storeproducts.service";
import { UpdateProductByStoreDto } from "src/dto/product/UpdateProductByStore.dto";
import { UpdateProductByAdminDto } from "src/dto/product/UpdateProductByAdmin.dto";
var timeseries = require("timeseries-analysis");

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private categoriesService: CategoriesService,
    private accountService: AccountsService,
    private storeproductsService: StoreproductsService
  ) {}

  async getFullTimeSeriesSale(): Promise<any> {
    const data = await this.productsRepository.query("GetTimeSeriesFullSale");
    return data;
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  findOneByBarcode(barcode: string): Promise<Product> {
    return this.productsRepository.findOne({ Barcode: barcode });
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    console.log(paginate<Product>(this.productsRepository, options));
    return paginate<Product>(this.productsRepository, options);
  }

  async searchProduct(
    userId: number,
    key: string,
    options: IPaginationOptions
  ): Promise<Pagination<Product>> {
    const result = await this.accountService.findOneById(userId);
    if (result && result.StoreId) {
      const storeId = result.StoreId;
      if (key && key != undefined && key !== null && key !== "") {
        const queryBuilder = this.productsRepository
          .createQueryBuilder("products")
          .leftJoinAndSelect("products.Category", "Category")
          .innerJoinAndSelect("products.StoreProducts", "StoreProducts")
          .where("StoreProducts.StoreId = " + storeId)
          .andWhere("products.ProductName Like '%" + String(key) + "%'")
          .orWhere("products.Id Like '%" + String(key) + "%'")
          .orderBy("products.ProductName", "ASC");
        const result = paginate<Product>(queryBuilder, options);
        return paginate<Product>(queryBuilder, options);
      } else {
        const queryBuilder = this.productsRepository
          .createQueryBuilder("products")
          .leftJoinAndSelect("products.Category", "Category")
          .innerJoinAndSelect("products.StoreProducts", "StoreProducts")
          .where("StoreProducts.StoreId = " + storeId)
          .orderBy("products.Id", "ASC");
        return paginate<Product>(queryBuilder, options);
      }
    }
    if (key && key != undefined && key !== null && key !== "") {
      const queryBuilder = this.productsRepository
        .createQueryBuilder("products")
        .leftJoinAndSelect("products.Category", "Category")
        .where("products.ProductName Like '%" + String(key) + "%'")
        .orWhere("products.Id Like '%" + String(key) + "%'")
        .orderBy("products.ProductName", "ASC");
      const result = paginate<Product>(queryBuilder, options);
      return paginate<Product>(queryBuilder, options);
    } else {
      const queryBuilder = this.productsRepository
        .createQueryBuilder("products")
        .leftJoinAndSelect("products.Category", "Category")
        .orderBy("products.Id", "ASC");
      return paginate<Product>(queryBuilder, options);
    }
  }

  async searchNotAddedProduct(
    userId: number,
    key: string,
    options: IPaginationOptions
  ): Promise<Pagination<Product>> {
    const currentProducts = await this.productsRepository
      .createQueryBuilder("products")
      .innerJoinAndSelect("products.StoreProducts", "StoreProducts")
      .getMany();
    var currentProductIds = [] as any;
    currentProducts.forEach((item) => {
      currentProductIds.push(item.Id);
    });
    if (key && key != undefined && key !== null && key !== "") {
      const queryBuilder = this.productsRepository
        .createQueryBuilder("products")
        .leftJoinAndSelect("products.Category", "Category")
        .where("products.Id NOT IN (" + currentProductIds + ")")
        .andWhere("products.ProductName Like '%" + String(key) + "%'")
        .orWhere("products.Id Like '%" + String(key) + "%'")
        .orderBy("products.ProductName", "ASC");
      const result = paginate<Product>(queryBuilder, options);
      return paginate<Product>(queryBuilder, options);
    } else {
      const queryBuilder = this.productsRepository
        .createQueryBuilder("products")
        .leftJoinAndSelect("products.Category", "Category")
        .where("products.Id NOT IN (" + currentProductIds + ")")
        .orderBy("products.Id", "ASC");
      return paginate<Product>(queryBuilder, options);
    }
  }

  async getPromotion(id: number): Promise<number> {
    var data = await this.productsRepository.query(
      "GetProductPromotion @Id='" + id + "'"
    );
    if (data && data[0]) {
      return Number(data[0].PercentOff);
    } else {
      0;
    }
  }

  async getFullPromotion(id: number): Promise<any> {
    var data = await this.productsRepository.query(
      "GetFullProductPromotion @Id='" + id + "'"
    );
    if (data && data[0]) {
      return data[0];
    } else {
      return {};
    }
  }

  async getTimeSeriesSale(userId: number, id: number): Promise<any> {
    const user = await this.accountService.findOneById(userId);
    if (user && user.StoreId) {
      var data = await this.productsRepository.query(
        "GetTimeSeriesSaleByStore @ProductId='" +
          id +
          "',@StoreId='" +
          user.StoreId +
          "'"
      );
      var newData = [];
      for (let step = 0; step < 15; step++) {
        var tempdate = new Date();
        tempdate.setDate(new Date().getDate() - step);
        if (
          data.length != 0 &&
          new Date(data[data.length - 1].Date).getDate() == tempdate.getDate()
        ) {
          newData.push(data[data.length - 1]);
          data.pop();
        } else {
          newData.push({ Date: tempdate, Value: 0 });
        }
      }
      newData.reverse();
      var pret = new timeseries.main(
        timeseries.adapter.fromDB(newData, {
          date: "Date", // Name of the property containing the Date (must be compatible with new Date(date) )
          value: "Value", // Name of the property containign the value. here we'll use the "close" price.
        })
      );
      var mean = pret.mean();
      for (let step = 0; step < 15; step++) {
        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + step);
        newData.push({ Date: tomorrow, Value: mean });
      }
      var t = new timeseries.main(
        timeseries.adapter.fromDB(newData, {
          date: "Date", // Name of the property containing the Date (must be compatible with new Date(date) )
          value: "Value", // Name of the property containign the value. here we'll use the "close" price.
        })
      );
      // t.smoother({ period: 3 }).save('smoothed');
      var bestSettings = t.regression_forecast_optimize();
      var options = {
        n: 15, // How many data points to be forecasted
        sample: 14, // How many datapoints to be training dataset
        start: 15, // Initial forecasting position
        method: "ARMaxEntropy", // What method for forecasting
        degree: 4, // How many degree for forecasting
        // growthSampleMode: false, // Is the sample use only last x data points or up to entire data points?
      };
      var MSE = t.regression_forecast(options);
      return t;
    } else {
      var data = await this.productsRepository.query(
        "GetTimeSeriesSale @ProductId='" + id + "'"
      );
      var newData = [];
      for (let step = 0; step < 15; step++) {
        var tempdate = new Date();
        tempdate.setDate(new Date().getDate() - step);
        if (
          data.length != 0 &&
          new Date(data[data.length - 1].Date).getDate() == tempdate.getDate()
        ) {
          newData.push(data[data.length - 1]);
          data.pop();
        } else {
          newData.push({ Date: tempdate, Value: 0 });
        }
      }
      newData.reverse();
      var pret = new timeseries.main(
        timeseries.adapter.fromDB(newData, {
          date: "Date", // Name of the property containing the Date (must be compatible with new Date(date) )
          value: "Value", // Name of the property containign the value. here we'll use the "close" price.
        })
      );
      var mean = pret.mean();
      for (let step = 0; step < 15; step++) {
        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + step);
        newData.push({ Date: tomorrow, Value: mean });
      }
      var t = new timeseries.main(
        timeseries.adapter.fromDB(newData, {
          date: "Date", // Name of the property containing the Date (must be compatible with new Date(date) )
          value: "Value", // Name of the property containign the value. here we'll use the "close" price.
        })
      );
      // t.smoother({ period: 3 }).save('smoothed');
      var bestSettings = t.regression_forecast_optimize();
      var options = {
        n: 15, // How many data points to be forecasted
        sample: 14, // How many datapoints to be training dataset
        start: 15, // Initial forecasting position
        method: "ARMaxEntropy", // What method for forecasting
        degree: 4, // How many degree for forecasting
        // growthSampleMode: false, // Is the sample use only last x data points or up to entire data points?
      };
      var MSE = t.regression_forecast(options);
      return t;
    }
  }

  async createProduct(model: CreateProductDto): Promise<Product> {
    try {
      const result = await this.productsRepository.save(model);
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async updateProductByStore(
    userId: number,
    id: number,
    model: UpdateProductByStoreDto
  ): Promise<Product> {
    try {
      const result = await this.storeproductsService.updateStoreProduct(
        userId,
        id,
        model.Quantity
      );
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async updateProductByAdmin(
    userId: number,
    id: number,
    model: UpdateProductByAdminDto
  ): Promise<Product> {
    try {
      const result = await this.productsRepository.save({
        ...model,
        Id: Number(id),
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async decreaseProductQuantity(
    id: number,
    decrease: number
  ): Promise<Product> {
    try {
      const item = await this.productsRepository.findOne(id);
      var updateValue = 0;
      if (item.UnitsInStock > decrease) {
        updateValue = item.UnitsInStock - decrease;
      }
      const result = await this.productsRepository.save({
        ...item,
        UnitsInStock: updateValue,
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async deleteProduct(userId: number, id: number): Promise<any> {
    const result = await this.accountService.findOneById(userId);
    if (result && result.StoreId) {
      try {
        return await this.storeproductsService.deleteProductFromStore(
          id,
          result.StoreId
        );
      } catch (error) {
        customThrowError(
          RESPONSE_MESSAGES.ERROR,
          HttpStatus.BAD_REQUEST,
          error
        );
      }
    } else {
      try {
        let product = await this.productsRepository.findOne(id);
        product.Discontinued = true;
        const result = await this.productsRepository.save({
          ...product,
          Id: Number(id),
        });
        return result;
      } catch (error) {
        customThrowError(
          RESPONSE_MESSAGES.ERROR,
          HttpStatus.BAD_REQUEST,
          error
        );
      }
    }
  }

  async updateProductImg(id: number, ImagePath: string) {
    try {
      let product = await this.productsRepository.findOne(id);
      product.PhotoURL = ImagePath;
      const result = await this.productsRepository.save({
        ...product,
        Id: Number(id),
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }

  async addBarcode(id: number, code: string) {
    try {
      const product = await this.productsRepository.findOne(id);
      product.Barcode = code;
      const result = await this.productsRepository.save({
        ...product,
        Id: Number(id),
      });
      return result;
    } catch (error) {
      customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
    }
  }
}
