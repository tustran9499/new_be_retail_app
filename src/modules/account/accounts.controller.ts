import { Body, Delete, Post, Put, Query, Req } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RESPONSE_EXPLAINATION } from 'src/common/constants/response-messages.enum';
import { CreateAccountDto } from 'src/dto/account/CreateAccount.dto';
import { UpdateAccountDto } from 'src/dto/account/UpdateAccount.dto.';
import { AccountsService  } from './accounts.service';
import { GetRequest } from './dto/GetRequest.dto';

@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
    constructor(private AccountsService : AccountsService ) { }
    @Get()
    @ApiOkResponse({ description: RESPONSE_EXPLAINATION.GET_ACCOUNT})
    getCustomers(@Query() model: GetRequest): Promise<any> {
      return this.AccountsService .getAccounts(model);
    }

    @Get('/:id')
    @ApiOkResponse()
    getAccountById(@Param('id', ParseIntPipe) id: number): Promise<any> {
      return this.AccountsService .getAccountDetail(id);
    }

    @Post()
    async createAccount(
      @Body() model: CreateAccountDto,
      //@Body() model: Record<string, any>,
    ): Promise<Account> {
      return this.AccountsService .createAccount(model);
    }

    @Put('/:id')
    async updateAccount(
      @Param('id', ParseIntPipe) id: number,
      @Body() model: UpdateAccountDto,
    ): Promise<Account> {
      return this.AccountsService .updateAccount(id, model);
    }

    @Delete('/:id')
    deleteAccount(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<boolean> {
      return this.AccountsService .deleteAccount(id, /*currentUserId*/ 1);
    }
}
