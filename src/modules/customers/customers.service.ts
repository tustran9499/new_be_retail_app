import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from 'src/dto/customer/CreateCustomer.dto';
import { customThrowError } from 'src/common/helper/throw.helper';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.enum';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private customersRepository: Repository<Customer>,
    ) { }

    async search(key: string): Promise<Customer[]> {
        return this.customersRepository.createQueryBuilder('customers').where('customers.ContactName Like \'%' + String(key) + '%\'').orWhere('customers.Phone Like \'%' + String(key) + '%\'').getMany();
    }

    async createCustomer(model: CreateCustomerDto): Promise<Customer> {
        try {
            const result = await this.customersRepository.save(model);
            return result;
        } catch (error) {
            customThrowError(RESPONSE_MESSAGES.ERROR, HttpStatus.BAD_REQUEST, error);
        }
    }
}
