import { Module } from '@nestjs/common';
import { StoreproductsController } from './storeproducts.controller';
import { StoreproductsService } from './storeproducts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from 'src/entities/storeproduct/storeproduct.entity';
import { AccountsModule } from '../account/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct]), AccountsModule],
  controllers: [StoreproductsController],
  providers: [StoreproductsService],
  exports: [StoreproductsService],
})

export class StoreproductsModule { }
