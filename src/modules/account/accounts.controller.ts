import {
  Body,
  Delete,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ACCOUNT_ACTION } from 'src/common/constants/account/account.action';
import { METADATA } from 'src/common/constants/metadata/metadata.constant';
import { RESPONSE_EXPLAINATION } from 'src/common/constants/response-messages.enum';
import { multerOptions } from 'src/common/helper/utility.helper';
import { CreateAccountDto } from 'src/dto/account/CreateAccount.dto';
import { LoginAccountDto } from 'src/dto/account/LoginAccount.dto';
import { LoginResponseDto } from 'src/dto/account/LoginResponse.dto';
import { UpdateAccountDto } from 'src/dto/account/UpdateAccount.dto.';
import { UploadFile } from 'src/dto/file/UploadFile.dto';
import { REFERENCE_TYPE } from 'src/entities/file/enums/referenceType.enum';
import { AccountsService } from './accounts.service';
import { GetRequest } from './dto/GetRequest.dto';
import { Request } from 'express';

@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}
  @Get()
  @ApiOkResponse({ description: RESPONSE_EXPLAINATION.GET_ACCOUNT })
  getCustomers(@Query() model: GetRequest): Promise<any> {
    return this.accountsService.getAccounts(model);
  }

  @Get('/deleted')
  @ApiOkResponse({ description: RESPONSE_EXPLAINATION.GET_ACCOUNT })
  getDeleted(@Query() model: GetRequest): Promise<any> {
    return this.accountsService.getDeletedAccounts(model);
  }

  @Get('/:id')
  @ApiOkResponse()
  getAccountById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.accountsService.getAccountDetail(id);
  }

  @Post()
  async createAccount(
    @Body() model: CreateAccountDto,
    //@Body() model: Record<string, any>,
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

  @Post(':id/upload-profile-img')
  @ApiBearerAuth()
  @SetMetadata(METADATA.ACTION, ACCOUNT_ACTION.UPDATE_PROFILE)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Id card front img upload',
    type: UploadFile,
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateProfileImg(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) targetId: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return await this.accountsService.uploadFile(
      file,
      targetId,
      //(request as any).user.id,
      1,
      REFERENCE_TYPE.PROFILE_IMG,
    );
  }

  @Delete('files/:id/:type')
  @SetMetadata(METADATA.ACTION, ACCOUNT_ACTION.DELETE_FILE)
  async deleteFile(
    @Param('id', ParseIntPipe) targetId: number,
    @Param('type', ParseIntPipe) type: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return await this.accountsService.deleteFile(
      targetId,
      type,
      //(request as any).user.id,
      1,
    );
  }

  @Post(':id/restore')
  @SetMetadata(METADATA.ACTION, ACCOUNT_ACTION.RESTORE_ACCOUNT)
  restoreAdmin(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.accountsService.restoreAccount(id);
  }
}
