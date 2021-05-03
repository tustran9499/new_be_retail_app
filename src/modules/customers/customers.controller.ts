import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from 'src/entities/customer/customer.entity';

@ApiTags('Customer')
@Controller('customers')
export class CustomersController {
    constructor(private CustomersService: CustomersService) { }
    @Get('/search')
    @ApiOkResponse()
    getAllCustomers(
        @Query('key') key: string = "",
    ): Promise<Customer[]> {
        return this.CustomersService.search(key);
    }
}
