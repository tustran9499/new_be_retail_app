import { Controller, Get, Query, SetMetadata, UseGuards, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from 'src/entities/customer/customer.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { CreateCustomerDto } from 'src/dto/customer/CreateCustomer.dto';

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

    @Post()
    @SetMetadata('roles', ['StoreManager', 'Salescleck'])
    @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
    createCustomer(
        @Body() model: CreateCustomerDto,
    ): Promise<Customer> {
        return this.CustomersService.createCustomer(model);
    }
}
