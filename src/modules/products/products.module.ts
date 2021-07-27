import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../../entities/product/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { AccountsModule } from '../account/accounts.module';
import { StoreproductsModule } from '../storeproducts/storeproducts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    AccountsModule,
    StoreproductsModule
  ],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule { }
