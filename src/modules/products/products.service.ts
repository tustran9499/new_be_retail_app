import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Product } from 'src/entities/product/product.entity';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateProductDto } from 'src/dto/product/CreateProduct.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';
import { UpdateProductDto } from 'src/dto/product/UpdateProduct.dto.';
import { Like } from "typeorm";
import { CategoriesService } from '../categories/categories.service';
import { Category } from 'src/entities/product/category.entity';
var timeseries = require("timeseries-analysis");

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        private categoriesService: CategoriesService,
    ) { }

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

    async remove(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
        console.log(paginate<Product>(this.productsRepository, options))
        return paginate<Product>(this.productsRepository, options);
    }

    async searchProduct(key: string, options: IPaginationOptions): Promise<Pagination<Product>> {
        if (key && key != undefined && key !== null && key !== '') {
            const queryBuilder = this.productsRepository.createQueryBuilder('products').leftJoinAndSelect("products.Category", "Category").where('products.ProductName Like \'%' + String(key) + '%\'').orWhere('products.Id Like \'%' + String(key) + '%\'').orderBy('products.ProductName', 'ASC');
            const result = paginate<Product>(queryBuilder, options);
            console.log("------------------------------------------")
            console.log(result);
            return paginate<Product>(queryBuilder, options);
        }
        else {
            const queryBuilder = this.productsRepository.createQueryBuilder('products').leftJoinAndSelect("products.Category", "Category").orderBy('products.Id', 'ASC');
            console.log("------------------------------------------")
            console.log(queryBuilder.getMany());
            return paginate<Product>(queryBuilder, options);
        }
    }

    async getPromotion(id: number): Promise<number> {
        var data = await this.productsRepository.query("GetProductPromotion @Id='" + id + "'");
        if (data && data[0]) {
            return Number(data[0].PercentOff);
        }
        else {
            0;
        }
    }

    async getTimeSeriesSale(id: number): Promise<any> {
        var data = await this.productsRepository.query("GetTimeSeriesSale @ProductId='" + id + "'");
        var newData = [];
        for (let step = 0; step < 15; step++) {
            var tempdate = new Date();
            tempdate.setDate(new Date().getDate() - step);
            if (data.length != 0 && new Date(data[data.length - 1].Date).getDate() == tempdate.getDate()) {
                newData.push(data[data.length - 1]);
                data.pop();
            }
            else {
                newData.push({ Date: tempdate, Value: 0 });
            }
        }
        newData.reverse();
        for (let step = 0; step < 15; step++) {
            var tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + step);
            newData.push({ Date: tomorrow, Value: 0 });
        }
        var t = new timeseries.main(timeseries.adapter.fromDB(newData, {
            date: 'Date',     // Name of the property containing the Date (must be compatible with new Date(date) )
            value: 'Value'     // Name of the property containign the value. here we'll use the "close" price.
        }));
        // t.smoother({ period: 3 }).save('smoothed');
        var bestSettings = t.regression_forecast_optimize();
        var options = {
            n: 15, // How many data points to be forecasted
            sample: 14, // How many datapoints to be training dataset
            start: 15, // Initial forecasting position 
            method: bestSettings.method, // What method for forecasting
            degree: bestSettings.degree, // How many degree for forecasting
            // growthSampleMode: false, // Is the sample use only last x data points or up to entire data points?
        }
        var MSE = t.regression_forecast(options)
        return t;
    }

    async createProduct(model: CreateProductDto): Promise<Product> {
        try {
            const result = await this.productsRepository.save(model);
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async updateProduct(id: number, model: UpdateProductDto): Promise<Product> {
        try {
            const result = await this.productsRepository.save({ ...model, Id: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async decreaseProductQuantity(id: number, decrease: number): Promise<Product> {
        try {
            const item = await this.productsRepository.findOne(id);
            var updateValue = 0;
            if (item.UnitsInStock > decrease) {
                updateValue = item.UnitsInStock - decrease;
            }
            const result = await this.productsRepository.save({ ...item, UnitsInStock: updateValue });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async deleteProduct(id: number): Promise<Product> {
        try {
            let product = await this.productsRepository.findOne(id)
            product.Discontinued = true;
            const result = await this.productsRepository.save({ ...product, Id: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }

    async updateProductImg(id: number, ImagePath: string) {
        try {
            let product = await this.productsRepository.findOne(id)
            product.PhotoURL = ImagePath;
            const result = await this.productsRepository.save({ ...product, Id: Number(id) });
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
