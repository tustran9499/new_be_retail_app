import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/product/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }
}
