import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    async search(key: string): Promise<Customer[]> {
        return this.customersRepository.createQueryBuilder('customers').where('customers.ContactName Like \'%' + String(key) + '%\'').orWhere('customers.Phone Like \'%' + String(key) + '%\'').getMany();
    }
}
