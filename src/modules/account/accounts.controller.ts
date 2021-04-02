import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { METADATA } from 'src/common/constants/metadata/metadata.constant';
import { RESPONSE_EXPLAINATION } from 'src/common/constants/response-messages.enum';
import { CreateAccountDto } from 'src/dto/account/CreateAccount.dto';
import { LoginAccountDto } from 'src/dto/account/LoginAccount.dto';
import { LoginResponseDto } from 'src/dto/account/LoginResponse.dto';
import { UpdateAccountDto } from 'src/dto/account/UpdateAccount.dto.';
import { AccountsService } from './accounts.service';
import { GetRequest } from './dto/GetRequest.dto';

@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}
  @Get()
  @ApiOkResponse({ description: RESPONSE_EXPLAINATION.GET_ACCOUNT })
  getCustomers(@Query() model: GetRequest): Promise<any> {
    return this.accountsService.getAccounts(model);
  }

  @Get('/:id')
  @ApiOkResponse()
  getAccountById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.accountsService.getAccountDetail(id);
  }

  @Post()
  @SetMetadata(METADATA.IS_PUBLIC, true)
  async createAccount(
    //@Body() model: CreateAccountDto,
    @Body() model: Record<string, any>,
  ): Promise<Account> {
    return this.accountsService.createAccount(model);
  }

  @Put('/:id')
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() model: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.updateAccount(id, model);
  }

  @Delete('/:id')
  deleteAccount(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.accountsService.deleteAccount(id, /*currentUserId*/ 1);
  }

  @Post('login')
  // @SetMetadata(METADATA.IS_PUBLIC, true)
  login(@Body() model: LoginAccountDto): Promise<LoginResponseDto> {
    return this.accountsService.login(model);
  }

  @Get('/role/:id')
  getAccountRole(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.accountsService.getAccountRole(id);
  }

  @SetMetadata(METADATA.IS_PUBLIC, true)
  @Get('verify-email/:token')
  verifyEmail(@Param('token') token: string): Promise<boolean> {
    return this.accountsService.verifyAccount(token);
  }
}
