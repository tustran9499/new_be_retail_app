import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/product/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule { }
